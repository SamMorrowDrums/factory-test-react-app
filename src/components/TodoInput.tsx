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
  onAdd: (title: string, category: TodoCategory, notes?: string) => void;
}

export const TodoInput = memo(function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const trimmedNotes = notes.trim();
    onAdd(trimmed, category, trimmedNotes || undefined);
    setTitle('');
    setNotes('');
    setShowNotes(false);
  }, [title, category, notes, onAdd]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as TodoCategory), []);
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), []);
  const toggleNotes = useCallback(() => setShowNotes((prev) => !prev), []);

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

        <button
          className={`todo-input__notes-toggle ${showNotes ? 'todo-input__notes-toggle--active' : ''}`}
          type="button"
          onClick={toggleNotes}
          aria-label="Toggle notes"
          aria-expanded={showNotes}
        >
          ✎ Notes
        </button>

        <button className="todo-input__add" type="submit">
          Add
        </button>
      </div>

      {showNotes && (
        <textarea
          className="todo-input__notes"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add notes or description…"
          aria-label="Todo notes"
          rows={3}
        />
      )}
    </form>
  );
});
