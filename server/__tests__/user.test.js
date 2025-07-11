const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');

describe('User API Endpoints', () => {
  let token;
  let userId;
  const testUserEmail = 'test@example.com';
  const testUserPassword = 'password123';

  it('should register a new user', async () => {
    const userData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe(userData.email);
  });

  it('should login a user', async () => {
    // First create a user to login with
    const userData = {
      name: 'Test User',
      email: testUserEmail,
      password: testUserPassword
    };
    
    await request(app)
      .post('/api/users')
      .send(userData);
    
    // Now try to login
    const loginData = {
      email: testUserEmail,
      password: testUserPassword
    };
    
    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);
    
    token = response.body.token;
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should get user profile', async () => {
    // Skip if login failed
    if (!token) {
      console.log('Skipping profile test due to failed login');
      return;
    }
    
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(testUserEmail);
  });
});