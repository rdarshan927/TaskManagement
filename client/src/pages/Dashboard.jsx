import { useState, lazy, Suspense } from 'react';
import { useAuth } from '../context/authUtils';
import { TaskProvider } from '../context/TaskContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TaskFilter from '../components/TaskFilter';

// Lazy load components
const TaskList = lazy(() => import('../components/TaskList'));
const TaskForm = lazy(() => import('../components/TaskForm'));

const Dashboard = () => {
  const { user } = useAuth();
  const [isAddingTask, setIsAddingTask] = useState(false);


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
          </div>
        </div>
        
        {/* Task Form */}
        {isAddingTask && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <Suspense fallback={<LoadingSpinner />}>
              <TaskForm onComplete={() => setIsAddingTask(false)} />
            </Suspense>
          </div>
        )}
        
        {/* Task Filter */}
        <TaskFilter />
        
        {/* Task List */}
        <Suspense fallback={<LoadingSpinner />}>
          <TaskList />
        </Suspense>
      </div>
    </TaskProvider>
  );
};

export default Dashboard;