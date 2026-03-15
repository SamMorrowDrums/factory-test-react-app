import { memo, useState, useCallback, forwardRef } from 'react';
import type { TodoCategory, TodoPriority } from '../types/todo';
import { CyberSelect, type CyberSelectOption } from './CyberSelect';
import { CyberButton } from './CyberButton';
import { TagInput } from './TagInput';
import './TodoInput.css';

const CATEGORY_OPTIONS: CyberSelectOption<TodoCategory>[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

const PRIORITY_OPTIONS: CyberSelectOption<TodoPriority>[] = [
  { value: 'high', label: '⚡ High' },
  { value: 'medium', label: '● Medium' },
  { value: 'low', label: '○ Low' },
];

interface TodoInputProps {
  onAdd: (title: string, category: TodoCategory, options?: { notes?: string; priority?: TodoPriority; dueDate?: number; tags?: string[] }) => void;
}

export const TodoInput = memo(forwardRef<HTMLInputElement, TodoInputProps>(function TodoInput({ onAdd }, ref) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

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
      tags: tags.length > 0 ? tags : undefined,
    });
    setTitle('');
    setNotes('');
    setDueDate('');
    setTags([]);
    setShowNotes(false);
  }, [title, category, priority, dueDate, notes, tags, onAdd]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), []);
  const handleCategoryChange = useCallback((value: TodoCategory) => setCategory(value), []);
  const handlePriorityChange = useCallback((value: TodoPriority) => setPriority(value), []);
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

        <CyberSelect
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={handleCategoryChange}
          aria-label="Todo category"
        />

        <CyberSelect
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={handlePriorityChange}
          aria-label="Todo priority"
        />

        <CyberButton
          variant="secondary"
          size="md"
          type="button"
          onClick={toggleNotes}
          aria-label="Toggle notes"
          aria-expanded={showNotes}
          className={showNotes ? 'todo-input__notes-toggle--active' : ''}
        >
          ✎ Notes
        </CyberButton>

        <CyberButton variant="primary" size="md" type="submit">
          Add
        </CyberButton>
      </div>

      <div className="todo-input__extras">
        <input
          className="todo-input__due-date"
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
          aria-label="Due date"
        />
        <TagInput tags={tags} onChange={setTags} aria-label="Todo tags" />
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
