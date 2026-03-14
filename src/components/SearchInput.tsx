import './SearchInput.css';

interface SearchInputProps {
  query: string;
  onChange: (query: string) => void;
}

export function SearchInput({ query, onChange }: SearchInputProps) {
  return (
    <div className="search-input">
      <input
        className="search-input__field"
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search todos…"
        aria-label="Search todos"
      />
      {query && (
        <button
          className="search-input__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
