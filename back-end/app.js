import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploads.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ silent: true });

// load mock JSON data
const organizations = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'organizations.json'), 'utf8')
);

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));

const flyers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'flyers.json'), 'utf8'));

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

// flyer image uploads (Multer)
app.use('/api/uploads', uploadRoutes);

function withOrganizationName(flyer) {
  return {
    ...flyer,
    organizationName:
      organizations.find(org => String(org.id) === String(flyer.organizationId))?.name ?? null,
  };
}

function readFlyerFields(body = {}) {
  const { title, categories, starts_at, location, image, organizationId, description } = body;
  return { title, categories, starts_at, location, image, organizationId, description };
}

function validateFlyerFields(fields, { partial = false } = {}) {
  if (!partial) {
    const missing = Object.keys(fields).filter(key => !fields[key]);
    if (missing.length) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }

  if (fields.categories !== undefined) {
    if (!Array.isArray(fields.categories) || fields.categories.length === 0) {
      return 'categories must be a non-empty array.';
    }
  }

  if (fields.starts_at !== undefined && Number.isNaN(Date.parse(fields.starts_at))) {
    return 'starts_at must be a valid date.';
  }

  return null;
}

function findFlyerIndex(id) {
  return flyers.findIndex(f => String(f.id) === String(id));
}

function findOrganization(id) {
  return organizations.find(o => String(o.id) === String(id));
}

function findUser(id) {
  return users.find(user => String(user.id) === String(id));
}

// Keep each organization's flyer id list in sync when a flyer changes clubs.
function moveFlyerBetweenOrganizations(flyerId, fromOrgId, toOrgId) {
  if (String(fromOrgId) === String(toOrgId)) {
    return;
  }

  const fromOrg = findOrganization(fromOrgId);
  const toOrg = findOrganization(toOrgId);

  if (fromOrg?.flyers) {
    fromOrg.flyers = fromOrg.flyers.filter(id => String(id) !== String(flyerId));
  }
  if (toOrg && !toOrg.flyers.some(id => String(id) === String(flyerId))) {
    toOrg.flyers.push(String(flyerId));
  }
}

app.get('/', (req, res) => {
  res.send('Flier backend is running!');
});

