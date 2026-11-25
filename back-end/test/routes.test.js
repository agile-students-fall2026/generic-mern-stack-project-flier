import { use, expect } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import app from '../app.js';

use(chaiHttp);

const validFlyer = {
  title: 'Test Event',
  categories: ['Technical'],
  starts_at: '2026-12-10T18:00:00Z',
  location: 'Kimmel Center',
  image: 'https://picsum.photos/200/300',
  organizationId: '1',
  description: 'A test event.',
};

describe('Flier API Routes', () => {
  describe('GET /api/flyers', () => {
    it('returns the flyer list as JSON', async () => {
      const res = await request.execute(app).get('/api/flyers');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body.success).to.equal(true);
      expect(res.body.flyers).to.be.an('array').that.is.not.empty;
    });

    it('filters flyers by category', async () => {
      const res = await request.execute(app).get('/api/flyers?category=Technical');

      expect(res).to.have.status(200)
      expect(res.body.success).to.equal(true)
      expect(res.body.flyers).to.be.an('array').that.is.not.empty
      expect(res.body.flyers.every(flyer => flyer.categories.includes('Technical'))).to.equal(true)
    })

    it('filters flyers by search term', async () => {
      const res = await request.execute(app).get('/api/flyers?search=hackathon')

      expect(res).to.have.status(200)
      expect(res.body.success).to.equal(true)
      expect(res.body.flyers).to.be.an('array').that.is.not.empty
      expect(
        res.body.flyers.every(flyer =>
          [flyer.title, flyer.description, flyer.location, flyer.organizationName]
            .some(field => String(field || '').toLowerCase().includes('hackathon'))
        )
      ).to.equal(true)
    })

    it('filters flyers by category and search together', async () => {
      const res = await request
        .execute(app)
        .get('/api/flyers?category=Technical&search=express')

      expect(res).to.have.status(200)
      expect(res.body.success).to.equal(true)
      expect(res.body.flyers).to.be.an('array').that.is.not.empty
      expect(res.body.flyers.every(flyer => flyer.categories.includes('Technical'))).to.equal(true)
      expect(
        res.body.flyers.every(flyer =>
          [flyer.title, flyer.description, flyer.location, flyer.organizationName]
            .some(field => String(field || '').toLowerCase().includes('express'))
        )
      ).to.equal(true)
    })
  })

  describe('POST /api/flyers', () => {
    it('creates a flyer for an existing organization', async () => {
      const res = await request.execute(app).post('/api/flyers').send(validFlyer);

      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body.success).to.equal(true);
      expect(res.body.flyer).to.include({
        title: validFlyer.title,
        organizationId: validFlyer.organizationId,
      });
      expect(res.body.flyer.id).to.be.a('string');
    });

    it('returns 400 when required flyer data is missing', async () => {
      const res = await request
        .execute(app)
        .post('/api/flyers')
        .send({ title: 'Incomplete flyer' });

      expect(res).to.have.status(400);
      expect(res.body.success).to.equal(false);
    });

    it('returns 404 when the organization does not exist', async () => {
      const res = await request
        .execute(app)
        .post('/api/flyers')
        .send({
          ...validFlyer,
          organizationId: '999',
        });

      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /api/flyers/:id', () => {
    it('returns a single flyer by id', async () => {
      const res = await request.execute(app).get('/api/flyers/1');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body.success).to.equal(true);
      expect(res.body.flyer).to.include({ id: '1' });
      expect(res.body.flyer).to.have.property('title');
      expect(res.body.flyer).to.have.property('location');
      expect(res.body.flyer).to.have.property('organizationName').that.is.a('string');
    });

    it('returns 404 when the flyer does not exist', async () => {
      const res = await request.execute(app).get('/api/flyers/invalid');

      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Flyer not found.');
    });
  });

  describe('PUT /api/flyers/:id', () => {
    it('updates an existing flyer and keeps untouched fields', async () => {
      const before = await request.execute(app).get('/api/flyers/2');
      const originalDescription = before.body.flyer.description;

      const res = await request.execute(app).put('/api/flyers/2').send({
        title: 'Updated Express Workshop',
        location: 'Kimmel Center',
      });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body.success).to.equal(true);
      expect(res.body.flyer).to.include({
        id: '2',
        title: 'Updated Express Workshop',
        location: 'Kimmel Center',
        description: originalDescription,
      });
      expect(res.body.flyer).to.have.property('organizationName');
    });

    it('moves a flyer to another organization', async () => {
      const res = await request.execute(app).put('/api/flyers/5').send({
        organizationId: '2',
      });

      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.flyer).to.include({ id: '5', organizationId: '2' });
      expect(res.body.flyer.organizationName).to.equal('NYU Design Collective');
    });

    it('returns 400 when no flyer fields are provided', async () => {
      const res = await request.execute(app).put('/api/flyers/1').send({});

      expect(res).to.have.status(400);
      expect(res.body.success).to.equal(false);
    });

    it('returns 400 when starts_at is invalid', async () => {
      const res = await request.execute(app).put('/api/flyers/1').send({ starts_at: 'not-a-date' });

      expect(res).to.have.status(400);
      expect(res.body.success).to.equal(false);
    });

    it('returns 404 when the flyer does not exist', async () => {
      const res = await request.execute(app).put('/api/flyers/invalid').send({ title: 'Nope' });

      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
    });

    it('returns 404 when the organization does not exist', async () => {
      const res = await request.execute(app).put('/api/flyers/1').send({ organizationId: '999' });

      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Organization not found.');
    });
  });

  describe('POST /api/users/saved-flyers/:id', () => {
    it('should respond with HTTP 201 and confirm the flyer was saved', done => {
      request
        .execute(app)
        .post('/api/users/saved-flyers/1')
        .end((err, res) => {
          expect(err).to.be.null; // not null
          expect(res).to.have.status(201); // HTTP response status code
          expect(res).to.be.json; // HTTP response content type header
          expect(res.body).to.have.property('status').that.equals('success');
          expect(res.body).to.have.property('savedFlyerId').that.equals('1');
          expect(res.body).to.have.property('flyer');
          done();
        });
    });

    it('should respond with HTTP 404 when flyer is not found', done => {
      request
        .execute(app)
        .post('/api/users/saved-flyers/invalid')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res).to.be.json;
          expect(res.body).to.have.property('status').that.equals('error');
          done();
        });
    });
  });

  describe('GET /api/organizations/:id', () => {
    it('should respond with HTTP 200 and return organization details', done => {
      request
        .execute(app)
        .get('/api/organizations/1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.success).to.equal(true);
          expect(res.body.organization).to.have.property('id').that.equals('1');
          expect(res.body.organization).to.have.property('name');
          done();
        });
    });

    it('should respond with HTTP 404 when organization is not found', done => {
      request
        .execute(app)
        .get('/api/organizations/999')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res).to.be.json;
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });

  describe('GET /api/organizations', () => {
    it('returns the organization list in the standard API response shape', async () => {
      const res = await request.execute(app).get('/api/organizations');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body.success).to.equal(true);
      expect(res.body.organizations).to.be.an('array').that.is.not.empty;
    });
  });
});
