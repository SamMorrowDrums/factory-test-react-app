import { type TodoCategory, type TodoPriority, type TodoFilter as TodoFilterType } from '../types/todo';
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

const PRIORITY_OPTIONS: { value: TodoPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

interface TodoFilterProps {
  currentFilter: TodoFilterType;
  currentCategory: TodoCategory | 'all';
  currentPriority: TodoPriority | 'all';
  onFilterChange: (filter: TodoFilterType) => void;
  onCategoryChange: (category: TodoCategory | 'all') => void;
  onPriorityChange: (priority: TodoPriority | 'all') => void;
}

export function TodoFilter({
  currentFilter,
  currentCategory,
  currentPriority,
  onFilterChange,
  onCategoryChange,
  onPriorityChange,
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

      <select
        className="todo-filter__priority-select"
        value={currentPriority}
        onChange={(e) => onPriorityChange(e.target.value as TodoPriority | 'all')}
        aria-label="Filter by priority"
      >
        {PRIORITY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