app.get('/api/flyers', (req, res) => {
  try {
    // TODO: Replace in Sprint 3 with proper database query
    const { category } = req.query;

    // some filter on category was somehow applied, but isn't a string
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ success: false, message: 'category must be a single string.' });
    }

    // find if the filter exists and use it, also set up a sort by date
    const matchesCategory = flyer => flyer.categories?.includes(category);
    const byStartDate = (a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at);

    let flyerList = [...flyers];

    if (category) {
      flyerList = flyerList.filter(matchesCategory);
    }

    flyerList.sort(byStartDate);

    // attach the org names so that the frontend can read a real string instead of IDs
    return res.status(200).json({
      success: true,
      flyers: flyerList.map(withOrganizationName),
    });
  } catch (err) {
    console.error('GET /api/flyers failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.post('/api/flyers', (req, res) => {
  try {
    const fields = readFlyerFields(req.body);
    const validationError = validateFlyerFields(fields);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // TODO: Replace in Sprint 3 with proper database query
    const org = findOrganization(fields.organizationId);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    // TODO: Replace in Sprint 3 with proper database insert
    const nextId = String(flyers.reduce((max, f) => Math.max(max, Number(f.id) || 0), 0) + 1);

    // Whitelist fields so clients can't inject extra properties
    const newFlyer = { id: nextId, ...fields };
    flyers.push(newFlyer);
    org.flyers.push(nextId);

    return res.status(201).json({ success: true, flyer: withOrganizationName(newFlyer) });
  } catch (err) {
    console.error('POST /api/flyers failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.get('/api/flyers/:id', (req, res) => {
  try {
    // TODO: Replace in Sprint 3 with proper database query
    const flyerIndex = findFlyerIndex(req.params.id);
    if (flyerIndex === -1) {
      return res.status(404).json({ success: false, message: 'Flyer not found.' });
    }

    return res.status(200).json({
      success: true,
      flyer: withOrganizationName(flyers[flyerIndex]),
    });
  } catch (err) {
    console.error('GET /api/flyers/:id failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.put('/api/flyers/:id', (req, res) => {
  try {
    // TODO: Replace in Sprint 3 with proper database query
    const flyerIndex = findFlyerIndex(req.params.id);
    if (flyerIndex === -1) {
      return res.status(404).json({ success: false, message: 'Flyer not found.' });
    }

    const updates = Object.fromEntries(
      Object.entries(readFlyerFields(req.body)).filter(([, value]) => value !== undefined)
    );
    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one flyer field to update.',
      });
    }

    const validationError = validateFlyerFields(updates, { partial: true });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const current = flyers[flyerIndex];

    if (updates.organizationId !== undefined) {
      const org = findOrganization(updates.organizationId);
      if (!org) {
        return res.status(404).json({ success: false, message: 'Organization not found.' });
      }
      moveFlyerBetweenOrganizations(current.id, current.organizationId, updates.organizationId);
    }

    // TODO: Replace in Sprint 3 with proper database update
    const updatedFlyer = { ...current, ...updates, id: current.id };
    flyers[flyerIndex] = updatedFlyer;

    return res.status(200).json({ success: true, flyer: withOrganizationName(updatedFlyer) });
  } catch (err) {
    console.error('PUT /api/flyers/:id failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.post('/api/users/saved-flyers/:id', (req, res) => {
  const flyerId = req.params.id;

  const flyer = flyers.find(f => String(f.id) === String(flyerId));

  if (!flyer) {
    return res.status(404).json({
      status: 'error',
      message: `Flyer #${flyerId} not found`,
    });
  }

  const responseData = {
    status: 'success',
    message: `Flyer #${flyerId} has been saved to user's saved flyers.`,
    savedFlyerId: flyerId,
    flyer,
  };

  res.status(201).json(responseData);
});

app.get('/api/organizations', (req, res) => {
  try {
    // TODO: Replace in Sprint 3 with proper database query
    return res.status(200).json({ success: true, organizations });
  } catch (err) {
    console.error('GET /api/organizations failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.get('/api/organizations/:id', (req, res) => {
  try {
    const orgId = req.params.id;

    // TODO: Replace in Sprint 3 with proper database query
    const organization = organizations.find(org => String(org.id) === String(orgId));

    if (!organization) {
      return res.status(404).json({ success: false, message: `Organization #${orgId} not found.` });
    }

    return res.status(200).json({ success: true, organization });
  } catch (err) {
    console.error('GET /api/organizations/:id failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.get('/api/users/:userId/favorites', (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Replace in Sprint 3 with proper database query
    const user = findUser(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: `User #${userId} not found.` });
    }

    const favoriteOrganizationIds = user.favoriteOrganizationIds;
    const favoriteOrganizations = favoriteOrganizationIds.map(findOrganization).filter(Boolean);

    return res.status(200).json({
      success: true,
      favoriteOrganizationIds,
      organizations: favoriteOrganizations,
    });
  } catch (err) {
    console.error('GET /api/users/:userId/favorites failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.post('/api/users/:userId/favorites/:orgId', (req, res) => {
  try {
    const { userId, orgId } = req.params;

    // TODO: Replace in Sprint 3 with proper database query
    const user = findUser(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: `User #${userId} not found.` });
    }

    const organization = findOrganization(orgId);
    if (!organization) {
      return res.status(404).json({ success: false, message: `Organization #${orgId} not found.` });
    }

    const favoriteOrganizationId = String(orgId);
    if (!user.favoriteOrganizationIds.some(id => String(id) === favoriteOrganizationId)) {
      user.favoriteOrganizationIds.push(favoriteOrganizationId);
    }

    return res
      .status(200)
      .json({ success: true, favoriteOrganizationIds: user.favoriteOrganizationIds });
  } catch (err) {
    console.error('POST /api/users/:userId/favorites/:orgId failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.delete('/api/users/:userId/favorites/:orgId', (req, res) => {
  try {
    const { userId, orgId } = req.params;

    // TODO: Replace in Sprint 3 with proper database query
    const user = findUser(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: `User #${userId} not found.` });
    }

    user.favoriteOrganizationIds = user.favoriteOrganizationIds.filter(
      id => String(id) !== String(orgId)
    );

    return res
      .status(200)
      .json({ success: true, favoriteOrganizationIds: user.favoriteOrganizationIds });
  } catch (err) {
    console.error('DELETE /api/users/:userId/favorites/:orgId failed:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

export default app;
