import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

// Mock all child components
jest.mock('./components/Modal', () => {
  return function MockModal({ isOpen, onClose, title, children }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    );
  };
});

jest.mock('./components/TaskForm', () => {
  return function MockTaskForm({ onSubmit, onCancel }: any) {
    return (
      <div data-testid="task-form">
        <button onClick={() => onSubmit('Test Task', 'Test Description')}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

jest.mock('./components/TaskList', () => {
  return function MockTaskList({ tasks, onComplete }: any) {
    return (
      <div data-testid="task-list">
        {tasks.map((task: any) => (
          <div key={task.Id} data-testid={`task-${task.Id}`}>
            <span>{task.Title}</span>
            <button onClick={() => onComplete(task.Id)}>Complete</button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('./components/Toast', () => {
  return function MockToast({ id, message, type, onClose }: any) {
    return (
      <div data-testid={`toast-${id}`} className={`toast-${type}`}>
        <span>{message}</span>
        <button onClick={() => onClose(id)}>Close Toast</button>
      </div>
    );
  };
});

// Mock API service
jest.mock('./services/api');

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App Component', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the store
    store = {};
    localStorageMock.clear();
    // Reset localStorage mock to use the store
    localStorageMock.getItem.mockImplementation((key: string) => store[key] || null);
    localStorageMock.setItem.mockImplementation((key: string, value: string) => {
      store[key] = value;
    });
    (api.getTasks as jest.Mock).mockResolvedValue([]);
    // Clear document classes
    document.documentElement.classList.remove('dark', 'light');
  });

  // Test 1: Shows loading state initially
  it('should display loading state on initial render', () => {
    (api.getTasks as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<App />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  // Test 2: Loads tasks on mount
  it('should load tasks on mount', async () => {
    const mockTasks = [
      { Id: 1, Title: 'Task 1', Description: 'Desc 1', IsCompleted: false, CreatedAt: '2024-01-01' }
    ];

    (api.getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(<App />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    expect(api.getTasks).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  // Test 3: Renders header with title
  it('should render header with Task Manager title', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });
  });

  // Test 4: Renders Add New Task button
  it('should render Add New Task button', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });

  // Test 5: Opens modal when Add New Task is clicked
  it('should open modal when Add New Task button is clicked', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add New Task');
    fireEvent.click(addButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  // Test 6: Closes modal when Close button is clicked
  it('should close modal when modal close button is clicked', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByText('Add New Task'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  // Test 7: Creates task successfully
  it('should create task and show success toast', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);
    (api.createTask as jest.Mock).mockResolvedValue({ success: true });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByText('Add New Task'));

    // Submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith('Test Task', 'Test Description');
    });

    // Check success toast
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
    });

    // Modal should close
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  // Test 8: Shows error toast when task creation fails
  it('should show error toast when task creation fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (api.getTasks as jest.Mock).mockResolvedValue([]);
    (api.createTask as jest.Mock).mockRejectedValue(new Error('Server error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    // Open modal and submit
    fireEvent.click(screen.getByText('Add New Task'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Failed to create task. Please try again.')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  // Test 9: Completes task successfully
  it('should complete task and show success toast', async () => {
    const mockTasks = [
      { Id: 1, Title: 'Task 1', Description: 'Desc 1', IsCompleted: false, CreatedAt: '2024-01-01' }
    ];

    (api.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (api.completeTask as jest.Mock).mockResolvedValue({ success: true });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Complete task
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(api.completeTask).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Task marked as complete!')).toBeInTheDocument();
    });
  });

  // Test 10: Shows error toast when task completion fails
  it('should show error toast when task completion fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockTasks = [
      { Id: 1, Title: 'Task 1', Description: 'Desc 1', IsCompleted: false, CreatedAt: '2024-01-01' }
    ];

    (api.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (api.completeTask as jest.Mock).mockRejectedValue(new Error('Server error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Complete'));

    await waitFor(() => {
      expect(screen.getByText('Failed to complete task. Please try again.')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  // Test 11: Toggles dark mode
  it('should toggle dark mode when button is clicked', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
    });

    const darkModeButton = screen.getByLabelText('Toggle dark mode');

    // Initially light mode (default)
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Click to enable dark mode
    fireEvent.click(darkModeButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true');
  });

  // Test 12: Loads dark mode preference from localStorage
  it('should load dark mode preference from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('true');
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  // Test 13: Closes modal when Cancel is clicked in form
  it('should close modal when cancel button in form is clicked', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByText('Add New Task'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Click cancel in form
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  // Test 14: Toast can be closed manually
  it('should remove toast when close button is clicked', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);
    (api.createTask as jest.Mock).mockResolvedValue({ success: true });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    // Trigger a toast by creating a task
    fireEvent.click(screen.getByText('Add New Task'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
    });

    // Close the toast
    const closeToastButton = screen.getByText('Close Toast');
    fireEvent.click(closeToastButton);

    await waitFor(() => {
      expect(screen.queryByText('Task created successfully!')).not.toBeInTheDocument();
    });
  });

  // Test 15: Multiple toasts can be shown simultaneously
  it('should show multiple toasts simultaneously', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);
    (api.createTask as jest.Mock).mockResolvedValue({ success: true });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });

    // Create first toast
    fireEvent.click(screen.getByText('Add New Task'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
    });

    // Create second toast
    fireEvent.click(screen.getByText('Add New Task'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      const successToasts = screen.getAllByText('Task created successfully!');
      expect(successToasts.length).toBeGreaterThan(1);
    });
  });

  // Test 16: Reloads tasks after creating a task
  it('should reload tasks after creating a task', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);
    (api.createTask as jest.Mock).mockResolvedValue({ success: true });

    render(<App />);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    expect(api.getTasks).toHaveBeenCalledTimes(1);

    // Create task
    fireEvent.click(screen.getByText('Add New Task'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(api.getTasks).toHaveBeenCalledTimes(2);
    });
  });

  // Test 17: Reloads tasks after completing a task
  it('should reload tasks after completing a task', async () => {
    const mockTasks = [
      { Id: 1, Title: 'Task 1', Description: 'Desc 1', IsCompleted: false, CreatedAt: '2024-01-01' }
    ];

    (api.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (api.completeTask as jest.Mock).mockResolvedValue({ success: true });

    render(<App />);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    expect(api.getTasks).toHaveBeenCalledTimes(1);

    // Complete task
    fireEvent.click(screen.getByText('Complete'));

    await waitFor(() => {
      expect(api.getTasks).toHaveBeenCalledTimes(2);
    });
  });

  // Test 18: Handles error when loading tasks initially
  it('should handle error when loading tasks fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (api.getTasks as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading tasks:', expect.any(Error));
    });

    // Should still render but with no tasks
    expect(screen.getByTestId('task-list')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  // Test 19: Displays empty task list when no tasks
  it('should display task list even when empty', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('task-list')).toBeInTheDocument();
    });
  });

  // Test 20: Dark mode button shows correct icon
  it('should show correct icon based on dark mode state', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
    });

    const darkModeButton = screen.getByLabelText('Toggle dark mode');

    // Initially in light mode, should show dark_mode icon
    expect(darkModeButton.textContent).toContain('dark_mode');

    // Click to toggle
    fireEvent.click(darkModeButton);

    // Now in dark mode, should show light_mode icon
    expect(darkModeButton.textContent).toContain('light_mode');
  });
});
