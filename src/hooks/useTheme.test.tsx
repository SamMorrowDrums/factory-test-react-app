import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './useTheme';

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('useTheme / ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to cyberpunk theme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('cyberpunk');
    expect(document.documentElement.getAttribute('data-theme')).toBe('cyberpunk');
  });

  it('toggles between cyberpunk and light', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('cyberpunk');
  });

  it('persists theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(localStorage.getItem('app-theme')).toBe('light');
  });

  it('reads persisted theme from localStorage', () => {
    localStorage.setItem('app-theme', 'light');
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    expect(() => render(<TestConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider',
    );
  });
});
