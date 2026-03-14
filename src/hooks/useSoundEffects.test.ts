import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSoundEffects } from './useSoundEffects';

// Build a minimal AudioContext mock
function makeMockCtx() {
  const mockOsc = () => ({
    type: 'sine' as OscillatorType,
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });

  const mockGainNode = () => ({
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      value: 1,
    },
    connect: vi.fn(),
  });

  return {
    currentTime: 0,
    state: 'running' as AudioContextState,
    resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn(mockOsc),
    createGain: vi.fn(mockGainNode),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass' as BiquadFilterType,
      frequency: { setValueAtTime: vi.fn() },
      Q: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
    createWaveShaper: vi.fn(() => ({
      curve: null as Float32Array | null,
      connect: vi.fn(),
    })),
    destination: {},
  } as unknown as AudioContext;
}

describe('useSoundEffects', () => {
  let ctx: AudioContext & { createOscillator: ReturnType<typeof vi.fn>; createGain: ReturnType<typeof vi.fn>; resume: ReturnType<typeof vi.fn> };
  let factory: () => AudioContext;

  beforeEach(() => {
    localStorage.clear();
    ctx = makeMockCtx() as typeof ctx;
    factory = () => ctx;
  });

  it('returns playSound, muted, and toggleMute', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    expect(result.current.playSound).toBeInstanceOf(Function);
    expect(result.current.toggleMute).toBeInstanceOf(Function);
    expect(result.current.muted).toBe(false);
  });

  it('plays addTodo sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('addTodo'));
    expect(ctx.createOscillator).toHaveBeenCalled();
    expect(ctx.createGain).toHaveBeenCalled();
  });

  it('plays completeTodo sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('completeTodo'));
    expect(ctx.createOscillator).toHaveBeenCalled();
  });

  it('plays deleteTodo sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('deleteTodo'));
    expect(ctx.createOscillator).toHaveBeenCalled();
  });

  it('plays undo sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('undo'));
    expect(ctx.createOscillator).toHaveBeenCalled();
  });

  it('plays redo sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('redo'));
    expect(ctx.createOscillator).toHaveBeenCalled();
  });

  it('plays click sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('click'));
    expect(ctx.createOscillator).toHaveBeenCalled();
  });

  it('plays error sound', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    act(() => result.current.playSound('error'));
    expect(ctx.createOscillator).toHaveBeenCalled();
  });

  it('does not play when muted', () => {
    const { result } = renderHook(() => useSoundEffects(factory));

    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);

    act(() => result.current.playSound('addTodo'));
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });

  it('toggleMute toggles muted state', () => {
    const { result } = renderHook(() => useSoundEffects(factory));
    expect(result.current.muted).toBe(false);

    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);

    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(false);
  });

  it('persists muted state to localStorage', () => {
    const { result } = renderHook(() => useSoundEffects(factory));

    act(() => result.current.toggleMute());
    expect(JSON.parse(localStorage.getItem('glitchdo-muted') ?? 'false')).toBe(true);
  });

  it('handles null AudioContext gracefully', () => {
    const nullFactory = () => null;
    const { result } = renderHook(() => useSoundEffects(nullFactory));

    // Should not throw
    act(() => result.current.playSound('addTodo'));
  });
});
