import { useState } from 'react';
import api from '../services/api';

const TwoFactorSetup = ({ onComplete }) => {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Generate, 2: Verify, 3: Backup codes
  
  const generateSecret = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users/2fa/generate');
      setSecret(response.data.secret);
      setQrCode(response.data.qrCode);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate secret');
    } finally {
      setLoading(false);
    }
  };
  
  const enableTwoFactor = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/users/2fa/enable', { token });
      if (response.data.success) {
        setBackupCodes(response.data.backupCodes);
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const finishSetup = () => {
    if (onComplete) onComplete();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Setup Two-Factor Authentication</h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {step === 1 && (
        <div>
          <p className="mb-4 text-gray-600">
            Two-factor authentication adds an extra layer of security to your account. 
            Once enabled, you'll need to provide a verification code from your phone in addition to your password when logging in.
          </p>
          <button 
            onClick={generateSecret} 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Secret'}
          </button>
        </div>
      )}
      
      {step === 2 && qrCode && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Scan this QR code with your authenticator app (like Google Authenticator, Microsoft Authenticator, or Authy):
          </p>
          <img src={qrCode} alt="QR Code" className="mx-auto max-w-[200px]" />
          
          <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded-md">
            <p>Or enter this code manually in your app:</p>
            <code className="font-mono block mt-1 select-all bg-white p-1 rounded">{secret}</code>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Enter the verification code from your app:
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="6-digit code"
              />
              <button 
                onClick={enableTwoFactor} 
                disabled={loading || !token}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {step === 3 && backupCodes.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Backup Codes</h3>
          <p className="text-red-600 font-medium">
            Save these codes! They can be used to access your account if you lose your device.
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {backupCodes.map((code, i) => (
              <div key={i} className="p-2 border rounded bg-gray-50 font-mono text-center text-sm">
                {code}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button
              onClick={finishSetup}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Finish Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;