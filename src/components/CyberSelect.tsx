import { memo, type SelectHTMLAttributes, type ReactNode } from 'react';
import './CyberSelect.css';

interface CyberSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const CyberSelect = memo(function CyberSelect({
  className = '',
  children,
  ...props
}: CyberSelectProps) {
  return (
    <select className={`cyber-select ${className}`.trim()} {...props}>
      {children}
    </select>
  );
});
