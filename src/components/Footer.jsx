import { useState } from 'react';
import PrivacyTermsModal from './PrivacyTermsModal';
import LucideIcon from './LucideIcon';
import styles from './Footer.module.css';

export default function Footer({ className }) {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className={[styles.footer, className].filter(Boolean).join(' ')}>
      <div className={styles.left}>
        <span className={styles.brand}>Rahat</span>

        <button
          type="button"
          className={styles.linkButton}
          onClick={() => setIsPrivacyOpen(true)}
        >
          Privacy &amp; Terms
        </button>
        <a className={styles.gitlabLink} href="https://gitlab.com/aneeq_rl08/Rahat" target="_blank" rel="noreferrer">
          GitLab <LucideIcon name="ExternalLink" size={13} />
        </a>

        <div className={styles.copyright}>
          © 2026 Rahat
        </div>
      </div>

      <PrivacyTermsModal
        isOpen={isPrivacyOpen}
        onRequestClose={() => setIsPrivacyOpen(false)}
      />
    </footer>
  );
}
