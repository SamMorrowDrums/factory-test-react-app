import { memo, useCallback } from 'react';
import { type TodoCategory, type TodoFilter as TodoFilterType } from '../types/todo';
import { CyberButton } from './CyberButton';
import { CyberSelect } from './CyberSelect';
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
}

export const TodoFilter = memo(function TodoFilter({
  currentFilter,
  currentCategory,
  onFilterChange,
  onCategoryChange,
}: TodoFilterProps) {
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value as TodoCategory | 'all'),
    [onCategoryChange],
  );

  return (
    <div className="todo-filter">
      <div className="todo-filter__status-buttons">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <CyberButton
            key={value}
            variant="ghost"
            size="sm"
            active={currentFilter === value}
            onClick={() => onFilterChange(value)}
            aria-pressed={currentFilter === value}
          >
            {label}
          </CyberButton>
        ))}
      </div>

      <CyberSelect
        value={currentCategory}
        onChange={handleCategoryChange}
        aria-label="Filter by category"
      >
        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </CyberSelect>
    </div>
  );
});
