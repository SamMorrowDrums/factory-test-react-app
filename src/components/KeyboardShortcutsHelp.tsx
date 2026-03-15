import { memo, useEffect, useRef } from 'react';
import type { KeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import './KeyboardShortcutsHelp.css';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  navigation: 'Navigation',
  actions: 'Actions',
  filters: 'Filters',
};

export const KeyboardShortcutsHelp = memo(function KeyboardShortcutsHelp({
  shortcuts,
  onClose,
}: KeyboardShortcutsHelpProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the modal on open
    const closeBtn = modalRef.current?.querySelector<HTMLElement>('.shortcuts-modal__close');
    closeBtn?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  // Focus trap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const grouped = shortcuts.reduce<Record<string, KeyboardShortcut[]>>(
    (acc, shortcut) => {
      (acc[shortcut.category] ??= []).push(shortcut);
      return acc;
    },
    {},
  );

  return (
    <div
      className="shortcuts-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        ref={modalRef}
        className="shortcuts-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shortcuts-modal__header">
          <h2 className="shortcuts-modal__title">Keyboard Shortcuts</h2>
          <button
            className="shortcuts-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="shortcuts-modal__body">
          {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
            const items = grouped[category];
            if (!items) return null;
            return (
              <div key={category} className="shortcuts-modal__section">
                <h3 className="shortcuts-modal__section-title">{label}</h3>
                <dl className="shortcuts-modal__list">
                  {items.map(({ key, description }) => (
                    <div key={key} className="shortcuts-modal__item">
                      <dt className="shortcuts-modal__key">
                        {key.split(' / ').map((k, i) => (
                          <span key={i}>
                            {i > 0 && (
                              <span className="shortcuts-modal__separator">
                                {' / '}
                              </span>
                            )}
                            <kbd>{k}</kbd>
                          </span>
                        ))}
                      </dt>
                      <dd className="shortcuts-modal__desc">{description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
