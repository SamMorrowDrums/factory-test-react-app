import { memo, type InputHTMLAttributes } from 'react';
import './CyberInput.css';

type CyberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const CyberInput = memo(function CyberInput({
  className = '',
  ...props
}: CyberInputProps) {
  return (
    <input
      type="text"
      className={`cyber-input ${className}`.trim()}
      {...props}
    />
  );
});
