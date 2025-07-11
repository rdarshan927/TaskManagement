const request = require('supertest');
const app = require('../app');

describe('Task API Endpoints', () => {
  let token;
  let taskId;

  // First create and authenticate a user before any task tests
  beforeAll(async () => {
    // Create test user
    const userData = {
      name: 'Task Test User',
      email: 'tasktest@example.com',
      password: 'password123'
    };
    
    const userResponse = await request(app)
      .post('/api/users')
      .send(userData);
    
    // Store the token for all task tests
    token = userResponse.body.token;
    console.log('Task test auth token:', token);
  });

  it('should create a task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'todo',
      priority: 'medium'
    };
    
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData);
    
    // Save task ID for later tests
    taskId = response.body._id;
    
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(taskData.title);
  });

  it('should get all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a task', async () => {
    const updateData = {
      title: 'Updated Task',
      status: 'in-progress'
    };
    
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updateData.title);
    expect(response.body.status).toBe(updateData.status);
  });

  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    
    // Verify task is deleted
    const getResponse = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    
    const deletedTask = getResponse.body.find(task => task._id === taskId);
    expect(deletedTask).toBeUndefined();
  });
});