import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInstallPrompt } from './useInstallPrompt';

beforeEach(() => {
  sessionStorage.clear();
});

function fireBeforeInstallPrompt() {
  const promptFn = vi.fn().mockResolvedValue(undefined);
  const event = new Event('beforeinstallprompt', { cancelable: true });
  Object.defineProperty(event, 'prompt', { value: promptFn });
  Object.defineProperty(event, 'userChoice', {
    value: Promise.resolve({ outcome: 'accepted' as const }),
  });
  window.dispatchEvent(event);
  return { promptFn, event };
}

describe('useInstallPrompt', () => {
  it('starts with showPrompt false when no event fired', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.showPrompt).toBe(false);
  });

  it('sets showPrompt true when beforeinstallprompt fires', () => {
    const { result } = renderHook(() => useInstallPrompt());
    act(() => { fireBeforeInstallPrompt(); });
    expect(result.current.showPrompt).toBe(true);
  });

  it('calls prompt and clears on install', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    act(() => { fireBeforeInstallPrompt(); });

    await act(async () => { await result.current.install(); });
    expect(result.current.showPrompt).toBe(false);
  });

  it('dismiss hides the banner and persists to sessionStorage', () => {
    const { result } = renderHook(() => useInstallPrompt());
    act(() => { fireBeforeInstallPrompt(); });
    expect(result.current.showPrompt).toBe(true);

    act(() => { result.current.dismiss(); });
    expect(result.current.showPrompt).toBe(false);
    expect(sessionStorage.getItem('pwa-install-dismissed')).toBe('1');
  });

  it('respects previously dismissed state from sessionStorage', () => {
    sessionStorage.setItem('pwa-install-dismissed', '1');
    const { result } = renderHook(() => useInstallPrompt());
    act(() => { fireBeforeInstallPrompt(); });
    expect(result.current.showPrompt).toBe(false);
  });
});
