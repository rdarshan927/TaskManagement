import { useContext } from 'react';
import { TaskContext } from '../context/taskContextUtils'; // Fixed import
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, loading, error, filteredTasks } = useContext(TaskContext);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-500 mb-4">
        {error}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center text-gray-500">
        No tasks found. Create your first task!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredTasks.map(task => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;