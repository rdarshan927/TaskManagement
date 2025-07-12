import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { TaskContext } from './taskContextUtils';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt'
  });

  // Optimize fetch with useCallback
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized task operations
  const addTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      const newTask = await createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTask = useCallback(async (id, taskData) => {
    try {
      setLoading(true);
      const updatedTask = await updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id) => {
    try {
      setLoading(true);
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Memoize filtered tasks to prevent recalculations on every render
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    return tasks
      .filter(task => {
        if (filters.status !== 'all' && task.status !== filters.status) return false;
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'createdAt') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        } else if (filters.sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (filters.sortBy === 'priority') {
          const priorityValue = { low: 1, medium: 2, high: 3 };
          return (priorityValue[b.priority] || 0) - (priorityValue[a.priority] || 0);
        } else if (filters.sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });
  }, [tasks, filters.status, filters.priority, filters.sortBy]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    tasks,
    loading,
    error,
    filters,
    filteredTasks,
    setFilters,
    fetchTasks,
    createTask: addTask,
    updateTask: editTask,
    deleteTask: removeTask
  }), [tasks, loading, error, filters, filteredTasks, setFilters, fetchTasks, addTask, editTask, removeTask]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};