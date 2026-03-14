import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlitchText } from './GlitchText';

describe('GlitchText', () => {
  it('renders children text', () => {
    render(<GlitchText>Hello</GlitchText>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies the glitch class', () => {
    render(<GlitchText>Glitch</GlitchText>);
    expect(screen.getByText('Glitch')).toHaveClass('glitch');
  });

  it('sets data-text attribute for pseudo-element content', () => {
    render(<GlitchText>Glitch</GlitchText>);
    expect(screen.getByText('Glitch')).toHaveAttribute('data-text', 'Glitch');
  });

  it('renders with a custom tag', () => {
    render(<GlitchText as="h1">Title</GlitchText>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
  });

  it('accepts additional className', () => {
    render(<GlitchText className="extra">Text</GlitchText>);
    const el = screen.getByText('Text');
    expect(el).toHaveClass('glitch');
    expect(el).toHaveClass('extra');
  });
});
