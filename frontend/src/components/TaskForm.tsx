import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setTitleError('');
    setDescriptionError('');

    // Validate fields
    let hasError = false;

    if (!title.trim()) {
      setTitleError('Task title is required');
      hasError = true;
    }

    if (!description.trim()) {
      setDescriptionError('Task description is required');
      hasError = true;
    }

    // If no errors, submit the form
    if (!hasError) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError(''); // Clear error when user starts typing
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (descriptionError) setDescriptionError(''); // Clear error when user starts typing
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#6B7280] dark:text-zinc-400 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={handleTitleChange}
            className={`w-full px-4 py-3 border rounded-lg text-base bg-white dark:bg-zinc-800 text-[#1F2937] dark:text-gray-200 focus:outline-none transition-all duration-200 ${
              titleError
                ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900'
                : 'border-gray-200 dark:border-zinc-700 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900'
            }`}
          />
          {titleError && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {titleError}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B7280] dark:text-zinc-400 mb-2">
            Task Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Add details about this task..."
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg text-base bg-white dark:bg-zinc-800 text-[#1F2937] dark:text-gray-200 focus:outline-none transition-all duration-200 resize-none ${
              descriptionError
                ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900'
                : 'border-gray-200 dark:border-zinc-700 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900'
            }`}
          />
          {descriptionError && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {descriptionError}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-semibold rounded-lg hover:from-[#1e40af] hover:to-[#3b82f6] transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-zinc-900 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;