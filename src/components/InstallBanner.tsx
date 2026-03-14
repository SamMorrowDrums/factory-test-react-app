import { memo } from 'react';
import { CyberButton } from './CyberButton';
import './InstallBanner.css';

interface InstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const InstallBanner = memo(function InstallBanner({ onInstall, onDismiss }: InstallBannerProps) {
  return (
    <div className="install-banner" role="alert">
      <div className="install-banner__icon">⚡</div>
      <div className="install-banner__content">
        <span className="install-banner__title">INSTALL_GLITCH_DO</span>
        <span className="install-banner__subtitle">Go offline. Go rogue.</span>
      </div>
      <div className="install-banner__actions">
        <CyberButton variant="primary" onClick={onInstall}>
          JACK_IN
        </CyberButton>
        <button
          className="install-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  );
});
