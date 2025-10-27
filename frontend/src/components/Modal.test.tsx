import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

// Mock function to track onClose calls
const mockOnClose = jest.fn();

describe('Modal Component', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    // Reset body overflow before each test
    document.body.style.overflow = 'unset';
  });

  // Test 1: Modal doesn't render when closed
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    // Modal should not be in the document
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  // Test 2: Modal renders when open
  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    // Modal should be visible
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  // Test 3: Modal displays title when provided
  it('should display title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="My Custom Title">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('My Custom Title')).toBeInTheDocument();
  });

  // Test 4: Modal works without title (optional title)
  it('should render without title when title is not provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Content without title</p>
      </Modal>
    );

    // Content should render
    expect(screen.getByText('Content without title')).toBeInTheDocument();

    // Close button should not be present when no title
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  // Test 5: Modal displays children content
  it('should render children content correctly', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>
          <h3>Child heading</h3>
          <p>Child paragraph</p>
          <button>Child button</button>
        </div>
      </Modal>
    );

    expect(screen.getByText('Child heading')).toBeInTheDocument();
    expect(screen.getByText('Child paragraph')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Child button' })).toBeInTheDocument();
  });

  // Test 6: Clicking backdrop closes modal
  it('should call onClose when backdrop is clicked', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Find the backdrop - it's the outermost div with the fixed position and backdrop
    // It has specific classes: 'fixed inset-0 z-50'
    const backdrop = container.querySelector('.fixed.inset-0.z-50');

    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 7: Clicking close button closes modal
  it('should call onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 8: Clicking modal content does NOT close modal
  it('should not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Click me</p>
      </Modal>
    );

    const content = screen.getByText('Click me');
    fireEvent.click(content);

    // onClose should NOT be called because of stopPropagation
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // Test 9: ESC key closes modal when open
  it('should call onClose when ESC key is pressed and modal is open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Simulate ESC key press
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 10: ESC key does nothing when modal is closed
  it('should not call onClose when ESC key is pressed and modal is closed', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Simulate ESC key press
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // Test 11: Other keys don't close modal
  it('should not call onClose when other keys are pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Simulate various key presses
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    fireEvent.keyDown(document, { key: 'a' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  // Test 12: Body overflow is set to hidden when modal opens
  it('should set body overflow to hidden when modal is open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  // Test 13: Body overflow is reset when modal closes
  it('should reset body overflow when modal is closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Verify overflow is hidden when open
    expect(document.body.style.overflow).toBe('hidden');

    // Close the modal by re-rendering with isOpen=false
    rerender(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Verify overflow is reset
    expect(document.body.style.overflow).toBe('unset');
  });

  // Test 14: Body overflow is cleaned up on unmount
  it('should clean up body overflow on unmount', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });

  // Test 15: Event listeners are cleaned up on unmount
  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    unmount();

    // Verify removeEventListener was called for keydown
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  // Test 16: Modal updates when isOpen prop changes
  it('should respond to isOpen prop changes', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Initially closed
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();

    // Open the modal
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();

    // Close the modal again
    rerender(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });
});
