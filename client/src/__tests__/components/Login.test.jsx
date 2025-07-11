import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/authUtils';
import Login from '../../pages/Login';

// Remove server import for now to simplify testing
// import { server } from '../mocks/server';

// Comment out MSW server for now
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock API calls
jest.mock('../../services/api', () => ({
  post: jest.fn((url, data) => {
    if (url === '/users/login') {
      if (data.email === 'test@example.com') {
        return Promise.resolve({ 
          data: { 
            _id: '123', 
            name: 'Test User', 
            email: 'test@example.com', 
            token: 'fake-token-123' 
          } 
        });
      }
      if (data.email === '2fa@example.com') {
        return Promise.resolve({ 
          data: { 
            requiresTwoFactor: true, 
            userId: '123' 
          } 
        });
      }
      return Promise.reject({ 
        response: { data: { message: 'Invalid credentials' } } 
      });
    }
    return Promise.resolve({ data: {} });
  })
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles normal login successfully', async () => {
    renderLogin();
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for login process
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows 2FA form when required', async () => {
    renderLogin();
    
    // Fill form with 2FA user
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: '2fa@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for 2FA form
    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
    });
  });

  it('handles login errors correctly', async () => {
    renderLogin();
    
    // Fill form with wrong credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});