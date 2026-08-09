import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './PrivacyTermsModal.module.css';
import LucideIcon from './LucideIcon';

function getFocusableElements(container) {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  return Array.from(container.querySelectorAll(selectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

export default function PrivacyTermsModal({ isOpen, onRequestClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  const shouldRender = isOpen || isClosing;

  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      const focusables = getFocusableElements(dialogRef.current);
      if (focusables[0]) focusables[0].focus();
      else dialogRef.current?.focus();
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onRequestClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements(dialogRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === dialogRef.current) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      const el = lastActiveElementRef.current;
      if (el && typeof el.focus === 'function') el.focus();
    };
  }, [isOpen, onRequestClose]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      return;
    }

    if (!shouldRender) return;

    setIsClosing(true);
    const timer = window.setTimeout(() => setIsClosing(false), 180);
    return () => window.clearTimeout(timer);
  }, [isOpen, shouldRender]);

  const handleBackdropMouseDown = (e) => {
    if (e.target === overlayRef.current) {
      onRequestClose?.();
    }
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={[styles.overlay, isOpen ? styles.overlayOpen : styles.overlayClose].join(' ')}
      onMouseDown={handleBackdropMouseDown}
      aria-hidden={isOpen ? 'false' : 'true'}
    >
      <div
        ref={dialogRef}
        className={[styles.dialog, isOpen ? styles.dialogOpen : styles.dialogClose].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Privacy & Terms
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onRequestClose}
            aria-label="Close Privacy & Terms"
          >
            <LucideIcon name="X" size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.lead}>Welcome to Rahat.</p>

          <p>
            Rahat is designed as a friendly companion to help you feel calm, motivated, and cheerful. All features
            are optional — you can use only what you like.
          </p>

          <h3 className={styles.sectionTitle}>Current Features:</h3>
          <ul>
            <li>Dual Timezone Clocks: Keep track of time across Pakistan and Italy with dynamic time-of-day themes.</li>
            <li>Mood Selector: Choose your mood → get a dua and short motivational line.</li>
            <li>Study Booster: Pomodoro timer + study tips + short motivational ayahs.</li>
            <li>Wish Garden: Clickable flowers with blessings and positivity messages.</li>
            <li>Achievement Badges: Unlock milestones and celebrate consistency.</li>
            <li>Birthday Surprise: Annual, respectful, cheerful greeting with animations.</li>
            <li>Islamic Calendar & Blessings: 3-layer date detection system with official confirmation, astronomical calculations, and API fallbacks for accurate Ramadan and Eid dates worldwide.</li>
            <li>Salat Times: Complete Islamic prayer times system showing only the 5 essential prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) year-round, with Ramadan-specific Sehri/Iftar display and countdown timers.</li>
          </ul>

          <h3 className={styles.sectionTitle}>Future Features (may be added over time):</h3>
          <ul>
            <li>New interactive elements, celebratory mini-features, or other enhancements.</li>
            <li>Additional ways to make using Rahat comfortable and fun.</li>
          </ul>

          <h3 className={styles.sectionTitle}>Privacy &amp; Usage Notes:</h3>
          <p>
            Rahat does not collect personal information beyond anonymous usage for optional admin monitoring (e.g.,
            browser type or user ID for permissions).
          </p>
          <p>Features are designed to be safe, friendly, and respectful.</p>
          <p>You are free to use or skip any feature at any time.</p>
          
          <h4 className={styles.sectionTitle}>Salat Times & Islamic Prayer Privacy:</h4>
          <p>
            <strong>Complete Islamic Prayer System:</strong> We provide accurate Islamic prayer times showing only the 5 essential prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) with Ramadan-specific enhancements for Sehri/Iftar times and countdowns.
          </p>
          <ul>
            <li><strong>5 Essential Prayers Only:</strong> Strict filtering to show only Fajr, Dhuhr, Asr, Maghrib, and Isha - no Sunrise or other non-prayer times.</li>
            <li><strong>Ramadan Enhancement:</strong> During Ramadan, displays Sehri (pre-dawn) and Iftar (sunset) times with countdown timers for fasting periods.</li>
            <li><strong>Year-Round Coverage:</strong> Daily prayer times available for any city worldwide using the AlAdhan API with 3-layer date accuracy.</li>
            <li><strong>No Geolocation Required:</strong> Prayer times fetched based on manual city selection only - no automatic location detection.</li>
            <li><strong>Privacy First:</strong> City preference stored locally only; no location data shared beyond API calls.</li>
            <li><strong>Eid Special:</strong> Enhanced prayer times and special scheduling for Eid ul-Fitr and Eid ul-Adha celebrations.</li>
          </ul>
          
          <h3 className={styles.sectionTitle}>Terms:</h3>
          <p>By using Rahat, you agree to use it respectfully and responsibly.</p>
          <p>
            Rahat is intended for friendship, motivation, and daily comfort, not for tracking or sharing personal
            data.
          </p>

          <p>
            We may add new features over time to make Rahat even more cheerful and helpful — always optional and
            respectful of your comfort.
          </p>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.primaryButton} onClick={onRequestClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
