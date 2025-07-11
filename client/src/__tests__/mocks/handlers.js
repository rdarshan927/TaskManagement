// For MSW v2
import { http, HttpResponse } from 'msw';

export const handlers = [
  // For MSW v2 syntax
  http.post('/api/users/login', async ({ request }) => {
    const { email } = await request.json();
    
    if (email === 'test@example.com') {
      return HttpResponse.json({
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        token: 'fake-token-123'
      });
    }
    
    if (email === '2fa@example.com') {
      return HttpResponse.json({
        requiresTwoFactor: true,
        userId: '123'
      });
    }
    
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),
  
  // Get tasks handler
  http.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { _id: '1', title: 'Test Task 1', status: 'todo', priority: 'medium' },
        { _id: '2', title: 'Test Task 2', status: 'in-progress', priority: 'high' }
      ])
    );
  }),
  
  // Create task handler
  http.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        _id: '3',
        title,
        status: req.body.status || 'todo',
        priority: req.body.priority || 'medium',
        user: '123'
      })
    );
  })
];