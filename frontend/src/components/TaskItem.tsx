import React, { useState } from "react";
import Modal from "./Modal";

interface Task {
  Id: number;
  Title: string;
  Description: string;
  IsCompleted: boolean;
  CreatedAt: string;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `Added ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    if (diffInHours < 48) return "Added yesterday";
    return `Added ${date.toLocaleDateString()}`;
  };

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-zinc-900/50 p-4 shadow-sm border-l-4 border-[#2563EB] dark:border-blue-400 dark:border dark:border-l-4 hover:shadow-md transition-shadow duration-200">
        {/* Left section - Task content */}
        <div className="flex-1">
          <p className="text-lg font-bold text-[#1F2937] dark:text-gray-200">
            {task.Title}
          </p>
          <p className="text-sm text-[#6B7280] dark:text-zinc-400 mt-1">
            {task.Description}
          </p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2">
            {formatDate(task.CreatedAt)}
          </p>
        </div>

        {/* Right section - Done button */}
        {!task.IsCompleted && (
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6B7280] dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-[#111721]"
          >
            <span className="material-symbols-outlined mr-2 text-base">
              check_circle
            </span>
            Done
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Complete Task"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-base text-[#1F2937] dark:text-gray-200">
              Are you sure you want to mark this task as complete?
            </p>
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border-l-4 border-[#2563EB] dark:border-blue-400">
              <p className="font-bold text-[#1F2937] dark:text-gray-200 mb-1">
                {task.Title}
              </p>
              <p className="text-sm text-[#6B7280] dark:text-zinc-400">
                {task.Description}
              </p>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">
                warning
              </span>
              This action cannot be undone once confirmed.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-5 py-2.5 rounded-lg font-semibold text-[#6B7280] dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-zinc-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onComplete(task.Id);
                setShowConfirmation(false);
              }}
              className="px-5 py-2.5 rounded-lg font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] dark:focus:ring-offset-zinc-900 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              Mark as Complete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskItem;
