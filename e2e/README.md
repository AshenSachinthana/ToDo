# Todo App - E2E Tests

This directory contains end-to-end tests for the Todo application using Playwright.

## Test Coverage

The test suite covers the following functionality:

### 1. Initial Page Load
- Application loads successfully
- Header, title, and buttons are visible
- Empty state displays correctly

### 2. Dark Mode
- Toggle dark mode on/off
- Dark mode preference persists after page reload

### 3. Task Creation
- Open/close task creation modal
- Form validation (required fields)
- Clear validation errors on input
- Successfully create single and multiple tasks
- Various modal close methods (close button, overlay click, cancel button, Escape key)

### 4. Task Completion
- Show confirmation modal
- Cancel task completion
- Successfully complete a task
- Task is removed after completion

### 5. Toast Notifications
- Success toast on task creation
- Success toast on task completion
- Auto-dismiss after timeout
- Manual close via close button

### 6. Keyboard Interactions
- Close modal with Escape key
- Submit form with Enter key

### 7. Responsive Design
- Mobile viewport (375x667)
- Tablet viewport (768x1024)

### 8. Edge Cases
- Very long task titles and descriptions
- Special characters and XSS prevention
- Whitespace trimming

## Prerequisites

Before running the tests, make sure:

1. Backend server is running on `http://localhost:8080`
2. Frontend development server is running on `http://localhost:5173`

## Running the Tests

### Run all tests
```bash
cd e2e
npx playwright test
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in UI mode (interactive)
```bash
npx playwright test --ui
```

### Run specific test file
```bash
npx playwright test tests/todo-app.spec.ts
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests with debugging
```bash
npx playwright test --debug
```

### Generate HTML report
```bash
npx playwright show-report
```

## Test Structure

```
e2e/
├── tests/
│   └── todo-app.spec.ts     # Main test file with all test cases
├── playwright.config.ts      # Playwright configuration
└── README.md                 # This file
```

## Configuration

The Playwright configuration (`playwright.config.ts`) is set up with:
- **Base URL**: `http://localhost:5173`
- **Test Directory**: `./tests`
- **Browsers**: Chromium, Firefox, and WebKit
- **Parallel Execution**: Enabled
- **Trace**: On first retry only

## Test Data IDs

The application uses the following `data-testid` attributes for reliable element selection:

### App.tsx
- `app-header` - Main header
- `dark-mode-toggle` - Dark mode toggle button
- `add-task-button` - Add new task button

### TaskForm.tsx
- `task-form` - Form element
- `task-title-input` - Task title input
- `task-description-input` - Task description textarea
- `task-form-cancel-button` - Cancel button
- `task-form-submit-button` - Submit button

### TaskList.tsx
- `task-list` - Task list container
- `empty-task-list` - Empty state

### TaskItem.tsx
- `task-item` - Individual task
- `task-done-button` - Done button
- `task-confirm-cancel-button` - Confirmation cancel button
- `task-confirm-complete-button` - Confirmation complete button

### Modal.tsx
- `modal-overlay` - Modal backdrop
- `modal-content` - Modal content
- `modal-close-button` - Close button

### Toast.tsx
- `toast` - Toast notification
- `toast-close-button` - Toast close button

## Tips for Writing New Tests

1. Always use `data-testid` for selecting elements
2. Use `test.beforeEach` for common setup
3. Wait for elements to be visible before interacting
4. Clean up any test data after tests complete
5. Use descriptive test names
6. Group related tests using `test.describe`

## Troubleshooting

### Tests fail with "Connection refused"
Make sure both backend and frontend servers are running.

### Tests are flaky
- Increase timeout values if needed
- Add explicit waits for dynamic content
- Check network conditions

### Modal tests fail
Ensure modals are properly closed between tests using `test.beforeEach` hooks.

## CI/CD Integration

To run tests in CI/CD pipeline:

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run tests
npx playwright test

# Upload test results
npx playwright show-report
```
