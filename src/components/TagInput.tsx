import { useState, type KeyboardEvent } from 'react';
import './TagInput.css';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function TagInput({ tags, onAddTag, onRemoveTag }: TagInputProps) {
  const [value, setValue] = useState('');

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitTag();
    }
  }

  function submitTag() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddTag(trimmed);
    setValue('');
  }

  return (
    <div className="tag-input">
      <div className="tag-input__tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-input__badge">
            {tag}
            <button
              className="tag-input__remove"
              onClick={() => onRemoveTag(tag)}
              aria-label={`Remove tag "${tag}"`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="tag-input__field"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="+ tag"
        aria-label="Add tag"
      />
    </div>
  );
}
