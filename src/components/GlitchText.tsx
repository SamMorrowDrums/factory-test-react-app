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
    <Tag className={`glitch ${className}`.trim()} data-text={text} aria-label={text}>
      <span aria-hidden="true">{children}</span>
      {/* Visible text is hidden from AT; aria-label on parent provides accessible name */}
    </Tag>
  );
});
