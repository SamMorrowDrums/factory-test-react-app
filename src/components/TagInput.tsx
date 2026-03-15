import { memo, useState, useCallback } from 'react';
import './TagInput.css';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export const TagInput = memo(function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag…',
}: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = useCallback((raw: string) => {
    const tag = normalizeTag(raw);
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  }, [tags, onChange]);

  const removeTag = useCallback((tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  }, [tags, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }, [input, tags, addTag, removeTag]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      const newTags = [...tags];
      parts.forEach((part) => {
        const tag = normalizeTag(part);
        if (tag && !newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
      onChange(newTags);
      setInput('');
    } else {
      setInput(value);
    }
  }, [tags, onChange]);

  return (
    <div className="tag-input">
      {tags.map((tag) => (
        <span key={tag} className="tag-input__chip">
          <span className="tag-input__chip-text">{tag}</span>
          <button
            type="button"
            className="tag-input__chip-remove"
            onClick={() => removeTag(tag)}
            aria-label={`Remove tag "${tag}"`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="tag-input__field"
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        aria-label="Add tag"
      />
    </div>
  );
});
