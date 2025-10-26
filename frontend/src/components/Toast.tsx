import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-800',
      border: 'border-green-500 dark:border-green-500',
      text: 'text-green-800 dark:text-green-50',
      icon: 'check_circle',
      iconColor: 'text-green-600 dark:text-green-300'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-800',
      border: 'border-red-500 dark:border-red-500',
      text: 'text-red-800 dark:text-red-50',
      icon: 'error',
      iconColor: 'text-red-600 dark:text-red-300'
    }
  };

  const style = styles[type];

  return (
    <div
      className={`flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-lg shadow-lg border-l-4 ${style.bg} ${style.border} animate-slideInRight`}
      role="alert"
    >
      <span className={`material-symbols-outlined ${style.iconColor}`}>
        {style.icon}
      </span>
      <p className={`flex-1 font-medium ${style.text}`}>
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className={`${style.text} hover:opacity-70 transition-opacity`}
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Toast;
