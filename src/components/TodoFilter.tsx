import { type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import './TodoFilter.css';

const STATUS_OPTIONS: { value: TodoFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const CATEGORY_OPTIONS: { value: TodoCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

interface TodoFilterProps {
  currentFilter: TodoFilterType;
  currentCategory: TodoCategory | 'all';
  currentTag: string;
  availableTags: string[];
  onFilterChange: (filter: TodoFilterType) => void;
  onCategoryChange: (category: TodoCategory | 'all') => void;
  onTagChange: (tag: string) => void;
}

export function TodoFilter({
  currentFilter,
  currentCategory,
  currentTag,
  availableTags,
  onFilterChange,
  onCategoryChange,
  onTagChange,
}: TodoFilterProps) {
  return (
    <div className="todo-filter">
      <div className="todo-filter__status-buttons">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`todo-filter__button${
              currentFilter === value ? ' todo-filter__button--active' : ''
            }`}
            onClick={() => onFilterChange(value)}
            aria-pressed={currentFilter === value}
          >
            {label}
          </button>
        ))}
      </div>

      <select
        className="todo-filter__category-select"
        value={currentCategory}
        onChange={(e) => onCategoryChange(e.target.value as TodoCategory | 'all')}
        aria-label="Filter by category"
      >
        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {availableTags.length > 0 && (
        <select
          className="todo-filter__tag-select"
          value={currentTag}
          onChange={(e) => onTagChange(e.target.value)}
          aria-label="Filter by tag"
        >
          <option value="">All Tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
