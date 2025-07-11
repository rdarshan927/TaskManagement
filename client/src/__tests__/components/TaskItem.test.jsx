import { render, screen, fireEvent, act } from '../utils/test-utils';
import TaskItem from '../../components/TaskItem';
import { TaskContext } from '../../context/taskContextUtils';

describe('TaskItem Component', () => {
  const mockTask = {
    _id: '123',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString()
  };

  const mockTaskValue = {
    tasks: [],
    filteredTasks: [],
    loading: false,
    error: null,
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  };

  it('renders task details correctly', () => {
    render(
      <TaskContext.Provider value={mockTaskValue}>
        <TaskItem task={mockTask} />
      </TaskContext.Provider>
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('toggles edit mode when edit button is clicked', () => {
    render(
      <TaskContext.Provider value={mockTaskValue}>
        <TaskItem task={mockTask} />
      </TaskContext.Provider>
    );
    
    // Initially not in edit mode
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    
    // Click edit button using testId
    fireEvent.click(screen.getByTestId('edit-button'));
    
    // Now in edit mode - use proper id selectors
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test task')).toBeInTheDocument();
  });

  it('calls updateTask when saving edits', async () => {
    const mockUpdateTask = jest.fn().mockResolvedValue({});
    
    render(
      <TaskContext.Provider value={{ ...mockTaskValue, updateTask: mockUpdateTask }}>
        <TaskItem task={mockTask} />
      </TaskContext.Provider>
    );
    
    // Enter edit mode
    fireEvent.click(screen.getByTestId('edit-button'));
    
    // Change title
    fireEvent.change(screen.getByDisplayValue('Test Task'), { 
      target: { value: 'Updated Task' } 
    });
    
    // Save changes with act()
    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });
    
    // Verify updateTask was called
    expect(mockUpdateTask).toHaveBeenCalledWith(
      '123', 
      expect.objectContaining({ 
        title: 'Updated Task' 
      })
    );
  });

  it('confirms before deleting a task', () => {
    const mockDeleteTask = jest.fn();
    window.confirm = jest.fn(() => true);
    
    render(
      <TaskContext.Provider value={{ ...mockTaskValue, deleteTask: mockDeleteTask }}>
        <TaskItem task={mockTask} />
      </TaskContext.Provider>
    );
    
    // Click delete button
    fireEvent.click(screen.getByTestId('delete-button'));
    
    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalled();
    
    // Verify deleteTask was called
    expect(mockDeleteTask).toHaveBeenCalledWith('123');
  });
});

