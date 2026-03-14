import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from './TodoFilter';

describe('TodoFilter', () => {
  const defaultProps = {
    currentFilter: 'all' as const,
    currentCategory: 'all' as const,
    currentPriority: 'all' as const,
    onFilterChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onPriorityChange: vi.fn(),
  };

  it('renders all three status filter buttons', () => {
    render(<TodoFilter {...defaultProps} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('highlights the active filter button', () => {
    render(<TodoFilter {...defaultProps} currentFilter="active" />);
    const activeBtn = screen.getByText('Active');
    expect(activeBtn).toHaveClass('todo-filter__button--active');
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true');

    const allBtn = screen.getByText('All');
    expect(allBtn).not.toHaveClass('todo-filter__button--active');
    expect(allBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onFilterChange when a status button is clicked', async () => {
    const onFilterChange = vi.fn();
    render(<TodoFilter {...defaultProps} onFilterChange={onFilterChange} />);

    await userEvent.click(screen.getByText('Completed'));
    expect(onFilterChange).toHaveBeenCalledWith('completed');
  });

  it('renders the category dropdown with all options', () => {
    render(<TodoFilter {...defaultProps} />);
    const select = screen.getByLabelText('Filter by category');
    expect(select).toBeInTheDocument();

    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('All Categories');
    expect(options[1]).toHaveTextContent('Work');
    expect(options[2]).toHaveTextContent('Personal');
    expect(options[3]).toHaveTextContent('Shopping');
    expect(options[4]).toHaveTextContent('Health');
  });

  it('calls onCategoryChange when a category is selected', async () => {
    const onCategoryChange = vi.fn();
    render(<TodoFilter {...defaultProps} onCategoryChange={onCategoryChange} />);

    await userEvent.selectOptions(
      screen.getByLabelText('Filter by category'),
      'work'
    );
    expect(onCategoryChange).toHaveBeenCalledWith('work');
  });

  it('reflects the current category in the dropdown', () => {
    render(<TodoFilter {...defaultProps} currentCategory="personal" />);
    const select = screen.getByLabelText('Filter by category') as HTMLSelectElement;
    expect(select.value).toBe('personal');
  });

  it('renders the priority dropdown with all options', () => {
    render(<TodoFilter {...defaultProps} />);
    const select = screen.getByLabelText('Filter by priority');
    expect(select).toBeInTheDocument();

    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('All Priorities');
    expect(options[1]).toHaveTextContent('High');
    expect(options[2]).toHaveTextContent('Medium');
    expect(options[3]).toHaveTextContent('Low');
  });

  it('calls onPriorityChange when a priority is selected', async () => {
    const onPriorityChange = vi.fn();
    render(<TodoFilter {...defaultProps} onPriorityChange={onPriorityChange} />);

    await userEvent.selectOptions(
      screen.getByLabelText('Filter by priority'),
      'high'
    );
    expect(onPriorityChange).toHaveBeenCalledWith('high');
  });

  it('reflects the current priority in the dropdown', () => {
    render(<TodoFilter {...defaultProps} currentPriority="high" />);
    const select = screen.getByLabelText('Filter by priority') as HTMLSelectElement;
    expect(select.value).toBe('high');
  });
});
