import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';

// Mock functions
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('TaskForm Component', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  // Test 1: Form renders with all elements
  it('should render form with title input, description textarea, and buttons', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Check for labels
    expect(screen.getByText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Description/i)).toBeInTheDocument();

    // Check for inputs
    expect(screen.getByPlaceholderText('Enter task title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add details about this task...')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  // Test 2: Required field indicators are shown
  it('should display required field asterisks', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Both labels should have asterisks (looking for red asterisks)
    const labels = screen.getAllByText('*');
    expect(labels).toHaveLength(2); // One for title, one for description
  });

  // Test 3: User can type in title field
  it('should allow user to type in title field', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...') as HTMLInputElement;

    await userEvent.type(titleInput, 'My Test Task');

    expect(titleInput.value).toBe('My Test Task');
  });

  // Test 4: User can type in description field
  it('should allow user to type in description field', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const descriptionInput = screen.getByPlaceholderText('Add details about this task...') as HTMLTextAreaElement;

    await userEvent.type(descriptionInput, 'This is a detailed description');

    expect(descriptionInput.value).toBe('This is a detailed description');
  });

  // Test 5: Submitting empty form shows validation errors
  it('should show validation errors when submitting empty form', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Check for error messages
    expect(screen.getByText('Task title is required')).toBeInTheDocument();
    expect(screen.getByText('Task description is required')).toBeInTheDocument();

    // onSubmit should NOT be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 6: Submitting with only title shows description error
  it('should show description error when only title is provided', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    await userEvent.type(titleInput, 'My Task');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Should show description error but not title error
    expect(screen.queryByText('Task title is required')).not.toBeInTheDocument();
    expect(screen.getByText('Task description is required')).toBeInTheDocument();

    // onSubmit should NOT be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 7: Submitting with only description shows title error
  it('should show title error when only description is provided', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');
    await userEvent.type(descriptionInput, 'My Description');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Should show title error but not description error
    expect(screen.getByText('Task title is required')).toBeInTheDocument();
    expect(screen.queryByText('Task description is required')).not.toBeInTheDocument();

    // onSubmit should NOT be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 8: Whitespace-only values are treated as empty
  it('should treat whitespace-only inputs as empty', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');

    await userEvent.type(titleInput, '   ');
    await userEvent.type(descriptionInput, '   ');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Both errors should be shown
    expect(screen.getByText('Task title is required')).toBeInTheDocument();
    expect(screen.getByText('Task description is required')).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Test 9: Valid form submission calls onSubmit with correct data
  it('should call onSubmit with correct data when form is valid', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');

    await userEvent.type(titleInput, 'Learn React Testing');
    await userEvent.type(descriptionInput, 'Master Jest and React Testing Library');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // onSubmit should be called with the values
    expect(mockOnSubmit).toHaveBeenCalledWith('Learn React Testing', 'Master Jest and React Testing Library');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  // Test 10: Form fields are cleared after successful submission
  it('should clear form fields after successful submission', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...') as HTMLTextAreaElement;

    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, 'Test Description');

    expect(titleInput.value).toBe('Test Task');
    expect(descriptionInput.value).toBe('Test Description');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Fields should be empty after submission
    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  // Test 11: Cancel button calls onCancel
  it('should call onCancel when cancel button is clicked', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  // Test 12: Title error clears when user starts typing
  it('should clear title error when user starts typing', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Submit empty form to trigger errors
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Verify error is shown
    expect(screen.getByText('Task title is required')).toBeInTheDocument();

    // Start typing in title field
    const titleInput = screen.getByPlaceholderText('Enter task title...');
    await userEvent.type(titleInput, 'N');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Task title is required')).not.toBeInTheDocument();
    });
  });

  // Test 13: Description error clears when user starts typing
  it('should clear description error when user starts typing', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Submit empty form to trigger errors
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Verify error is shown
    expect(screen.getByText('Task description is required')).toBeInTheDocument();

    // Start typing in description field
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');
    await userEvent.type(descriptionInput, 'S');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Task description is required')).not.toBeInTheDocument();
    });
  });

  // Test 14: Form submission is triggered by Enter key in form
  it('should submit form when pressing Enter in the form', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');

    await userEvent.type(titleInput, 'Task Title');
    await userEvent.type(descriptionInput, 'Task Description');

    // Press Enter in the title input
    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!);

    expect(mockOnSubmit).toHaveBeenCalledWith('Task Title', 'Task Description');
  });

  // Test 15: Error messages display error icons
  it('should display error icons with error messages', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Submit empty form to trigger errors
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Both errors should be visible with icons (material-symbols-outlined elements)
    const errorMessages = screen.getAllByText(/required/i);
    expect(errorMessages).toHaveLength(2);
  });

  // Test 16: Multiple submissions work correctly
  it('should handle multiple form submissions', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');
    const submitButton = screen.getByRole('button', { name: /create task/i });

    // First submission
    await userEvent.type(titleInput, 'First Task');
    await userEvent.type(descriptionInput, 'First Description');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('First Task', 'First Description');

    // Second submission
    await userEvent.type(titleInput, 'Second Task');
    await userEvent.type(descriptionInput, 'Second Description');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Second Task', 'Second Description');
    expect(mockOnSubmit).toHaveBeenCalledTimes(2);
  });

  // Test 17: Error styles are applied to inputs when there are errors
  it('should apply error styles to inputs when validation fails', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');

    // Initially no error styles
    expect(titleInput).toHaveClass('border-gray-200');
    expect(descriptionInput).toHaveClass('border-gray-200');

    // Submit to trigger errors
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    // Error styles should be applied
    expect(titleInput).toHaveClass('border-red-500');
    expect(descriptionInput).toHaveClass('border-red-500');
  });
});
