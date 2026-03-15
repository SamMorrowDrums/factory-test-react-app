import { memo, useCallback } from 'react';
import './CyberToggle.css';

interface CyberToggleProps {
  checked: boolean;
  onChange: () => void;
  'aria-label'?: string;
  disabled?: boolean;
}

export const CyberToggle = memo(function CyberToggle({
  checked,
  onChange,
  'aria-label': ariaLabel,
  disabled = false,
}: CyberToggleProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!disabled) onChange();
      }
    },
    [onChange, disabled],
  );

  return (
    <span
      className={`cyber-toggle ${checked ? 'cyber-toggle--on' : ''} ${disabled ? 'cyber-toggle--disabled' : ''}`}
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onChange}
      onKeyDown={handleKeyDown}
    >
      <span className="cyber-toggle__track">
        <span className="cyber-toggle__knob" />
      </span>
    </span>
  );
});
