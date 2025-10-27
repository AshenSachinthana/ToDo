import { useState, useEffect } from 'react';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast, { type ToastType } from './components/Toast';
import { getTasks, createTask, completeTask } from './services/api';
import './App.css';

interface Task {
  Id: number;
  Title: string;
  Description: string;
  IsCompleted: boolean;
  CreatedAt: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleCreateTask = async (Title: string, Description: string) => {
    try {
      await createTask(Title, Description);
      loadTasks();
      setShowForm(false);
      showToast('Task created successfully!', 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('Failed to create task. Please try again.', 'error');
    }
  };

  const handleCompleteTask = async (Id: number) => {
    try {
      await completeTask(Id);
      loadTasks();
      showToast('Task marked as complete!', 'success');
    } catch (error) {
      console.error('Error completing task:', error);
      showToast('Failed to complete task. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111721] flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-300 font-medium">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] py-8 shadow-md">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 sm:flex-row sm:items-center">
            <h1 className="text-white text-4xl font-black tracking-tighter">Task Manager</h1>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center rounded-lg h-12 w-12 bg-white/20 hover:bg-white/30 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                aria-label="Toggle dark mode"
              >
                <span className="material-symbols-outlined text-2xl">
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* Add Task Button */}
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white text-[#2563EB] text-base font-bold leading-normal tracking-wide shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-offset-[#111721]"
              >
                <span className="material-symbols-outlined mr-2">add_circle</span>
                <span className="truncate">Add New Task</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 justify-center py-8 bg-[#f6f7f8] dark:bg-[#111721]">
          <div className="layout-content-container flex w-full max-w-4xl flex-col gap-8 px-6">
            {/* Task List */}
            <TaskList tasks={tasks} onComplete={handleCompleteTask} />
          </div>
        </main>
      </div>

      {/* Modal for Task Form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Create New Task"
      >
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}

export default App;