import { useState, useEffect } from 'react';
import { useAuth } from '../context/authUtils';
import TwoFactorSetup from '../components/TwoFactorSetup';
import api from '../services/api';
import { buttonVariants } from '../utils/theme';

const Profile = () => {
  const { user } = useAuth();
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

  const disableTwoFactor = async () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      try {
        setLoading(true);
        const response = await api.post('/users/2fa/disable');
        if (response.data.success) {
          setProfileData({
            ...profileData,
            twoFactorEnabled: false
          });
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-DEFAULT mx-auto"></div>
            <p className="mt-2 text-dark-light">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-status-error">
            {error}
          </div>
        ) : (
          <div className="p-6">
            {/* Profile Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-dark-dark border-b pb-2">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-DEFAULT">Name</label>
                  <div className="mt-1 p-2 bg-neutral-light rounded-md">
                    {profileData.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-DEFAULT">Email</label>
                  <div className="mt-1 p-2 bg-neutral-light rounded-md">
                    {profileData.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-DEFAULT">
                    Two-Factor Authentication
                  </label>
                  <div className="mt-1 p-2 bg-neutral-light rounded-md flex justify-between items-center">
                    <span>
                      {profileData.twoFactorEnabled ? (
                        <span className="text-status-success font-medium">Enabled</span>
                      ) : (
                        <span className="text-status-error font-medium">Disabled</span>
                      )}
                    </span>
                    <button
                      onClick={profileData.twoFactorEnabled ? disableTwoFactor : () => setShowTwoFactorSetup(!showTwoFactorSetup)}
                      className={`px-3 py-1 rounded text-white ${
                        profileData.twoFactorEnabled ? buttonVariants.danger : buttonVariants.primary
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
              <div className="mt-4 p-4 border rounded-md bg-neutral-light">
                <TwoFactorSetup onComplete={() => {
                  setShowTwoFactorSetup(false);
                  setProfileData({
                    ...profileData,
                    twoFactorEnabled: true
                  });
                }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;