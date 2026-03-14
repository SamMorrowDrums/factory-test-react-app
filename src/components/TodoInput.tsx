import { memo, useState, useCallback } from 'react';
import type { TodoCategory, TodoPriority } from '../types/todo';
import './TodoInput.css';

const CATEGORY_OPTIONS: { value: TodoCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

interface TodoInputProps {
  onAdd: (title: string, category: TodoCategory, priority: TodoPriority, dueDate?: number) => void;
}

export const TodoInput = memo(function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const dueDateTimestamp = dueDate ? new Date(dueDate + 'T00:00:00').getTime() : undefined;
    onAdd(trimmed, category, priority, dueDateTimestamp);
    setTitle('');
    setDueDate('');
  }, [title, category, priority, dueDate, onAdd]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as TodoCategory), []);
  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as TodoPriority), []);
  const handleDueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value), []);

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <div className="todo-input__row">
        <input
          className="todo-input__text"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Add a new todo…"
          aria-label="Todo title"
        />

        <button className="todo-input__add" type="submit">
          Add
        </button>
      </div>

      <div className="todo-input__row">
        <select
          className="todo-input__category"
          value={category}
          onChange={handleCategoryChange}
          aria-label="Todo category"
        >
          {CATEGORY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="todo-input__priority"
          value={priority}
          onChange={handlePriorityChange}
          aria-label="Todo priority"
        >
          {PRIORITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          className="todo-input__due-date"
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
          aria-label="Due date"
        />
      </div>
    </form>
  );
});
