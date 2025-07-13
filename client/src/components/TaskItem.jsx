import { useState, useContext, memo } from 'react';
import { TaskContext } from '../context/taskContextUtils';
import { priorityStyles, statusStyles, buttonVariants, inputFocusStyles } from '../utils/theme';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const TaskItem = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });
  
  const { updateTask, deleteTask } = useContext(TaskContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    await updateTask(task._id, editData);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteTask(task._id);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label htmlFor="title-input" className="block text-sm font-medium text-dark-DEFAULT">Title</label>
            <input
              id="title-input"
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${inputFocusStyles}`}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description-input" className="block text-sm font-medium text-dark-DEFAULT">Description</label>
            <textarea
              id="description-input"
              name="description"
              value={editData.description}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${inputFocusStyles}`}
              rows="2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-DEFAULT">Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md ${inputFocusStyles}`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-DEFAULT">Priority</label>
              <select
                name="priority"
                value={editData.priority}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md ${inputFocusStyles}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-DEFAULT">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${inputFocusStyles}`}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              onClick={() => setIsEditing(false)} 
              className={`px-3 py-1 ${buttonVariants.neutral}`}
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate} 
              className={`px-3 py-1 ${buttonVariants.primary}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-dark-dark">{task.title}</h3>
          <div className="flex space-x-1">
            <button 
              onClick={() => setIsEditing(true)} 
              data-testid="edit-button"
              className="text-dark-light hover:text-primary-DEFAULT"
              aria-label="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={handleDeleteClick} 
              className="text-dark-light hover:text-status-error"
              data-testid="delete-button"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-dark-light mb-3">{task.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
            {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Completed'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="text-sm text-dark-light">
            Due: {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </>
  );
};

// Export a memoized version of the component
export default memo(TaskItem, (prevProps, nextProps) => {
  // Only re-render if the task actually changed
  return JSON.stringify(prevProps.task) === JSON.stringify(nextProps.task);
});