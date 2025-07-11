import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import api from '../services/api'; // Adjust the import based on your project structure

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');
  const [isUsingBackupCode, setIsUsingBackupCode] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', formData);
      if (response.data.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setUserId(response.data.userId);
      } else {
        // Store token and update auth context
        localStorage.setItem('token', response.data.token);
        await login(response.data); // Make sure you're calling the login function
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyTwoFactor = async () => {
    try {
      setLoading(true);
      console.log("Sending params:", { userId, token, isBackupCode: isUsingBackupCode });
      
      const response = await api.post('/users/verify-2fa', { 
        userId, 
        token,
        isBackupCode: isUsingBackupCode // Fixed parameter name
      });
      
      // Save token and update auth context
      localStorage.setItem('token', response.data.token);
      await login(response.data);
      navigate('/');
    } catch (err) {
      console.error("Verification error:", err.response?.data);
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        
        {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {requiresTwoFactor && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
            
            <div className="flex justify-between mb-2">
              <button 
                onClick={() => setIsUsingBackupCode(false)}
                className={`px-3 py-1 rounded ${!isUsingBackupCode ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                Authenticator Code
              </button>
              <button 
                onClick={() => setIsUsingBackupCode(true)}
                className={`px-3 py-1 rounded ${isUsingBackupCode ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                Backup Code
              </button>
            </div>
            
            {isUsingBackupCode ? (
              <p>Enter one of your backup codes:</p>
            ) : (
              <p>Enter the code from your authenticator app:</p>
            )}
            
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isUsingBackupCode ? "Enter backup code" : "Enter 6-digit code"}
            />
            <button 
              onClick={verifyTwoFactor} 
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Verify
            </button>
          </div>
        )}
        
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;