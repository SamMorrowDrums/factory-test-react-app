import { memo, useState, useCallback, forwardRef } from 'react';
import type { TodoCategory } from '../types/todo';
import { TagInput } from './TagInput';
import './TodoInput.css';

const CATEGORY_OPTIONS: { value: TodoCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

interface TodoInputProps {
  onAdd: (title: string, category: TodoCategory, notes?: string, tags?: string[]) => void;
}

export const TodoInput = memo(forwardRef<HTMLInputElement, TodoInputProps>(function TodoInput({ onAdd }, ref) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const trimmedNotes = notes.trim();
    onAdd(trimmed, category, trimmedNotes || undefined, tags.length > 0 ? tags : undefined);
    setTitle('');
    setNotes('');
    setTags([]);
    setShowNotes(false);
    setShowTags(false);
  }, [title, category, notes, tags, onAdd]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as TodoCategory), []);
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), []);
  const toggleNotes = useCallback(() => setShowNotes((prev) => !prev), []);
  const toggleTags = useCallback(() => setShowTags((prev) => !prev), []);

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <div className="todo-input__row">
        <input
          ref={ref}
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

        <button
          className={`todo-input__tags-toggle ${showTags ? 'todo-input__tags-toggle--active' : ''}`}
          type="button"
          onClick={toggleTags}
          aria-label="Toggle tags"
          aria-expanded={showTags}
        >
          🏷 Tags
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

      {showTags && (
        <TagInput tags={tags} onChange={setTags} placeholder="Add tags (press Enter or comma)…" />
      )}
    </form>
  );
}));
