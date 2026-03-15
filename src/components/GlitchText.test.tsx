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
    const el = screen.getByText('Glitch').closest('.glitch') ?? screen.getByText('Glitch').parentElement;
    expect(el).toHaveClass('glitch');
  });

  it('sets data-text attribute for pseudo-element content', () => {
    render(<GlitchText>Glitch</GlitchText>);
    const el = screen.getByText('Glitch').closest('[data-text]') ?? screen.getByText('Glitch').parentElement;
    expect(el).toHaveAttribute('data-text', 'Glitch');
  });

  it('renders with a custom tag', () => {
    render(<GlitchText as="h1">Title</GlitchText>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
  });

  it('accepts additional className', () => {
    render(<GlitchText className="extra">Text</GlitchText>);
    const el = screen.getByText('Text').closest('.glitch') ?? screen.getByText('Text').parentElement;
    expect(el).toHaveClass('glitch');
    expect(el).toHaveClass('extra');
  });

  it('uses aria-label for accessible name', () => {
    render(<GlitchText>Glitch</GlitchText>);
    const el = screen.getByLabelText('Glitch');
    expect(el).toBeInTheDocument();
  });
});
