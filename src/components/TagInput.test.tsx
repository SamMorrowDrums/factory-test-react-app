import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  it('renders an input field', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Add tag')).toBeInTheDocument();
  });

  it('displays existing tags as chips', () => {
    render(<TagInput tags={['urgent', 'frontend']} onChange={vi.fn()} />);
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('adds a tag when Enter is pressed', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), 'new-tag{Enter}');
    expect(onChange).toHaveBeenCalledWith(['new-tag']);
  });

  it('normalizes tags to lowercase', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), 'URGENT{Enter}');
    expect(onChange).toHaveBeenCalledWith(['urgent']);
  });

  it('does not add duplicate tags', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['urgent']} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), 'urgent{Enter}');
    // onChange should still be called with the clear, but not with a duplicate added
    expect(onChange).not.toHaveBeenCalledWith(['urgent', 'urgent']);
  });

  it('removes a tag when the remove button is clicked', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['urgent', 'frontend']} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Remove tag "urgent"'));
    expect(onChange).toHaveBeenCalledWith(['frontend']);
  });

  it('removes last tag on Backspace when input is empty', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['urgent', 'frontend']} onChange={onChange} />);

    const input = screen.getByLabelText('Add tag');
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    expect(onChange).toHaveBeenCalledWith(['urgent']);
  });

  it('shows placeholder when no tags exist', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} placeholder="Add tags here…" />);
    expect(screen.getByPlaceholderText('Add tags here…')).toBeInTheDocument();
  });

  it('hides placeholder when tags exist', () => {
    render(<TagInput tags={['existing']} onChange={vi.fn()} placeholder="Add tags here…" />);
    expect(screen.queryByPlaceholderText('Add tags here…')).toBeNull();
  });

  it('trims whitespace from tag input', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), '  spaced  {Enter}');
    expect(onChange).toHaveBeenCalledWith(['spaced']);
  });

  it('replaces spaces with hyphens in tags', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), 'my tag{Enter}');
    expect(onChange).toHaveBeenCalledWith(['my-tag']);
  });
});
