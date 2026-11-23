import express from 'express' 
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import cors from 'cors' 
import dotenv from 'dotenv'
import uploadRoutes, { handleUploadErrors } from './routes/uploads.js'
import { upload, fileUrl } from './middleware/upload.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ silent: true })

// load mock JSON data
const organizations = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'organizations.json'), 'utf8')
)

const flyers = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'flyers.json'), 'utf8')
)

app.use(cors())
app.use(morgan('dev'))

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.use('/static', express.static('public'))

// flyer image uploads (Multer)
app.use('/api/uploads', uploadRoutes)

// FormData sends categories as a JSON string; JSON clients send an array.
function parseCategories(categories) {
  if (typeof categories !== 'string') {
    return categories
  }
  try {
    return JSON.parse(categories)
  } catch {
    return categories
  }
}

app.get('/', (req, res) => {
  res.send('Flier backend is running!')
})

app.get('/api/flyers', (req, res) => {
  try {
    // TODO: Replace in Sprint 3 with proper database query
    const { category } = req.query

    // some filter on category was somehow applied, but isn't a string
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ success: false, message: 'category must be a single string.' })
    }

    // find if the filter exists and use it, also set up a sort by date
    const matchesCategory = flyer => flyer.categories?.includes(category)
    const byStartDate = (a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at)

    let flyerList = [...flyers]

    if (category) {
      flyerList = flyerList.filter(matchesCategory)
    }

    flyerList.sort(byStartDate)

    // attach the org names so that the frontend can read a real string instead of IDs
    const flyersWithOrganizationNames = flyerList.map(flyer => ({
      ...flyer,
      organizationName:
        organizations.find(org => org.id === flyer.organizationId)?.name ?? null,
    }))

    return res.status(200).json({ success: true, flyers: flyersWithOrganizationNames })
  } catch (err) {
    console.error('GET /api/flyers failed:', err)
    return res.status(500).json({ success: false, message: 'Something went wrong.' })
  }
})

// Accepts JSON or multipart FormData (image file + event fields together).
app.post('/api/flyers', upload.single('image'), (req, res) => {
  try {
    const body = req.body ?? {}
    const title = body.title
    const categories = parseCategories(body.categories)
    const starts_at = body.starts_at
    const location = body.location
    const organizationId = body.organizationId
    const description = body.description
    const image = req.file ? fileUrl(req.file) : body.image

    // Check for missing fields and throw a 400 if fields are missing
    const fields = { title, categories, starts_at, location, image, organizationId, description }
    const missing = Object.keys(fields).filter(key => !fields[key])
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` })
    }

    // Type & shape checks for category and date field
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ success: false, message: 'categories must be a non-empty array.' })
    }
    if (Number.isNaN(Date.parse(starts_at))) {
      return res.status(400).json({ success: false, message: 'starts_at must be a valid date.' })
    }

    // TODO: Replace in Sprint 3 with proper database query
    const org = organizations.find(o => String(o.id) === String(organizationId))
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' })
    }

    // TODO: Replace in Sprint 3 with proper database insert
    const nextId = String(flyers.reduce((max, f) => Math.max(max, Number(f.id) || 0), 0) + 1)

    // Whitelist fields so clients can't inject extra properties
    const newFlyer = { id: nextId, title, categories, starts_at, location, image, organizationId, description }
    flyers.push(newFlyer)
    org.flyers.push(nextId)

    return res.status(201).json({ success: true, flyer: newFlyer })
  } catch (err) {
    console.error('POST /api/flyers failed:', err)
    return res.status(500).json({ success: false, message: 'Something went wrong.' })
  }
})

app.post('/api/users/saved-flyers/:id', (req, res) => {
  const flyerId = req.params.id

  const flyer = flyers.find(f => String(f.id) === String(flyerId))

  if (!flyer) {
    return res.status(404).json({
      status: 'error',
      message: `Flyer #${flyerId} not found`,
    })
  }

  const responseData = {
    status: 'success',
    message: `Flyer #${flyerId} has been saved to user's saved flyers.`,
    savedFlyerId: flyerId,
    flyer,
  }

  res.status(201).json(responseData)
})

app.get('/api/organizations', (req, res) => {
  res.status(200).json(organizations)
})

app.get('/api/organizations/:id', (req, res) => {
  const orgId = req.params.id

  const organization = organizations.find(org => String(org.id) === String(orgId))

  if (!organization) {
    return res.status(404).json({
      status: 'error',
      message: `Organization #${orgId} not found`,
    })
  }

  res.status(200).json(organization)
})

// Multer errors from POST /api/flyers (and any future upload.single usage).
app.use(handleUploadErrors)

export default app