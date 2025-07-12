import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import { buttonVariants, inputFocusStyles } from '../utils/theme';
import AuthHeader from '../components/layout/AuthHeader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword: _, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-light">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <AuthHeader />
        
        <h2 className="text-2xl font-bold text-center text-dark-dark">Register</h2>
        
        {error && <div className="p-3 text-sm text-status-error bg-status-error/10 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-DEFAULT">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${inputFocusStyles}`}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-DEFAULT">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${inputFocusStyles}`}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-DEFAULT">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${inputFocusStyles}`}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-DEFAULT">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${inputFocusStyles}`}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 ${buttonVariants.primary} disabled:opacity-50`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center text-dark-light">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-DEFAULT hover:text-primary-dark">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;