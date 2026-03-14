import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer } from './Toast';

describe('Toast', () => {
  it('renders the message', () => {
    render(<Toast toast={{ id: '1', message: 'Undo' }} onDismiss={vi.fn()} />);
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<Toast toast={{ id: '1', message: 'Undo' }} onDismiss={onDismiss} />);

    await userEvent.click(screen.getByLabelText('Dismiss notification'));
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('auto-dismisses after duration', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast toast={{ id: '1', message: 'Undo' }} onDismiss={onDismiss} duration={2000} />);

    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(onDismiss).toHaveBeenCalledWith('1');
    vi.useRealTimers();
  });
});

describe('ToastContainer', () => {
  it('renders nothing when toasts are empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders all toasts', () => {
    const toasts = [
      { id: '1', message: 'First' },
      { id: '2', message: 'Second' },
    ];
    render(<ToastContainer toasts={toasts} onDismiss={vi.fn()} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
