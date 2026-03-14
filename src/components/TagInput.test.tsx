import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  const defaultProps = {
    tags: ['urgent', 'bug'],
    onAddTag: vi.fn(),
    onRemoveTag: vi.fn(),
  };

  it('renders existing tags as badges', () => {
    render(<TagInput {...defaultProps} />);
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('renders the tag input field', () => {
    render(<TagInput {...defaultProps} />);
    expect(screen.getByLabelText('Add tag')).toBeInTheDocument();
  });

  it('calls onAddTag when Enter is pressed with text', async () => {
    const onAddTag = vi.fn();
    render(<TagInput {...defaultProps} onAddTag={onAddTag} />);

    const input = screen.getByLabelText('Add tag');
    await userEvent.type(input, 'feature{enter}');
    expect(onAddTag).toHaveBeenCalledWith('feature');
  });

  it('does not call onAddTag when Enter is pressed with empty input', async () => {
    const onAddTag = vi.fn();
    render(<TagInput {...defaultProps} onAddTag={onAddTag} />);

    const input = screen.getByLabelText('Add tag');
    await userEvent.type(input, '{enter}');
    expect(onAddTag).not.toHaveBeenCalled();
  });

  it('clears input after adding a tag', async () => {
    render(<TagInput {...defaultProps} />);

    const input = screen.getByLabelText('Add tag') as HTMLInputElement;
    await userEvent.type(input, 'feature{enter}');
    expect(input.value).toBe('');
  });

  it('calls onRemoveTag when remove button is clicked', async () => {
    const onRemoveTag = vi.fn();
    render(<TagInput {...defaultProps} onRemoveTag={onRemoveTag} />);

    await userEvent.click(screen.getByLabelText('Remove tag "urgent"'));
    expect(onRemoveTag).toHaveBeenCalledWith('urgent');
  });

  it('renders remove button with aria-label for each tag', () => {
    render(<TagInput {...defaultProps} />);
    expect(screen.getByLabelText('Remove tag "urgent"')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove tag "bug"')).toBeInTheDocument();
  });
});
