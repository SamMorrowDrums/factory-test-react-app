import { useState } from 'react';
import { type TodoCategory } from '../types/todo';
import './TodoInput.css';

const CATEGORY_OPTIONS: { value: TodoCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

interface TodoInputProps {
  onAdd: (title: string, category: TodoCategory) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('personal');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, category);
    setTitle('');
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        className="todo-input__text"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="Todo title"
      />

      <select
        className="todo-input__category"
        value={category}
        onChange={(e) => setCategory(e.target.value as TodoCategory)}
        aria-label="Category"
      >
        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button className="todo-input__add" type="submit">
        Add
      </button>
    </form>
  );
}
