import { memo } from 'react';
import './CyberCheckbox.css';

interface CyberCheckboxProps {
  checked: boolean;
  onChange: () => void;
  'aria-label'?: string;
}

export const CyberCheckbox = memo(function CyberCheckbox({
  checked,
  onChange,
  'aria-label': ariaLabel,
}: CyberCheckboxProps) {
  return (
    <span className="cyber-checkbox">
      <input
        type="checkbox"
        className="cyber-checkbox__input"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className="cyber-checkbox__box" aria-hidden="true">
        <svg
          className="cyber-checkbox__check"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1.5 5.5L4 8L8.5 2" stroke="#00ffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
});
