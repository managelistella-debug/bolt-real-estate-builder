'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { cn } from '@/lib/utils';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

interface TasksListProps {
  leadId: string;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TasksList({ leadId, tasks, onAddTask, onToggleComplete, onDeleteTask }: TasksListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask({ leadId, title: newTaskTitle.trim(), description: newTaskDescription.trim() || undefined, completed: false, dueDate: undefined, assignedUserId: undefined });
      setNewTaskTitle(''); setNewTaskDescription(''); setIsAdding(false);
    }
  };

  const getAssignedUserName = (userId?: string) => {
    if (!userId) return null;
    return mockTeamMembers.find((m) => m.id === userId)?.name;
  };

  const isOverdue = (task: Task) => !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  const leadTasks = tasks.filter((t) => t.leadId === leadId);
  const activeTasks = leadTasks.filter((t) => !t.completed);
  const completedTasks = leadTasks.filter((t) => t.completed);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-black">Tasks</h3>
        {!isAdding && (
          <button type="button" onClick={() => setIsAdding(true)} className="flex h-[28px] items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
            <Plus className="h-3 w-3" /> Add Task
          </button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-2 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
          <input placeholder="Task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} autoFocus className={darkInput} />
          <textarea placeholder="Description (optional)" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} rows={2} className="w-full resize-none rounded-lg border border-[#EBEBEB] bg-white px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]" />
          <div className="flex justify-end gap-1.5">
            <button type="button" onClick={() => { setIsAdding(false); setNewTaskTitle(''); setNewTaskDescription(''); }} className="h-[28px] rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Cancel</button>
            <button type="button" onClick={handleAddTask} className="h-[28px] rounded-lg bg-[#DAFF07] px-2.5 text-[12px] text-black hover:bg-[#C8ED00]">Add Task</button>
          </div>
        </div>
      )}

      {activeTasks.length > 0 && (
        <div className="space-y-1.5">
          {activeTasks.map((task) => (
            <div key={task.id} className="group flex items-start gap-2.5 rounded-lg border border-[#EBEBEB] bg-white p-3 transition-colors hover:bg-[#F5F5F3]/50">
              <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-black">{task.title}</p>
                    {task.description && <p className="mt-0.5 text-[13px] text-[#888C99]">{task.description}</p>}
                  </div>
                  <button type="button" onClick={() => onDeleteTask(task.id)} className="flex h-6 w-6 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#EBEBEB]">
                    <Trash2 className="h-3 w-3 text-[#CCCCCC]" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  {task.dueDate && (
                    <span className={cn('flex items-center gap-1 text-[11px]', isOverdue(task) ? 'text-red-500' : 'text-[#CCCCCC]')}>
                      <Calendar className="h-2.5 w-2.5" /> {formatDate(task.dueDate)} {isOverdue(task) && '(Overdue)'}
                    </span>
                  )}
                  {task.assignedUserId && (
                    <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">{getAssignedUserName(task.assignedUserId)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-[#CCCCCC]">Completed</p>
          {completedTasks.map((task) => (
            <div key={task.id} className="group flex items-start gap-2.5 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3 opacity-60">
              <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] text-[#888C99] line-through">{task.title}</p>
                  <button type="button" onClick={() => onDeleteTask(task.id)} className="flex h-6 w-6 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#EBEBEB]">
                    <Trash2 className="h-3 w-3 text-[#CCCCCC]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {leadTasks.length === 0 && !isAdding && (
        <div className="py-6 text-center text-[13px] text-[#CCCCCC]">No tasks yet. Add one to get started.</div>
      )}
    </div>
  );
}
