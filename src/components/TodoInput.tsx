import { useState, type KeyboardEvent } from 'react';
import type { TodoCategory } from '../types/todo';
import './TodoInput.css';

const CATEGORY_OPTIONS: { value: TodoCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

interface TodoInputProps {
  onAdd: (title: string, category: TodoCategory, tags?: string[]) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('work');
  const [tagText, setTagText] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  function addTag() {
    const trimmed = tagText.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagText('');
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, category, tags.length > 0 ? tags : undefined);
    setTitle('');
    setTags([]);
    setTagText('');
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <div className="todo-input__main-row">
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

        <button className="todo-input__add" type="submit">
          Add
        </button>
      </div>

      <div className="todo-input__tags-row">
        {tags.map((tag) => (
          <span key={tag} className="todo-input__tag-badge">
            {tag}
            <button
              type="button"
              className="todo-input__tag-remove"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag "${tag}"`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="todo-input__tag-field"
          type="text"
          value={tagText}
          onChange={(e) => setTagText(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="+ tag"
          aria-label="Add tag"
        />
      </div>
    </form>
  );
}
