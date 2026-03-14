import { useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type SoundEffect =
  | 'addTodo'
  | 'completeTodo'
  | 'deleteTodo'
  | 'undo'
  | 'redo'
  | 'click'
  | 'error';

/** Attempt to create a new AudioContext, returning null if unsupported. */
export function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext ?? (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext)();
  } catch {
    return null;
  }
}

/**
 * Synthesise cyberpunk-style sound effects using the Web Audio API.
 *
 * Every sound is procedurally generated — no audio files required.
 * Returns stable `playSound` and `toggleMute` callbacks, plus the
 * current `muted` state (persisted to localStorage).
 */
export function useSoundEffects(ctxFactory?: () => AudioContext | null) {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useLocalStorage<boolean>('glitchdo-muted', false);

  /** Lazily initialise the AudioContext (must happen after a user gesture). */
  const getContext = useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      ctxRef.current = (ctxFactory ?? createAudioContext)();
    }
    const ctx = ctxRef.current;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }, [ctxFactory]);

  // ── Individual sound generators ────────────────────────────────

  const playAddTodo = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Ascending dual-oscillator chirp
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(800, now);
    osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);
  }, []);

  const playCompleteTodo = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Two-tone confirmation chime
    [0, 0.08].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(i === 0 ? 520 : 780, now + offset);
      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.18);
    });
  }, []);

  const playDeleteTodo = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Descending glitch burst
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const distortion = ctx.createWaveShaper();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    // Simple distortion curve for glitchiness
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 50) * x) / (Math.PI + 50 * Math.abs(x));
    }
    distortion.curve = curve;

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }, []);

  const playUndo = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Descending two-step tone (reverse feel)
    [0, 0.06].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(i === 0 ? 660 : 440, now + offset);
      gain.gain.setValueAtTime(0.1, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }, []);

  const playRedo = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Ascending two-step tone (forward feel)
    [0, 0.06].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(i === 0 ? 440 : 660, now + offset);
      gain.gain.setValueAtTime(0.1, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }, []);

  const playClick = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Very short tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }, []);

  const playError = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Low buzz with wobble
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(25, now);
    lfoGain.gain.setValueAtTime(50, now);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.25);
    osc.stop(now + 0.25);
  }, []);

  // ── Dispatch ───────────────────────────────────────────────────

  const SOUND_MAP: Record<SoundEffect, (ctx: AudioContext) => void> = {
    addTodo: playAddTodo,
    completeTodo: playCompleteTodo,
    deleteTodo: playDeleteTodo,
    undo: playUndo,
    redo: playRedo,
    click: playClick,
    error: playError,
  };

  const playSound = useCallback(
    (effect: SoundEffect) => {
      if (muted) return;
      const ctx = getContext();
      if (!ctx) return;
      SOUND_MAP[effect]?.(ctx);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [muted, getContext, playAddTodo, playCompleteTodo, playDeleteTodo, playUndo, playRedo, playClick, playError],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, [setMuted]);

  return { playSound, muted, toggleMute } as const;
}
