import { memo, useState, useCallback } from 'react';
import type { TodoCategory } from '../types/todo';
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

export const TodoInput = memo(function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, category);
    setTitle('');
  }, [title, category, onAdd]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as TodoCategory), []);

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        className="todo-input__text"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Add a new todo…"
        aria-label="Todo title"
      />

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

      <button className="todo-input__add" type="submit">
        Add
      </button>
    </form>
  );
});
