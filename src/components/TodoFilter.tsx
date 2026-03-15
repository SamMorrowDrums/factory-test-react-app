import { memo, useCallback } from 'react';
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
  onFilterChange: (filter: TodoFilterType) => void;
  onCategoryChange: (category: TodoCategory | 'all') => void;
  availableTags?: string[];
  selectedTag?: string | null;
  onTagFilterChange?: (tag: string | null) => void;
}

export const TodoFilter = memo(function TodoFilter({
  currentFilter,
  currentCategory,
  onFilterChange,
  onCategoryChange,
  availableTags = [],
  selectedTag = null,
  onTagFilterChange,
}: TodoFilterProps) {
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value as TodoCategory | 'all'),
    [onCategoryChange],
  );

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onTagFilterChange?.(value === 'all' ? null : value);
    },
    [onTagFilterChange],
  );

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

      <div className="todo-filter__dropdowns">
        <select
          className="todo-filter__category-select"
          value={currentCategory}
          onChange={handleCategoryChange}
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
            value={selectedTag ?? 'all'}
            onChange={handleTagChange}
            aria-label="Filter by tag"
          >
            <option value="all">All Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
});
