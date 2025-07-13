import React from 'react';
import { buttonVariants } from '../utils/theme';

const TwoFactorDisableModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-dark-dark mb-2">Disable Two-Factor Authentication</h3>
        <p className="text-dark-light mb-4">
          Are you sure you want to disable two-factor authentication? This will make your account less secure.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className={`px-4 py-2 ${buttonVariants.neutral}`}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 ${buttonVariants.danger}`}
            data-testid="confirm-disable-2fa-button"
          >
            Disable 2FA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorDisableModal;