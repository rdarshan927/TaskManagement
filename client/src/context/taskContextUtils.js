import { createContext, useContext } from 'react';

// Create the context
export const TaskContext = createContext();

// Custom hook to use the context
export const useTaskContext = () => useContext(TaskContext);