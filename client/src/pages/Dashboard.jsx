import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import { TaskProvider } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <TaskProvider>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddingTask(!isAddingTask)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isAddingTask ? 'Cancel' : 'Add Task'}
            </button>
            <button
              onClick={goToProfile}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Profile
            </button>
            <button 
              onClick={logout} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Task Form */}
        {isAddingTask && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <TaskForm onComplete={() => setIsAddingTask(false)} />
          </div>
        )}
        
        {/* Task Filter */}
        <TaskFilter />
        
        {/* Task List */}
        <TaskList />
      </div>
    </TaskProvider>
  );
};

export default Dashboard;