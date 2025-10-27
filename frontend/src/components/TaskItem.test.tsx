import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';

// Mock data - a sample task to use in our tests
const mockTask = {
  Id: 1,
  Title: 'Learn Jest Testing',
  Description: 'Study how to write unit tests for React components',
  IsCompleted: false,
  CreatedAt: new Date().toISOString(),
};

// Mock function - a fake function we can track
const mockOnComplete = jest.fn();

describe('TaskItem Component', () => {
  // This runs before each test - resets everything
  beforeEach(() => {
    mockOnComplete.mockClear(); // Clear any previous calls
  });

  // Test 1: Check if task data is displayed
  it('should render task title and description', () => {
    // Arrange: Set up the component
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Act & Assert: Check if elements are in the document
    expect(screen.getByText('Learn Jest Testing')).toBeInTheDocument();
    expect(screen.getByText('Study how to write unit tests for React components')).toBeInTheDocument();
  });

  // Test 2: Check if Done button appears for incomplete tasks
  it('should show Done button for incomplete tasks', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Look for the Done button
    const doneButton = screen.getByRole('button', { name: /done/i });
    expect(doneButton).toBeInTheDocument();
  });

  // Test 3: Check if Done button is hidden for completed tasks
  it('should hide Done button for completed tasks', () => {
    // Create a completed task
    const completedTask = { ...mockTask, IsCompleted: true };
    render(<TaskItem task={completedTask} onComplete={mockOnComplete} />);

    // queryByRole returns null if not found (unlike getByRole which throws error)
    const doneButton = screen.queryByRole('button', { name: /done/i });
    expect(doneButton).not.toBeInTheDocument();
  });

  // Test 4: Check if clicking Done opens the confirmation modal
  it('should open confirmation modal when Done button is clicked', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Find and click the Done button
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Check if modal appears with confirmation text
    expect(screen.getByText('Complete Task')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to mark this task as complete?')).toBeInTheDocument();
  });

  // Test 5: Check if clicking "Mark as Complete" calls the onComplete function
  it('should call onComplete when confirming in modal', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Open the modal
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Click "Mark as Complete" button in modal
    const confirmButton = screen.getByRole('button', { name: /mark as complete/i });
    fireEvent.click(confirmButton);

    // Check if onComplete was called with correct task ID
    expect(mockOnComplete).toHaveBeenCalledWith(1);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  // Test 6: Check if clicking Cancel closes the modal
  it('should close modal when Cancel is clicked', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Open the modal
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Click Cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Modal should disappear
    expect(screen.queryByText('Complete Task')).not.toBeInTheDocument();
  });

  // Test 7: Check if modal close button (X) closes the modal
  it('should close modal when modal close button (X) is clicked', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Open the modal
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Verify modal is open
    expect(screen.getByText('Complete Task')).toBeInTheDocument();

    // Click the modal's close button (X button in header)
    const modalCloseButton = screen.getByLabelText('Close modal');
    fireEvent.click(modalCloseButton);

    // Modal should disappear
    expect(screen.queryByText('Complete Task')).not.toBeInTheDocument();
  });

  // Test 8: Check date formatting - "Just now"
  it('should display "Just now" for recent tasks', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  // Test 9: Check date formatting - "X hour(s) ago"
  it('should display "Added X hour(s) ago" for tasks from 1-23 hours ago', () => {
    // Create a task from 5 hours ago
    const hoursAgo = 5;
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - hoursAgo);
    const taskFromHoursAgo = { ...mockTask, CreatedAt: pastDate.toISOString() };

    render(<TaskItem task={taskFromHoursAgo} onComplete={mockOnComplete} />);

    expect(screen.getByText('Added 5 hours ago')).toBeInTheDocument();
  });

  // Test 10: Check date formatting - singular "hour"
  it('should display "Added 1 hour ago" (singular) for tasks from 1 hour ago', () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1);
    const taskFromOneHourAgo = { ...mockTask, CreatedAt: pastDate.toISOString() };

    render(<TaskItem task={taskFromOneHourAgo} onComplete={mockOnComplete} />);

    expect(screen.getByText('Added 1 hour ago')).toBeInTheDocument();
  });

  // Test 11: Check date formatting - "yesterday"
  it('should display "Added yesterday" for tasks from 24-47 hours ago', () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 30); // 30 hours ago
    const taskFromYesterday = { ...mockTask, CreatedAt: pastDate.toISOString() };

    render(<TaskItem task={taskFromYesterday} onComplete={mockOnComplete} />);

    expect(screen.getByText('Added yesterday')).toBeInTheDocument();
  });

  // Test 12: Check date formatting - full date
  it('should display "Added [date]" for tasks older than 48 hours', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
    const oldTask = { ...mockTask, CreatedAt: pastDate.toISOString() };

    render(<TaskItem task={oldTask} onComplete={mockOnComplete} />);

    // Check that it shows "Added" followed by a formatted date
    const dateText = screen.getByText(/Added \d+\/\d+\/\d+/);
    expect(dateText).toBeInTheDocument();
  });

  // Test 13: Check modal displays warning message
  it('should show warning message in confirmation modal', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Open the modal
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Check if warning message is displayed
    expect(screen.getByText('This action cannot be undone once confirmed.')).toBeInTheDocument();
  });

  // Test 14: Check modal displays task preview
  it('should display task details in confirmation modal', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Open the modal
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Check if task details are shown in the modal (should appear twice: once in main view, once in modal)
    const titleElements = screen.getAllByText('Learn Jest Testing');
    const descElements = screen.getAllByText('Study how to write unit tests for React components');

    expect(titleElements).toHaveLength(2); // Once in task item, once in modal
    expect(descElements).toHaveLength(2);
  });

  // Test 15: Check modal closes after Mark as Complete is clicked
  it('should close modal after confirming task completion', () => {
    render(<TaskItem task={mockTask} onComplete={mockOnComplete} />);

    // Open the modal
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    // Verify modal is open
    expect(screen.getByText('Complete Task')).toBeInTheDocument();

    // Click "Mark as Complete" button
    const confirmButton = screen.getByRole('button', { name: /mark as complete/i });
    fireEvent.click(confirmButton);

    // Verify modal is closed
    expect(screen.queryByText('Complete Task')).not.toBeInTheDocument();
  });
});
