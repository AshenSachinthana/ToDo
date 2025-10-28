import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test.describe('Initial Page Load', () => {
    test('should load the application successfully', async ({ page }) => {
      // Check if the header is visible
      await expect(page.getByTestId('app-header')).toBeVisible();

      // Check if the title is correct
      await expect(page.locator('h1')).toHaveText('Task Manager');

      // Check if the dark mode toggle is visible
      await expect(page.getByTestId('dark-mode-toggle')).toBeVisible();

      // Check if the add task button is visible
      await expect(page.getByTestId('add-task-button')).toBeVisible();
    });
  });

  test.describe('Dark Mode', () => {
    test('should toggle dark mode on and off', async ({ page }) => {
      const darkModeToggle = page.getByTestId('dark-mode-toggle');
      const htmlElement = page.locator('html');

      // Check initial state (light mode by default)
      await expect(htmlElement).toHaveClass(/light/);

      // Toggle to dark mode
      await darkModeToggle.click();
      await expect(htmlElement).toHaveClass(/dark/);

      // Toggle back to light mode
      await darkModeToggle.click();
      await expect(htmlElement).toHaveClass(/light/);
    });
  });

  test.describe('Task Creation', () => {
    test('should open and close task creation modal', async ({ page }) => {
      const addTaskButton = page.getByTestId('add-task-button');

      // Click add task button
      await addTaskButton.click();

      // Modal should be visible
      await expect(page.getByTestId('modal-overlay')).toBeVisible();
      await expect(page.getByTestId('modal-content')).toBeVisible();
      await expect(page.getByTestId('task-form')).toBeVisible();

      // Close modal by clicking close button
      await page.getByTestId('modal-close-button').click();

      // Modal should be closed
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
    });

    test('should close modal by clicking overlay', async ({ page }) => {
      const addTaskButton = page.getByTestId('add-task-button');

      // Open modal
      await addTaskButton.click();
      await expect(page.getByTestId('modal-overlay')).toBeVisible();

      // Click on overlay (outside modal content)
      await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

      // Modal should be closed
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
    });

    test('should close modal using cancel button', async ({ page }) => {
      const addTaskButton = page.getByTestId('add-task-button');

      // Open modal
      await addTaskButton.click();
      await expect(page.getByTestId('modal-overlay')).toBeVisible();

      // Click cancel button
      await page.getByTestId('task-form-cancel-button').click();

      // Modal should be closed
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      // Open task creation modal
      await page.getByTestId('add-task-button').click();

      // Try to submit without filling fields
      await page.getByTestId('task-form-submit-button').click();

      // Check for validation error messages
      await expect(page.locator('text=Task title is required')).toBeVisible();
      await expect(page.locator('text=Task description is required')).toBeVisible();

      // Modal should still be open
      await expect(page.getByTestId('modal-overlay')).toBeVisible();
    });

    test('should clear validation errors when user starts typing', async ({ page }) => {
      // Open task creation modal
      await page.getByTestId('add-task-button').click();

      // Try to submit without filling fields
      await page.getByTestId('task-form-submit-button').click();

      // Validation errors should be visible
      await expect(page.locator('text=Task title is required')).toBeVisible();

      // Start typing in title field
      await page.getByTestId('task-title-input').fill('T');

      // Title error should disappear
      await expect(page.locator('text=Task title is required')).not.toBeVisible();

      // Start typing in description field
      await page.getByTestId('task-description-input').fill('D');

      // Description error should disappear
      await expect(page.locator('text=Task description is required')).not.toBeVisible();
    });

    test('should successfully create a new task', async ({ page }) => {
      // Open task creation modal
      await page.getByTestId('add-task-button').click();

      // Fill in task details
      const taskTitle = 'Test Task ' + Date.now();
      const taskDescription = 'This is a test task description';

      await page.getByTestId('task-title-input').fill(taskTitle);
      await page.getByTestId('task-description-input').fill(taskDescription);

      // Submit the form
      await page.getByTestId('task-form-submit-button').click();

      // Modal should close
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

      // Success toast should appear
      await expect(page.getByTestId('toast')).toBeVisible();
      await expect(page.getByTestId('toast')).toContainText('Task created successfully!');

      // Empty state should not be visible
      await expect(page.getByTestId('empty-task-list')).not.toBeVisible();

      // Task list should be visible
      await expect(page.getByTestId('task-list')).toBeVisible();

      // Task should appear in the list
      const taskItem = page.getByTestId('task-item').first();
      await expect(taskItem).toBeVisible();
      await expect(taskItem).toContainText(taskTitle);
      await expect(taskItem).toContainText(taskDescription);
    });

    test('should create multiple tasks', async ({ page }) => {
      const tasks = [
        { title: 'Task 1 - ' + Date.now(), description: 'Description 1' },
        { title: 'Task 2 - ' + Date.now(), description: 'Description 2' },
        { title: 'Task 3 - ' + Date.now(), description: 'Description 3' },
        { title: 'Task 4 - ' + Date.now(), description: 'Description 4' },
        { title: 'Task 5 - ' + Date.now(), description: 'Description 5' },
      ];

      for (const task of tasks) {
        // Open modal
        await page.getByTestId('add-task-button').click();

        // Fill and submit
        await page.getByTestId('task-title-input').fill(task.title);
        await page.getByTestId('task-description-input').fill(task.description);
        await page.getByTestId('task-form-submit-button').click();

        // Wait for modal to close
        await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

        // Wait a bit for the task to be created
        await page.waitForTimeout(500);
      }

      // Check that we have at least the expected number of tasks
      const taskItems = page.getByTestId('task-item');
      const count = await taskItems.count();
      expect(count).toBeGreaterThanOrEqual(tasks.length);
    });
  });

  test.describe('Task Completion', () => {
    test.beforeEach(async ({ page }) => {
      // Create a test task before each test
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('Task to Complete - ' + Date.now());
      await page.getByTestId('task-description-input').fill('This task will be completed in the test');
      await page.getByTestId('task-form-submit-button').click();

      // Wait for modal to close and task to be created
      await page.waitForTimeout(5000);
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
      await expect(page.getByTestId('task-item').first()).toBeVisible();
    });

    test('should show confirmation modal when clicking done button', async ({ page }) => {
      // Click the done button on the first task
      await page.getByTestId('task-done-button').first().click();

      // Confirmation modal should appear
      await expect(page.getByTestId('modal-overlay')).toBeVisible();
      await expect(page.getByText('Complete Task')).toBeVisible();
      await expect(page.getByText('Are you sure you want to mark this task as complete?')).toBeVisible();
      await expect(page.getByText('This action cannot be undone once confirmed.')).toBeVisible();

      // Both buttons should be visible
      await expect(page.getByTestId('task-confirm-cancel-button')).toBeVisible();
      await expect(page.getByTestId('task-confirm-complete-button')).toBeVisible();
    });

    test('should cancel task completion', async ({ page }) => {
      // Click the done button
      await page.getByTestId('task-done-button').first().click();

      // Modal should be visible
      await expect(page.getByTestId('modal-overlay')).toBeVisible();

      // Click cancel
      await page.getByTestId('task-confirm-cancel-button').click();

      // Modal should close
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

      // Task should still be in the list
      await expect(page.getByTestId('task-item').first()).toBeVisible();
      await expect(page.getByTestId('task-done-button').first()).toBeVisible();
    });

    test('should successfully complete a task', async ({ page }) => {
      const taskItem = page.getByTestId('task-item').first();

      // Click done button
      await page.getByTestId('task-done-button').first().click();

      // Confirm completion
      await page.getByTestId('task-confirm-complete-button').click();

      // Modal should close
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

      // Wait for task removal
      await page.waitForTimeout(2000);

      // Success toast should appear
      await expect(page.getByTestId('toast')).toBeVisible();
      await expect(page.getByTestId('toast')).toContainText('Task marked as complete!');
    });
  });

  test.describe('Toast Notifications', () => {
    test('should show success toast when creating a task', async ({ page }) => {
      // Create a task
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('Toast Test Task');
      await page.getByTestId('task-description-input').fill('Testing toast notification');
      await page.getByTestId('task-form-submit-button').click();

      // Toast should appear
      const toast = page.getByTestId('toast');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('Task created successfully!');

      // Toast should have success styling (check for green color classes)
      await expect(toast).toHaveClass(/bg-green/);
    });

    test('should auto-dismiss toast after timeout', async ({ page }) => {
      // Create a task to trigger toast
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('Auto Dismiss Test');
      await page.getByTestId('task-description-input').fill('Testing auto dismiss');
      await page.getByTestId('task-form-submit-button').click();

      // Toast should appear
      await expect(page.getByTestId('toast')).toBeVisible();

      // Wait for auto dismiss (default is 3000ms)
      await page.waitForTimeout(3500);

      // Toast should be gone
      await expect(page.getByTestId('toast')).not.toBeVisible();
    });

    test('should manually close toast', async ({ page }) => {
      // Create a task to trigger toast
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('Manual Close Test');
      await page.getByTestId('task-description-input').fill('Testing manual close');
      await page.getByTestId('task-form-submit-button').click();

      // Toast should appear
      await expect(page.getByTestId('toast')).toBeVisible();

      // Click close button
      await page.getByTestId('toast-close-button').click();

      // Toast should be gone
      await expect(page.getByTestId('toast')).not.toBeVisible();
    });
  });

  test.describe('Keyboard Interactions', () => {
    test('should close modal with Escape key', async ({ page }) => {
      // Open modal
      await page.getByTestId('add-task-button').click();
      await expect(page.getByTestId('modal-overlay')).toBeVisible();

      // Press Escape key
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
    });

    test('should submit form with Enter key in input field', async ({ page }) => {
      // Open modal
      await page.getByTestId('add-task-button').click();

      // Fill fields
      await page.getByTestId('task-title-input').fill('Enter Key Task');
      await page.getByTestId('task-description-input').fill('Testing Enter key submission');

      // Focus on title and press Enter
      await page.getByTestId('task-title-input').press('Enter');

      // Form should submit (modal closes)
      await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

      // Task should be created
      await expect(page.getByTestId('task-item').first()).toBeVisible();
      await expect(page.getByText('Enter Key Task')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display properly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Page should still be functional
      await expect(page.getByTestId('app-header')).toBeVisible();
      await expect(page.getByTestId('add-task-button')).toBeVisible();
      await expect(page.getByTestId('dark-mode-toggle')).toBeVisible();

      // Create a task on mobile
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('Mobile Task');
      await page.getByTestId('task-description-input').fill('Created on mobile viewport');
      await page.getByTestId('task-form-submit-button').click();

      // Task should appear
      await expect(page.getByTestId('task-item').first()).toBeVisible();
    });

    test('should display properly on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Page should still be functional
      await expect(page.getByTestId('app-header')).toBeVisible();
      await expect(page.getByTestId('add-task-button')).toBeVisible();

      // Create a task on tablet
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('Tablet Task');
      await page.getByTestId('task-description-input').fill('Created on tablet viewport');
      await page.getByTestId('task-form-submit-button').click();

      // Task should appear
      await expect(page.getByTestId('task-item').first()).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {

    test('should handle special characters in task content', async ({ page }) => {
      const specialTitle = 'Test <script>alert("XSS")</script> & "quotes" \'apostrophes\'';
      const specialDescription = 'Special chars: @#$%^&*()_+-={}[]|\\:";\'<>?,./';

      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill(specialTitle);
      await page.getByTestId('task-description-input').fill(specialDescription);
      await page.getByTestId('task-form-submit-button').click();

      // Task should be created and display safely
      await expect(page.getByTestId('task-item').first()).toBeVisible();
    });

    test('should trim whitespace from task fields', async ({ page }) => {
      await page.getByTestId('add-task-button').click();
      await page.getByTestId('task-title-input').fill('   '); // Only spaces
      await page.getByTestId('task-description-input').fill('   '); // Only spaces
      await page.getByTestId('task-form-submit-button').click();

      // Should show validation errors
      await expect(page.locator('text=Task title is required')).toBeVisible();
      await expect(page.locator('text=Task description is required')).toBeVisible();
    });
  });
});
