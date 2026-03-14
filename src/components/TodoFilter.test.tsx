import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from './TodoFilter';

describe('TodoFilter', () => {
  const defaultProps = {
    currentFilter: 'all' as const,
    currentCategory: 'all' as const,
    currentTag: '',
    availableTags: ['urgent', 'bug'],
    onFilterChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onTagChange: vi.fn(),
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

  it('renders tag filter dropdown when tags are available', () => {
    render(<TodoFilter {...defaultProps} />);
    const tagSelect = screen.getByLabelText('Filter by tag');
    expect(tagSelect).toBeInTheDocument();
    expect(screen.getByText('All Tags')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('calls onTagChange when a tag is selected', async () => {
    const onTagChange = vi.fn();
    render(<TodoFilter {...defaultProps} onTagChange={onTagChange} />);

    await userEvent.selectOptions(screen.getByLabelText('Filter by tag'), 'urgent');
    expect(onTagChange).toHaveBeenCalledWith('urgent');
  });

  it('does not render tag dropdown when no tags available', () => {
    render(<TodoFilter {...defaultProps} availableTags={[]} />);
    expect(screen.queryByLabelText('Filter by tag')).not.toBeInTheDocument();
  });
});
