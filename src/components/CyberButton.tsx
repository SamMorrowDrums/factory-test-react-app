import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';
import './CyberButton.css';

type CyberButtonVariant = 'primary' | 'ghost' | 'danger';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CyberButtonVariant;
  active?: boolean;
  size?: 'default' | 'sm';
  children: ReactNode;
}

export const CyberButton = memo(function CyberButton({
  variant = 'ghost',
  active = false,
  size = 'default',
  className = '',
  children,
  ...props
}: CyberButtonProps) {
  const classes = [
    'cyber-btn',
    `cyber-btn--${variant}`,
    active ? 'cyber-btn--active' : '',
    size === 'sm' ? 'cyber-btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
});
