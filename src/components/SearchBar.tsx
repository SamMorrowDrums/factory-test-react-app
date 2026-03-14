import { memo, useCallback } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

export const SearchBar = memo(function SearchBar({ query, onChange }: SearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  const handleClear = useCallback(() => onChange(''), [onChange]);

  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">⌕</span>
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search todos…"
        value={query}
        onChange={handleChange}
        aria-label="Search todos"
      />
      {query && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
});
