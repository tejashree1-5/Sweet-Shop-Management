const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const mongoose = require('mongoose');

describe('Sweet Routes', () => {
  let userToken;
  let adminToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
    adminToken = adminRes.body.token;
    adminUser = adminRes.body.user;

    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123'
      });
    userToken = userRes.body.token;
    regularUser = userRes.body.user;
  });

  describe('POST /api/sweets', () => {
    it('should create a sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Chocolate Bar');
      expect(response.body.price).toBe(2.50);
    });

    it('should not allow regular user to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets for authenticated user', async () => {
      // Create a sweet as admin first
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Candy',
          category: 'Sugar',
          price: 1.00,
          quantity: 50
        });

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should decrease quantity when purchasing', async () => {
      // Create a sweet
      const createRes = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate',
          category: 'Chocolate',
          price: 2.00,
          quantity: 10
        });

      const sweetId = createRes.body._id;

      // Purchase the sweet
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(9);
    });

    it('should not allow purchase when out of stock', async () => {
      const createRes = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Out of Stock',
          category: 'Test',
          price: 1.00,
          quantity: 0
        });

      const sweetId = createRes.body._id;

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('out of stock');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should increase quantity when restocking as admin', async () => {
      const createRes = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Low Stock',
          category: 'Test',
          price: 1.00,
          quantity: 5
        });

      const sweetId = createRes.body._id;

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(15);
    });
  });
});

