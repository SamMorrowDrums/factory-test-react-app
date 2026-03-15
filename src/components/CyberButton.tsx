import { memo } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './CyberButton.css';

type CyberButtonVariant = 'primary' | 'danger' | 'secondary';
type CyberButtonSize = 'sm' | 'md';

interface CyberButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: CyberButtonVariant;
  size?: CyberButtonSize;
  children: ReactNode;
  className?: string;
}

export const CyberButton = memo(function CyberButton({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...rest
}: CyberButtonProps) {
  const classNames = [
    'cyber-btn',
    `cyber-btn--${variant}`,
    `cyber-btn--${size}`,
    disabled ? 'cyber-btn--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled} {...rest}>
      <span className="cyber-btn__content">{children}</span>
      <span className="cyber-btn__glitch" aria-hidden />
    </button>
  );
});
