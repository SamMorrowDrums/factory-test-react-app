import { useState } from 'react';
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
  onAdd: (title: string, category: TodoCategory, priority: TodoPriority, dueDate: number | null) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const dueDateValue = dueDate ? new Date(dueDate).getTime() : null;
    onAdd(trimmed, category, priority, dueDateValue);
    setTitle('');
    setDueDate('');
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        className="todo-input__text"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo…"
        aria-label="Todo title"
      />

      <select
        className="todo-input__category"
        value={category}
        onChange={(e) => setCategory(e.target.value as TodoCategory)}
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
        onChange={(e) => setPriority(e.target.value as TodoPriority)}
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
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
      />

      <button className="todo-input__add" type="submit">
        Add
      </button>
    </form>
  );
}
