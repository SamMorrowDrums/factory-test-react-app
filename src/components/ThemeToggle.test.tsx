import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders with cyberpunk label when theme is cyberpunk', () => {
    render(<ThemeToggle theme="cyberpunk" onToggle={vi.fn()} />);
    expect(screen.getByText('CYBER')).toBeInTheDocument();
  });

  it('renders with clean label when theme is clean', () => {
    render(<ThemeToggle theme="clean" onToggle={vi.fn()} />);
    expect(screen.getByText('Clean')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="cyberpunk" onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('has accessible label for switching to clean', () => {
    render(<ThemeToggle theme="cyberpunk" onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Switch to clean theme')).toBeInTheDocument();
  });

  it('has accessible label for switching to cyberpunk', () => {
    render(<ThemeToggle theme="clean" onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Switch to cyberpunk theme')).toBeInTheDocument();
  });

  it('shows lightning emoji for cyberpunk mode', () => {
    render(<ThemeToggle theme="cyberpunk" onToggle={vi.fn()} />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('shows sparkle emoji for clean mode', () => {
    render(<ThemeToggle theme="clean" onToggle={vi.fn()} />);
    expect(screen.getByText('✨')).toBeInTheDocument();
  });
});
