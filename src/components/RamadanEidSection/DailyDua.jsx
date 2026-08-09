import { useEffect, useState } from 'react';

const dailyDuas = ['May Allah bless your day with peace and guidance.', 'May your prayers be accepted and your heart be content.', "May today bring you closer to Allah's mercy.", 'May Allah grant you wisdom and strength in all matters.', 'May your day be filled with barakah and blessings.', 'May Allah grant you clarity in thought and purpose.'];
const ramadanDuas = ['May Allah accept your fasting and prayers this Ramadan.', 'May your good deeds be multiplied during this blessed month.', 'May your worship in Ramadan bring you closer to Allah.', 'May this Ramadan be a source of healing and transformation.'];
const eidDuas = ['Eid Mubarak. May this day bring you joy and blessings.', 'May Allah accept your worship and grant you happiness.', 'Wishing you peace, prosperity, and spiritual fulfilment.', 'May this Eid mark new beginnings and fresh starts.'];

export default function DailyDua({ isRamadan, isEid }) {
  const [dailyDua, setDailyDua] = useState('');
  useEffect(() => {
    const updateDua = () => {
      const date = new Date();
      const options = isEid ? eidDuas : isRamadan ? ramadanDuas : dailyDuas;
      setDailyDua(options[(date.getDate() + Math.floor(date.getHours() / 2)) % options.length]);
    };
    updateDua();
    window.addEventListener('focus', updateDua);
    return () => window.removeEventListener('focus', updateDua);
  }, [isRamadan, isEid]);
  return <div className="daily-dua" style={{ background: '#F5F5DC', padding: 'clamp(.75rem, 2vw, 1.25rem)', borderRadius: '8px', textAlign: 'center', border: '2px solid #A3C9A8', margin: '0 auto', maxWidth: '100%', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ margin: 0, fontSize: 'clamp(.9rem, 2.5vw, 1.1rem)', lineHeight: '1.4', color: '#2F5D62', fontWeight: '500' }}>{dailyDua || 'Loading blessing...'}</p></div>;
}
