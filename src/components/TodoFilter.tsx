import { memo, useCallback } from 'react';
import { type TodoCategory, type TodoPriority, type TodoFilter as TodoFilterType } from '../types/todo';
import { CyberSelect, type CyberSelectOption } from './CyberSelect';
import { CyberButton } from './CyberButton';
import './TodoFilter.css';

const STATUS_OPTIONS: { value: TodoFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const CATEGORY_OPTIONS: CyberSelectOption<TodoCategory | 'all'>[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

const PRIORITY_OPTIONS: CyberSelectOption<TodoPriority | 'all'>[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: '⚡ High' },
  { value: 'medium', label: '● Medium' },
  { value: 'low', label: '○ Low' },
];

interface TodoFilterProps {
  currentFilter: TodoFilterType;
  currentCategory: TodoCategory | 'all';
  currentPriority?: TodoPriority | 'all';
  onFilterChange: (filter: TodoFilterType) => void;
  onCategoryChange: (category: TodoCategory | 'all') => void;
  onPriorityChange?: (priority: TodoPriority | 'all') => void;
}

export const TodoFilter = memo(function TodoFilter({
  currentFilter,
  currentCategory,
  currentPriority = 'all',
  onFilterChange,
  onCategoryChange,
  onPriorityChange,
}: TodoFilterProps) {
  const handleCategoryChange = useCallback(
    (value: TodoCategory | 'all') => onCategoryChange(value),
    [onCategoryChange],
  );

  const handlePriorityChange = useCallback(
    (value: TodoPriority | 'all') => onPriorityChange?.(value),
    [onPriorityChange],
  );

  return (
    <div className="todo-filter">
      <div className="todo-filter__status-buttons">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <CyberButton
            key={value}
            variant={currentFilter === value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onFilterChange(value)}
            aria-pressed={currentFilter === value}
          >
            {label}
          </CyberButton>
        ))}
      </div>

      <div className="todo-filter__selects">
        <CyberSelect
          options={CATEGORY_OPTIONS}
          value={currentCategory}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
        />

        <CyberSelect
          options={PRIORITY_OPTIONS}
          value={currentPriority}
          onChange={handlePriorityChange}
          aria-label="Filter by priority"
        />
      </div>
    </div>
  );
});
