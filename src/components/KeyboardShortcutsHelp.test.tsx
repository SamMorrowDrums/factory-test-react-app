import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardShortcuts';

describe('KeyboardShortcutsHelp', () => {
  it('renders the shortcuts dialog', () => {
    render(<KeyboardShortcutsHelp shortcuts={KEYBOARD_SHORTCUTS} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('displays all category headings', () => {
    render(<KeyboardShortcutsHelp shortcuts={KEYBOARD_SHORTCUTS} onClose={vi.fn()} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('displays shortcut descriptions', () => {
    render(<KeyboardShortcutsHelp shortcuts={KEYBOARD_SHORTCUTS} onClose={vi.fn()} />);
    expect(screen.getByText('Show keyboard shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Next todo')).toBeInTheDocument();
    expect(screen.getByText('Toggle todo completion')).toBeInTheDocument();
    expect(screen.getByText('Show all todos')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<KeyboardShortcutsHelp shortcuts={KEYBOARD_SHORTCUTS} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders kbd elements for shortcut keys', () => {
    render(<KeyboardShortcutsHelp shortcuts={KEYBOARD_SHORTCUTS} onClose={vi.fn()} />);
    const kbds = document.querySelectorAll('kbd');
    expect(kbds.length).toBeGreaterThan(0);
  });
});
