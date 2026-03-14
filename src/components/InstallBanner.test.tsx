import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallBanner } from './InstallBanner';

describe('InstallBanner', () => {
  it('renders the install banner with cyberpunk text', () => {
    render(<InstallBanner onInstall={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getByText('INSTALL_GLITCH_DO')).toBeInTheDocument();
    expect(screen.getByText('Go offline. Go rogue.')).toBeInTheDocument();
    expect(screen.getByText('JACK_IN')).toBeInTheDocument();
  });

  it('calls onInstall when install button is clicked', async () => {
    const user = userEvent.setup();
    const onInstall = vi.fn();
    render(<InstallBanner onInstall={onInstall} onDismiss={vi.fn()} />);

    await user.click(screen.getByText('JACK_IN'));
    expect(onInstall).toHaveBeenCalledOnce();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<InstallBanner onInstall={vi.fn()} onDismiss={onDismiss} />);

    await user.click(screen.getByLabelText('Dismiss install prompt'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has role="alert" for accessibility', () => {
    render(<InstallBanner onInstall={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
