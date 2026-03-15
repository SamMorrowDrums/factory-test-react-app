import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberSelect } from './CyberSelect';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('CyberSelect', () => {
  it('renders with combobox role', () => {
    render(<CyberSelect options={options} value="a" onChange={() => {}} aria-label="Test" />);
    expect(screen.getByRole('combobox', { name: 'Test' })).toBeInTheDocument();
  });

  it('displays the selected option label', () => {
    render(<CyberSelect options={options} value="b" onChange={() => {}} />);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    render(<CyberSelect options={options} value="a" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all options when open', async () => {
    render(<CyberSelect options={options} value="a" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    const items = within(listbox).getAllByRole('option');
    expect(items).toHaveLength(3);
  });

  it('calls onChange and closes when option is clicked', async () => {
    const onChange = vi.fn();
    render(<CyberSelect options={options} value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Beta/i }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('marks the current value as selected', async () => {
    render(<CyberSelect options={options} value="b" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    const betaOption = screen.getByRole('option', { name: /Beta/i });
    expect(betaOption).toHaveAttribute('aria-selected', 'true');
  });

  it('closes on Escape key', async () => {
    render(<CyberSelect options={options} value="a" onChange={() => {}} aria-label="Test" />);
    const combobox = screen.getByRole('combobox');
    combobox.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('navigates options with arrow keys', async () => {
    const onChange = vi.fn();
    render(<CyberSelect options={options} value="a" onChange={onChange} aria-label="Test" />);
    const combobox = screen.getByRole('combobox');
    combobox.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('sets aria-expanded correctly', async () => {
    render(<CyberSelect options={options} value="a" onChange={() => {}} aria-label="Test" />);
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
  });
});
