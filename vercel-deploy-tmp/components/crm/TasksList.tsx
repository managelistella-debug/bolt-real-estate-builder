'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { cn } from '@/lib/utils';

interface TasksListProps {
  leadId: string;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TasksList({
  leadId,
  tasks,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
}: TasksListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask({
        leadId,
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        completed: false,
        dueDate: undefined,
        assignedUserId: undefined,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAdding(false);
    }
  };

  const getAssignedUserName = (userId?: string) => {
    if (!userId) return null;
    const user = mockTeamMembers.find((m) => m.id === userId);
    return user?.name;
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const leadTasks = tasks.filter((task) => task.leadId === leadId);
  const activeTasks = leadTasks.filter((task) => !task.completed);
  const completedTasks = leadTasks.filter((task) => task.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
          <Input
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <Textarea
            placeholder="Description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        </div>
      )}

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-2">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {task.dueDate && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs',
                        isOverdue(task) ? 'text-red-600' : 'text-gray-500'
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.dueDate)}
                      {isOverdue(task) && ' (Overdue)'}
                    </div>
                  )}
                  {task.assignedUserId && (
                    <Badge variant="secondary" className="text-xs">
                      {getAssignedUserName(task.assignedUserId)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Completed</h4>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 opacity-60 group"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-through text-gray-600">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-through">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {leadTasks.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No tasks yet. Add one to get started.
        </div>
      )}
    </div>
  );
}
