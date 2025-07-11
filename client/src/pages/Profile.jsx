import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import TwoFactorSetup from '../components/TwoFactorSetup';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    twoFactorEnabled: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me');
        setProfileData({
          name: response.data.name,
          email: response.data.email,
          twoFactorEnabled: response.data.twoFactorEnabled || false
        });
        setError(null);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const goToDashboard = () => {
    navigate('/');
  };

  const disableTwoFactor = async () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      try {
        setLoading(true);
        const response = await api.post('/users/2fa/disable');
        if (response.data.success) {
          // Update profile data
          setProfileData({
            ...profileData,
            twoFactorEnabled: false
          });
          // Hide 2FA setup if it's showing
          setShowTwoFactorSetup(false);
        }
      } catch (err) {
        setError('Failed to disable 2FA');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">User Profile</h1>
              <button 
                onClick={goToDashboard}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              {error}
            </div>
          ) : (
            <div className="p-6">
              {/* Profile Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {profileData.name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {profileData.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Two-Factor Authentication
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md flex justify-between items-center">
                      <span>
                        {profileData.twoFactorEnabled ? (
                          <span className="text-green-600 font-medium">Enabled</span>
                        ) : (
                          <span className="text-red-600 font-medium">Disabled</span>
                        )}
                      </span>
                      <button
                        onClick={profileData.twoFactorEnabled ? disableTwoFactor : () => setShowTwoFactorSetup(!showTwoFactorSetup)}
                        className={`px-3 py-1 rounded text-white ${
                          profileData.twoFactorEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {profileData.twoFactorEnabled 
                          ? 'Disable 2FA' 
                          : showTwoFactorSetup 
                            ? 'Hide Setup' 
                            : 'Enable 2FA'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 2FA Setup */}
              {showTwoFactorSetup && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <TwoFactorSetup onComplete={() => {
                    setShowTwoFactorSetup(false);
                    // Refresh profile data to update 2FA status
                    setProfileData({
                      ...profileData,
                      twoFactorEnabled: true
                    });
                  }} />
                </div>
              )}
              
              {/* Logout Button */}
              <div className="mt-8 border-t pt-4">
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;