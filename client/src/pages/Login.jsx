import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import api from '../services/api';
import { buttonVariants, inputFocusStyles } from '../utils/theme';
import AuthHeader from '../components/layout/AuthHeader';

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
        await login(response.data);
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
        isBackupCode: isUsingBackupCode
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-light p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* AuthHeader */}
        <AuthHeader />
        
        <h1 className="text-2xl font-bold text-center text-dark-dark">Login</h1>
        
        {error && <div className="p-3 bg-status-error/10 text-status-error rounded-md">{error}</div>}
        
        {!requiresTwoFactor ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 ${buttonVariants.primary} disabled:opacity-50`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark-dark">Two-Factor Authentication</h2>
            
            <div className="flex justify-between mb-2">
              <button 
                onClick={() => setIsUsingBackupCode(false)}
                className={`px-3 py-1 rounded ${!isUsingBackupCode ? buttonVariants.primary : 'bg-neutral-light text-dark-DEFAULT'}`}
              >
                Authenticator Code
              </button>
              <button 
                onClick={() => setIsUsingBackupCode(true)}
                className={`px-3 py-1 rounded ${isUsingBackupCode ? buttonVariants.primary : 'bg-neutral-light text-dark-DEFAULT'}`}
              >
                Backup Code
              </button>
            </div>
            
            {isUsingBackupCode ? (
              <p className="text-dark-light">Enter one of your backup codes:</p>
            ) : (
              <p className="text-dark-light">Enter the code from your authenticator app:</p>
            )}
            
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${inputFocusStyles}`}
              placeholder={isUsingBackupCode ? "Enter backup code" : "Enter 6-digit code"}
            />
            <button 
              onClick={verifyTwoFactor} 
              className={`w-full px-4 py-2 ${buttonVariants.primary}`}
            >
              Verify
            </button>
          </div>
        )}
        
        <p className="text-center text-dark-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-DEFAULT hover:text-primary-dark">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;