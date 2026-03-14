import { memo } from 'react';
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
      aria-label="Keyboard shortcuts"
    >
      <div
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
