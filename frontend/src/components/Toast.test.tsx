import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast';

const mockOnClose = jest.fn();

describe('Toast Component', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Test 1: Renders success toast with correct message
  it('should render success toast with message', () => {
    render(
      <Toast
        id="toast-1"
        message="Task created successfully!"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
  });

  // Test 2: Renders error toast with correct message
  it('should render error toast with message', () => {
    render(
      <Toast
        id="toast-2"
        message="Failed to create task"
        type="error"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Failed to create task')).toBeInTheDocument();
  });

  // Test 3: Toast has alert role for accessibility
  it('should have alert role for accessibility', () => {
    render(
      <Toast
        id="toast-1"
        message="Test message"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // Test 4: Success toast displays success icon
  it('should display check_circle icon for success type', () => {
    const { container } = render(
      <Toast
        id="toast-1"
        message="Success message"
        type="success"
        onClose={mockOnClose}
      />
    );

    const icon = container.querySelector('.material-symbols-outlined');
    expect(icon).toHaveTextContent('check_circle');
  });

  // Test 5: Error toast displays error icon
  it('should display error icon for error type', () => {
    const { container } = render(
      <Toast
        id="toast-1"
        message="Error message"
        type="error"
        onClose={mockOnClose}
      />
    );

    const icon = container.querySelector('.material-symbols-outlined');
    expect(icon).toHaveTextContent('error');
  });

  // Test 6: Close button is rendered
  it('should render close button', () => {
    render(
      <Toast
        id="toast-1"
        message="Test message"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
  });

  // Test 7: Clicking close button calls onClose with correct id
  it('should call onClose with toast id when close button is clicked', () => {
    render(
      <Toast
        id="toast-123"
        message="Test message"
        type="success"
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith('toast-123');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 8: Toast auto-closes after default duration (3000ms)
  it('should auto-close after default duration of 3000ms', () => {
    render(
      <Toast
        id="toast-1"
        message="Test message"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    // Fast-forward time by 3000ms
    jest.advanceTimersByTime(3000);

    expect(mockOnClose).toHaveBeenCalledWith('toast-1');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 9: Toast auto-closes after custom duration
  it('should auto-close after custom duration', () => {
    render(
      <Toast
        id="toast-1"
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={5000}
      />
    );

    // Should not close before duration
    jest.advanceTimersByTime(4999);
    expect(mockOnClose).not.toHaveBeenCalled();

    // Should close at exactly duration
    jest.advanceTimersByTime(1);
    expect(mockOnClose).toHaveBeenCalledWith('toast-1');
  });

  // Test 10: Toast does not auto-close before duration
  it('should not auto-close before duration expires', () => {
    render(
      <Toast
        id="toast-1"
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={5000}
      />
    );

    jest.advanceTimersByTime(2500); // Half the duration
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // Test 11: Success toast has correct styling classes
  it('should apply success styling classes', () => {
  render( 
    <Toast
      id="toast-1"
      message="Success message"
      type="success"
      onClose={mockOnClose}
    />
  );

  const toastElement = screen.getByRole('alert');
  expect(toastElement).toHaveClass('bg-green-50');
  expect(toastElement).toHaveClass('border-green-500');
});

  // Test 12: Error toast has correct styling classes
  it('should apply error styling classes', () => {
    render( 
      <Toast
        id="toast-1"
        message="Error message"
        type="error"
        onClose={mockOnClose}
      />
    );

    const toastElement = screen.getByRole('alert');
    expect(toastElement).toHaveClass('bg-red-50');
    expect(toastElement).toHaveClass('border-red-500');
  });

  // Test 13: Timer is cleaned up on unmount
  it('should clear timer on unmount', () => {
    const { unmount } = render(
      <Toast
        id="toast-1"
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={3000}
      />
    );

    // Unmount before timer expires
    unmount();

    // Fast-forward time
    jest.advanceTimersByTime(3000);

    // onClose should not be called because timer was cleared
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // Test 14: Multiple toasts with different ids
  it('should handle multiple toasts with different ids', () => {
    const { rerender } = render(
      <Toast
        id="toast-1"
        message="First message"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('First message')).toBeInTheDocument();

    rerender(
      <Toast
        id="toast-2"
        message="Second message"
        type="error"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  // Test 15: Timer resets when props change
  it('should reset timer when id changes', () => {
    const { rerender } = render(
      <Toast
        id="toast-1"
        message="First message"
        type="success"
        onClose={mockOnClose}
        duration={3000}
      />
    );

    // Advance time partially
    jest.advanceTimersByTime(1500);

    // Change the id (new toast)
    rerender(
      <Toast
        id="toast-2"
        message="Second message"
        type="success"
        onClose={mockOnClose}
        duration={3000}
      />
    );

    // Advance time by 1500ms more (total 3000ms from original)
    jest.advanceTimersByTime(1500);

    // Should not close yet because timer was reset
    expect(mockOnClose).not.toHaveBeenCalled();

    // Advance by another 1500ms (3000ms from reset)
    jest.advanceTimersByTime(1500);

    // Now it should close with the new id
    expect(mockOnClose).toHaveBeenCalledWith('toast-2');
  });

  // Test 16: Long message is displayed correctly
  it('should display long messages correctly', () => {
    const longMessage = 'This is a very long message that might wrap across multiple lines in the toast notification component';

    render(
      <Toast
        id="toast-1"
        message={longMessage}
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  // Test 17: Toast with zero duration closes immediately
  it('should close immediately with zero duration', () => {
    render(
      <Toast
        id="toast-1"
        message="Instant close"
        type="success"
        onClose={mockOnClose}
        duration={0}
      />
    );

    jest.advanceTimersByTime(0);

    expect(mockOnClose).toHaveBeenCalledWith('toast-1');
  });

  // Test 18: Animation classes are applied
  it('should have animation class for slide-in effect', () => {
    render(
      <Toast
        id="toast-1"
        message="Animated toast"
        type="success"
        onClose={mockOnClose}
      />
    );

    const toastElement = screen.getByRole('alert');
    expect(toastElement).toHaveClass('animate-slideInRight');
  });
});
