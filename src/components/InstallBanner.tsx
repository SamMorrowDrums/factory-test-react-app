import { memo } from 'react';
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
        <button className="install-banner__install" onClick={onInstall}>
          JACK_IN
        </button>
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
