/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://example.org/"}
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/authUtils';
import { TaskContext } from '../../context/taskContextUtils';

// Mock Auth Provider
const mockAuthValue = {
  user: { id: '123', name: 'Test User', email: 'test@example.com' },
  loading: false,
  error: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn()
};

const mockTaskValue = {
  tasks: [
    { _id: '1', title: 'Test Task 1', status: 'todo', priority: 'medium' },
    { _id: '2', title: 'Test Task 2', status: 'in-progress', priority: 'high' }
  ],
  filteredTasks: [
    { _id: '1', title: 'Test Task 1', status: 'todo', priority: 'medium' },
    { _id: '2', title: 'Test Task 2', status: 'in-progress', priority: 'high' }
  ],
  loading: false,
  error: null,
  filters: { status: 'all', priority: 'all', sortBy: 'createdAt' },
  setFilters: jest.fn(),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
};

// Custom render with providers
const customRender = (ui, options = {}) => {
  const {
    authValue = mockAuthValue,
    taskValue = mockTaskValue,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <TaskContext.Provider value={taskValue}>
          {children}
        </TaskContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };