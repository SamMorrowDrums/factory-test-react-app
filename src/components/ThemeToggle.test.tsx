import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders with cyberpunk label when theme is cyberpunk', () => {
    render(<ThemeToggle theme="cyberpunk" onToggle={vi.fn()} />);
    expect(screen.getByRole('button', { name: /switch to clean theme/i })).toBeInTheDocument();
    expect(screen.getByText('Clean')).toBeInTheDocument();
  });

  it('renders with cyber label when theme is clean', () => {
    render(<ThemeToggle theme="clean" onToggle={vi.fn()} />);
    expect(screen.getByRole('button', { name: /switch to cyberpunk theme/i })).toBeInTheDocument();
    expect(screen.getByText('Cyber')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="cyberpunk" onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('applies cyberpunk modifier class when theme is cyberpunk', () => {
    render(<ThemeToggle theme="cyberpunk" onToggle={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('theme-toggle--cyberpunk');
  });

  it('applies clean modifier class when theme is clean', () => {
    render(<ThemeToggle theme="clean" onToggle={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('theme-toggle--clean');
  });
});
