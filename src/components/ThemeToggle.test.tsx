import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

const mockToggleTheme = vi.fn();
let mockTheme = 'cyberpunk';

vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: mockTheme, toggleTheme: mockToggleTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockTheme = 'cyberpunk';
    mockToggleTheme.mockClear();
  });

  it('renders a toggle button', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /switch to light theme/i }),
    ).toBeInTheDocument();
  });

  it('shows sun emoji in cyberpunk mode', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveTextContent('☀️');
  });

  it('shows moon emoji in light mode', () => {
    mockTheme = 'light';
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveTextContent('🌙');
  });

  it('calls toggleTheme when clicked', async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });
});
