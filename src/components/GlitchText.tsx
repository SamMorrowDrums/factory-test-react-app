import { memo } from 'react';
import type { ReactNode } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: ReactNode;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
}

export const GlitchText = memo(function GlitchText({ children, as: Tag = 'span', className = '' }: GlitchTextProps) {
  const text = typeof children === 'string' ? children : '';

  return (
    <Tag className={`glitch ${className}`.trim()} data-text={text}>
      {children}
    </Tag>
  );
});
