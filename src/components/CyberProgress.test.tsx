import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CyberProgress } from './CyberProgress';

describe('CyberProgress', () => {
  it('renders with progressbar role', () => {
    render(<CyberProgress value={50} label="Progress" />);
    expect(screen.getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
  });

  it('displays percentage by default', () => {
    render(<CyberProgress value={3} max={10} />);
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('hides percentage when showPercent is false', () => {
    render(<CyberProgress value={3} max={10} showPercent={false} />);
    expect(screen.queryByText('30%')).toBeNull();
  });

  it('sets correct aria attributes', () => {
    render(<CyberProgress value={5} max={20} label="Completion" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '20');
  });

  it('shows 0% when max is 0', () => {
    render(<CyberProgress value={0} max={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps to 100%', () => {
    render(<CyberProgress value={150} max={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies complete class at 100%', () => {
    const { container } = render(<CyberProgress value={10} max={10} />);
    expect(container.querySelector('.cyber-progress__label')).toHaveClass(
      'cyber-progress__label--complete',
    );
  });

  it('does not apply complete class when below 100%', () => {
    const { container } = render(<CyberProgress value={5} max={10} />);
    expect(container.querySelector('.cyber-progress__label')).not.toHaveClass(
      'cyber-progress__label--complete',
    );
  });

  it('defaults max to 100', () => {
    render(<CyberProgress value={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
