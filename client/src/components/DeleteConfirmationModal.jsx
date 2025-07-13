import React from 'react';
import { buttonVariants } from '../utils/theme';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-dark-dark mb-2">Delete Task</h3>
        <p className="text-dark-light mb-4">
          Are you sure you want to delete <span className="font-medium">"{taskTitle}"</span>? This action cannot be undone.
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
            data-testid="confirm-delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;