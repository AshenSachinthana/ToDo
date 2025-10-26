import React from 'react';
import TaskItem from './TaskItem';

interface Task {
  Id: number;
  Title: string;
  Description: string;
  IsCompleted: boolean;
  CreatedAt: string;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (Id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900/50 rounded-xl shadow-md p-12 text-center border-l-4 border-[#2563EB] dark:border-blue-400 dark:border dark:border-l-4">
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-zinc-600 mb-4">task_alt</span>
        <p className="text-2xl font-bold text-[#1F2937] dark:text-gray-200 mb-2">No tasks yet!</p>
        <p className="text-[#6B7280] dark:text-zinc-400">Click "Add New Task" to create your first task</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[#1F2937] dark:text-gray-200 text-2xl font-bold leading-tight tracking-tight px-2 pt-4">
        Recent Tasks
      </h2>
      {tasks.map((task) => (
        <TaskItem key={task.Id} task={task} onComplete={onComplete} />
      ))}
    </div>
  );
};

export default TaskList;