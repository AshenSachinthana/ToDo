import { getTasks, createTask, completeTask } from './api';

// Mock fetch globally
globalThis.fetch = jest.fn() as jest.Mock;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    // Test 1: Successfully fetches tasks
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { Id: 1, Title: 'Task 1', Description: 'Description 1', IsCompleted: false, CreatedAt: '2024-01-01' },
        { Id: 2, Title: 'Task 2', Description: 'Description 2', IsCompleted: true, CreatedAt: '2024-01-02' }
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: mockTasks })
      });

      const result = await getTasks();

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task');
      expect(result).toEqual(mockTasks);
    });

    // Test 2: Fetches empty array when no tasks
    it('should return empty array when no tasks exist', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: [] })
      });

      const result = await getTasks();

      expect(result).toEqual([]);
    });

    // Test 3: Handles fetch errors
    it('should throw error when fetch fails', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getTasks()).rejects.toThrow('Network error');
    });

    // Test 4: Handles invalid JSON response
    it('should throw error when response is not valid JSON', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(getTasks()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('createTask', () => {
    // Test 5: Successfully creates a task
    it('should create task with correct data', async () => {
      const mockResponse = { success: true, id: 3 };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await createTask('New Task', 'Task Description');

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: 'New Task', Description: 'Task Description' })
      });
      expect(result).toEqual(mockResponse);
    });

    // Test 6: Creates task with special characters
    it('should handle special characters in task data', async () => {
      const mockResponse = { success: true, id: 4 };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const title = 'Task with "quotes" & special chars';
      const description = 'Description with émojis 🎉 and <tags>';

      await createTask(title, description);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Description: description })
      });
    });

    // Test 7: Handles creation errors
    it('should throw error when task creation fails', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      await expect(createTask('Task', 'Description')).rejects.toThrow('Server error');
    });

    // Test 8: Sends POST request with correct headers
    it('should send request with correct content-type header', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

      await createTask('Task', 'Description');

      const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1].headers).toEqual({ 'Content-Type': 'application/json' });
    });

    // Test 9: Creates task with empty strings
    it('should handle empty strings in task data', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

      await createTask('', '');

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: '', Description: '' })
      });
    });
  });

  describe('completeTask', () => {
    // Test 10: Successfully completes a task
    it('should mark task as complete', async () => {
      const mockResponse = { success: true };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await completeTask(5);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task/5/complete', {
        method: 'PATCH'
      });
      expect(result).toEqual(mockResponse);
    });

    // Test 11: Completes task with different IDs
    it('should handle different task IDs', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

      await completeTask(999);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task/999/complete', {
        method: 'PATCH'
      });
    });

    // Test 12: Handles completion errors
    it('should throw error when completion fails', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Task not found'));

      await expect(completeTask(1)).rejects.toThrow('Task not found');
    });

    // Test 13: Sends PATCH request
    it('should use PATCH method for completing task', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

      await completeTask(10);

      const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1].method).toBe('PATCH');
    });

    // Test 14: Completes task with ID 0
    it('should handle edge case of ID 0', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true })
      });

      await completeTask(0);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/task/0/complete', {
        method: 'PATCH'
      });
    });
  });

  describe('API URL configuration', () => {
    // Test 15: All endpoints use correct base URL
    it('should use localhost:3000 as base URL', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ data: [] })
      });

      await getTasks();
      expect((globalThis.fetch as jest.Mock).mock.calls[0][0]).toContain('http://localhost:3000');

      await createTask('Task', 'Desc');
      expect((globalThis.fetch as jest.Mock).mock.calls[1][0]).toContain('http://localhost:3000');

      await completeTask(1);
      expect((globalThis.fetch as jest.Mock).mock.calls[2][0]).toContain('http://localhost:3000');
    });
  });
});
