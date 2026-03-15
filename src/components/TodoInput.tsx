import { memo, useState, useCallback, forwardRef } from 'react';
import type { TodoCategory, TodoPriority } from '../types/todo';
import './TodoInput.css';

const CATEGORY_OPTIONS: { value: TodoCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: 'high', label: '⚡ High' },
  { value: 'medium', label: '● Medium' },
  { value: 'low', label: '○ Low' },
];

interface TodoInputProps {
  onAdd: (title: string, category: TodoCategory, options?: { notes?: string; priority?: TodoPriority; dueDate?: number }) => void;
}

export const TodoInput = memo(forwardRef<HTMLInputElement, TodoInputProps>(function TodoInput({ onAdd }, ref) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const trimmedNotes = notes.trim();
    const dueDateTimestamp = dueDate ? new Date(dueDate + 'T00:00:00').getTime() : undefined;
    onAdd(trimmed, category, {
      notes: trimmedNotes || undefined,
      priority,
      dueDate: dueDateTimestamp,
    });
    setTitle('');
    setNotes('');
    setDueDate('');
    setShowNotes(false);
  }, [title, category, priority, dueDate, notes, onAdd]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as TodoCategory), []);
  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as TodoPriority), []);
  const handleDueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value), []);
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), []);
  const toggleNotes = useCallback(() => setShowNotes((prev) => !prev), []);

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

      <div className="todo-input__extras">
        <input
          className="todo-input__due-date"
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
          aria-label="Due date"
        />
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
}));
