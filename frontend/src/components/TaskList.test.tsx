import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

// Mock TaskItem component to isolate TaskList tests
jest.mock('./TaskItem', () => {
  return function MockTaskItem({ task, onComplete }: any) {
    return (
      <div data-testid={`task-item-${task.Id}`}>
        <span>{task.Title}</span>
        <button onClick={() => onComplete(task.Id)}>Complete</button>
      </div>
    );
  };
});

const mockOnComplete = jest.fn();

describe('TaskList Component', () => {
  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  // Test 1: Renders empty state when no tasks
  it('should display empty state when tasks array is empty', () => {
    render(<TaskList tasks={[]} onComplete={mockOnComplete} />);

    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
    expect(screen.getByText('Click "Add New Task" to create your first task')).toBeInTheDocument();
  });

  // Test 2: Renders empty state when tasks is undefined
  it('should display empty state when tasks is undefined', () => {
    render(<TaskList tasks={undefined as any} onComplete={mockOnComplete} />);

    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
  });

  // Test 3: Renders empty state when tasks is null
  it('should display empty state when tasks is null', () => {
    render(<TaskList tasks={null as any} onComplete={mockOnComplete} />);

    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
  });

  // Test 4: Empty state displays task icon
  it('should display task icon in empty state', () => {
    const { container } = render(<TaskList tasks={[]} onComplete={mockOnComplete} />);

    // Check for the material icon
    const icon = container.querySelector('.material-symbols-outlined');
    expect(icon).toBeInTheDocument();
  });

  // Test 5: Renders "Recent Tasks" header when tasks exist
  it('should display "Recent Tasks" header when tasks are present', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'Test Task',
        Description: 'Test Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
  });

  // Test 6: Does not render "Recent Tasks" header when no tasks
  it('should not display "Recent Tasks" header in empty state', () => {
    render(<TaskList tasks={[]} onComplete={mockOnComplete} />);

    expect(screen.queryByText('Recent Tasks')).not.toBeInTheDocument();
  });

  // Test 7: Renders single task
  it('should render a single task', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'Single Task',
        Description: 'Task Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    expect(screen.getByText('Single Task')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
  });

  // Test 8: Renders multiple tasks
  it('should render multiple tasks', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'First Task',
        Description: 'First Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      },
      {
        Id: 2,
        Title: 'Second Task',
        Description: 'Second Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      },
      {
        Id: 3,
        Title: 'Third Task',
        Description: 'Third Description',
        IsCompleted: true,
        CreatedAt: new Date().toISOString()
      }
    ];

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.getByText('Third Task')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-3')).toBeInTheDocument();
  });

  // Test 9: Each task has a unique key (tests React key prop)
  it('should render each task with unique key', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'Task 1',
        Description: 'Description 1',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      },
      {
        Id: 2,
        Title: 'Task 2',
        Description: 'Description 2',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    // Verify both tasks are rendered
    const taskItems = screen.getAllByTestId(/task-item-/);
    expect(taskItems).toHaveLength(2);
  });

  // Test 10: Passes onComplete callback to TaskItem
  it('should pass onComplete callback to each TaskItem', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'Task with callback',
        Description: 'Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    // The mock TaskItem has a Complete button that triggers onComplete
    const completeButton = screen.getByText('Complete');
    completeButton.click();

    expect(mockOnComplete).toHaveBeenCalledWith(1);
  });

  // Test 11: Renders tasks with different completion states
  it('should render both completed and incomplete tasks', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'Incomplete Task',
        Description: 'Not done yet',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      },
      {
        Id: 2,
        Title: 'Completed Task',
        Description: 'Already done',
        IsCompleted: true,
        CreatedAt: new Date().toISOString()
      }
    ];

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    expect(screen.getByText('Incomplete Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  // Test 12: Handles large number of tasks
  it('should render many tasks efficiently', () => {
    const tasks = Array.from({ length: 50 }, (_, i) => ({
      Id: i + 1,
      Title: `Task ${i + 1}`,
      Description: `Description ${i + 1}`,
      IsCompleted: i % 2 === 0,
      CreatedAt: new Date().toISOString()
    }));

    render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    // Check first and last tasks
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 50')).toBeInTheDocument();

    // Verify all tasks are rendered
    const taskItems = screen.getAllByTestId(/task-item-/);
    expect(taskItems).toHaveLength(50);
  });

  // Test 13: Updates when tasks prop changes
  it('should update when tasks prop changes', () => {
    const initialTasks = [
      {
        Id: 1,
        Title: 'Initial Task',
        Description: 'Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    const { rerender } = render(<TaskList tasks={initialTasks} onComplete={mockOnComplete} />);

    expect(screen.getByText('Initial Task')).toBeInTheDocument();

    // Update with new tasks
    const newTasks = [
      {
        Id: 2,
        Title: 'New Task',
        Description: 'New Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    rerender(<TaskList tasks={newTasks} onComplete={mockOnComplete} />);

    expect(screen.queryByText('Initial Task')).not.toBeInTheDocument();
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  // Test 14: Transitions from empty to populated state
  it('should transition from empty state to showing tasks', () => {
    const { rerender } = render(<TaskList tasks={[]} onComplete={mockOnComplete} />);

    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();

    const tasks = [
      {
        Id: 1,
        Title: 'First Task Ever',
        Description: 'Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    rerender(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    expect(screen.queryByText('No tasks yet!')).not.toBeInTheDocument();
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
    expect(screen.getByText('First Task Ever')).toBeInTheDocument();
  });

  // Test 15: Transitions from populated to empty state
  it('should transition from showing tasks to empty state', () => {
    const tasks = [
      {
        Id: 1,
        Title: 'Last Task',
        Description: 'Description',
        IsCompleted: false,
        CreatedAt: new Date().toISOString()
      }
    ];

    const { rerender } = render(<TaskList tasks={tasks} onComplete={mockOnComplete} />);

    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
    expect(screen.getByText('Last Task')).toBeInTheDocument();

    rerender(<TaskList tasks={[]} onComplete={mockOnComplete} />);

    expect(screen.queryByText('Recent Tasks')).not.toBeInTheDocument();
    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
  });
});
