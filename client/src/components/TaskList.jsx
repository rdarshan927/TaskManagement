import { useContext } from 'react';
import { TaskContext } from '../context/taskContextUtils';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { loading, error, filteredTasks } = useContext(TaskContext);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-DEFAULT"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-status-error/10 p-4 rounded-md text-status-error mb-4">
        {error}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-neutral-light p-8 rounded-md text-center text-dark-light">
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