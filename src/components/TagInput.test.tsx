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
    render(<TagInput tags={['urgent', 'bug']} onChange={vi.fn()} />);
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('adds a tag on Enter', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), 'feature{enter}');
    expect(onChange).toHaveBeenCalledWith(['feature']);
  });

  it('trims and lowercases new tags', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), '  URGENT  {enter}');
    expect(onChange).toHaveBeenCalledWith(['urgent']);
  });

  it('does not add duplicate tags', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['urgent']} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), 'urgent{enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not add empty tags', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Add tag'), '   {enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes a tag when remove button is clicked', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['urgent', 'bug']} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Remove tag urgent'));
    expect(onChange).toHaveBeenCalledWith(['bug']);
  });

  it('removes last tag on Backspace when input is empty', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['urgent', 'bug']} onChange={onChange} />);

    const input = screen.getByLabelText('Add tag');
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    expect(onChange).toHaveBeenCalledWith(['urgent']);
  });

  it('shows placeholder when no tags exist', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} placeholder="Add tag…" />);
    expect(screen.getByPlaceholderText('Add tag…')).toBeInTheDocument();
  });

  it('hides placeholder when tags exist', () => {
    render(<TagInput tags={['urgent']} onChange={vi.fn()} placeholder="Add tag…" />);
    expect(screen.queryByPlaceholderText('Add tag…')).toBeNull();
  });
});
