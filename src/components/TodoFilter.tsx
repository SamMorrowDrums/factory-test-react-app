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
}

export function TodoFilter({
  currentFilter,
  currentCategory,
  onFilterChange,
  onCategoryChange,
}: TodoFilterProps) {
  return (
    <div className="todo-filter" role="search" aria-label="Filter todos">
      <div className="todo-filter__status-buttons" role="group" aria-label="Filter by status">
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
    </div>
  );
}
