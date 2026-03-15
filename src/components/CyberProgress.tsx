import { memo } from 'react';
import './CyberProgress.css';

interface CyberProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export const CyberProgress = memo(function CyberProgress({
  value,
  max = 100,
  label,
  showPercent = true,
}: CyberProgressProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="cyber-progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="cyber-progress__track">
        <div
          className="cyber-progress__fill"
          style={{ width: `${clampedPercent}%` }}
        />
        <div className="cyber-progress__scanline" />
      </div>
      {showPercent && (
        <span className={`cyber-progress__label ${clampedPercent === 100 ? 'cyber-progress__label--complete' : ''}`}>
          {clampedPercent}%
        </span>
      )}
    </div>
  );
});
