import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './CitySelectorModal.module.css';
import LucideIcon from '../LucideIcon';

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

const cities = [
  { name: 'Mecca, Saudi Arabia', value: 'Makkah,SA' },
  { name: 'Medina, Saudi Arabia', value: 'Madinah,SA' },
  { name: 'Riyadh, Saudi Arabia', value: 'Riyadh,SA' },
  { name: 'Dubai, UAE', value: 'Dubai,AE' },
  { name: 'Abu Dhabi, UAE', value: 'Abu Dhabi,AE' },
  { name: 'Sharjah, UAE', value: 'Sharjah,AE' },
  { name: 'Kuwait City, Kuwait', value: 'Kuwait,KW' },
  { name: 'Manama, Bahrain', value: 'Manama,BH' },
  { name: 'Doha, Qatar', value: 'Doha,QA' },
  { name: 'Muscat, Oman', value: 'Muscat,OM' },
  { name: 'Cairo, Egypt', value: 'Cairo,EG' },
  { name: 'Alexandria, Egypt', value: 'Alexandria,EG' },
  { name: 'Istanbul, Turkey', value: 'Istanbul,TR' },
  { name: 'Ankara, Turkey', value: 'Ankara,TR' },
  { name: 'Jakarta, Indonesia', value: 'Jakarta,ID' },
  { name: 'Kuala Lumpur, Malaysia', value: 'Kuala Lumpur,MY' },
  { name: 'Singapore', value: 'Singapore,SG' },
  { name: 'Karachi, Pakistan', value: 'Karachi,PK' },
  { name: 'Lahore, Pakistan', value: 'Lahore,PK' },
  { name: 'Islamabad, Pakistan', value: 'Islamabad,PK' },
  { name: 'Dhaka, Bangladesh', value: 'Dhaka,BD' },
  { name: 'Tehran, Iran', value: 'Tehran,IR' },
  { name: 'Baghdad, Iraq', value: 'Baghdad,IQ' },
  { name: 'Amman, Jordan', value: 'Amman,JO' },
  { name: 'Beirut, Lebanon', value: 'Beirut,LB' },
  { name: 'Damascus, Syria', value: 'Damascus,SY' },
  { name: 'Rabat, Morocco', value: 'Rabat,MA' },
  { name: 'Casablanca, Morocco', value: 'Casablanca,MA' },
  { name: 'Algiers, Algeria', value: 'Algiers,DZ' },
  { name: 'Tunis, Tunisia', value: 'Tunis,TN' },
  { name: 'Tripoli, Libya', value: 'Tripoli,LY' },
  { name: 'Khartoum, Sudan', value: 'Khartoum,SD' },
  { name: 'London, UK', value: 'London,GB' },
  { name: 'Manchester, UK', value: 'Manchester,GB' },
  { name: 'Birmingham, UK', value: 'Birmingham,GB' },
  { name: 'Paris, France', value: 'Paris,FR' },
  { name: 'Marseille, France', value: 'Marseille,FR' },
  { name: 'Berlin, Germany', value: 'Berlin,DE' },
  { name: 'Frankfurt, Germany', value: 'Frankfurt,DE' },
  { name: 'Madrid, Spain', value: 'Madrid,ES' },
  { name: 'Barcelona, Spain', value: 'Barcelona,ES' },
  { name: 'Rome, Italy', value: 'Rome,IT' },
  { name: 'Milan, Italy', value: 'Milan,IT' },
  { name: 'Turin, Italy', value: 'Turin,IT' },
  { name: 'Naples, Italy', value: 'Naples,IT' },
  { name: 'Palermo, Italy', value: 'Palermo,IT' },
  { name: 'Genoa, Italy', value: 'Genoa,IT' },
  { name: 'Bologna, Italy', value: 'Bologna,IT' },
  { name: 'Florence, Italy', value: 'Florence,IT' },
  { name: 'Venice, Italy', value: 'Venice,IT' },
  { name: 'Verona, Italy', value: 'Verona,IT' },
  { name: 'Lombardy, Italy', value: 'Milan,IT' },
  { name: 'Lomagna, Italy', value: 'Lomagna,IT' },
  { name: 'New York, USA', value: 'New York,US' },
  { name: 'Washington DC, USA', value: 'Washington DC,US' },
  { name: 'Los Angeles, USA', value: 'Los Angeles,US' },
  { name: 'Chicago, USA', value: 'Chicago,US' },
  { name: 'Houston, USA', value: 'Houston,US' },
  { name: 'Toronto, Canada', value: 'Toronto,CA' },
  { name: 'Montreal, Canada', value: 'Montreal,CA' },
  { name: 'Vancouver, Canada', value: 'Vancouver,CA' },
  { name: 'Sydney, Australia', value: 'Sydney,AU' },
  { name: 'Melbourne, Australia', value: 'Melbourne,AU' },
  { name: 'Perth, Australia', value: 'Perth,AU' }
];

export default function CitySelectorModal({ isOpen, onRequestClose, selectedCity, onCitySelect }) {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const shouldRender = isOpen || isClosing;

  const titleId = useId();

  const filteredCities = useMemo(() => {
    return cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

  const handleCitySelect = (city) => {
    onCitySelect(city);
    onRequestClose();
    setSearchTerm('');
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
            Select Your City
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onRequestClose}
            aria-label="Close city selector"
          >
            <LucideIcon name="X" size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search city or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          <div className={styles.currentCity}>
            <strong>Currently selected:</strong> {selectedCity || 'None selected'}
          </div>

          <div className={styles.cityGrid}>
            {filteredCities.map((city) => (
              <button
                key={city.value}
                type="button"
                className={[
                  styles.cityButton,
                  selectedCity === city.value ? styles.selected : ''
                ].join(' ')}
                onClick={() => handleCitySelect(city.value)}
              >
                <div className={styles.cityName}>{city.name}</div>
                <div className={styles.cityValue}>{city.value}</div>
              </button>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div className={styles.noResults}>
              No cities found matching "{searchTerm}"
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.secondaryButton} onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
