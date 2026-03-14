import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberSelect } from './CyberSelect';

describe('CyberSelect', () => {
  it('renders a select with options', () => {
    render(
      <CyberSelect aria-label="Test select">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </CyberSelect>
    );
    const select = screen.getByLabelText('Test select');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('applies cyber-select class', () => {
    render(
      <CyberSelect aria-label="Test select">
        <option value="a">Alpha</option>
      </CyberSelect>
    );
    expect(screen.getByLabelText('Test select')).toHaveClass('cyber-select');
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CyberSelect aria-label="Test select" onChange={onChange}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </CyberSelect>
    );
    await user.selectOptions(screen.getByLabelText('Test select'), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('reflects current value', () => {
    render(
      <CyberSelect aria-label="Test select" value="b" onChange={() => {}}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </CyberSelect>
    );
    expect(screen.getByLabelText('Test select')).toHaveValue('b');
  });

  it('appends additional className', () => {
    render(
      <CyberSelect aria-label="Test select" className="extra">
        <option value="a">Alpha</option>
      </CyberSelect>
    );
    expect(screen.getByLabelText('Test select')).toHaveClass('cyber-select', 'extra');
  });
});
