import type { ReactNode } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: ReactNode;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
}

export function GlitchText({ children, as: Tag = 'span', className = '' }: GlitchTextProps) {
  const text = typeof children === 'string' ? children : '';

  return (
    <Tag className={`glitch-text ${className}`.trim()} data-text={text}>
      {children}
    </Tag>
  );
}
