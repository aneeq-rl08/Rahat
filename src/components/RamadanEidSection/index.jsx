import { useEffect, useState } from 'react';
import DailyDua from './DailyDua';
import CitySelector from './CitySelector';
import RamadanEidDates from './RamadanEidDates';
import DailyTimings from './DailyTimings';
import MiniCalendar from './MiniCalendar';

export default function RamadanEidSection() {
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('selectedCity') || 'Makkah,SA');
  const [ramadanDates, setRamadanDates] = useState(null);
  const [eidDate, setEidDate] = useState(null);
  const [isRamadan, setIsRamadan] = useState(false);
  const [isEid, setIsEid] = useState(false);

  useEffect(() => {
    // Save city to localStorage when it changes
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  const handleDatesUpdate = ({ ramadanDates, eidDate }) => {
    setRamadanDates(ramadanDates);
    setEidDate(eidDate);
    
    // Check if today is Ramadan or Eid
    const today = new Date();
    if (ramadanDates) {
      const start = new Date(ramadanDates.start);
      const end = new Date(ramadanDates.end);
      setIsRamadan(today >= start && today <= end);
    }
    
    if (eidDate) {
      const eid = new Date(eidDate.gregorian);
      setIsEid(today.toDateString() === eid.toDateString());
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: 'clamp(1rem, 3vw, 2rem)',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        padding: '0 clamp(0.5rem, 2vw, 1rem)'
      }}>
        <div style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '0.5rem',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #2F5D62, #A3C9A8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🌙
        </div>
        <h2 style={{
          margin: 0,
          fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
          fontWeight: '600',
          color: '#2F5D62'
        }}>
          Islamic Calendar & Blessings
        </h2>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          color: '#666'
        }}>
          Daily blessings, prayer times, and important dates
        </p>
      </div>

      {/* City Selector */}
      <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <CitySelector 
          selectedCity={selectedCity} 
          onCitySelect={setSelectedCity}
        />
      </div>

      {/* Always show content even if data is loading */}
      {!selectedCity && (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#6c757d'
        }}>
          <p>Loading city information...</p>
        </div>
      )}

      {selectedCity && (
        <>
          {/* Daily Dua */}
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <DailyDua 
              isRamadan={isRamadan} 
              isEid={isEid} 
            />
          </div>

          {/* Ramadan/Eid Dates */}
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <RamadanEidDates 
              selectedCity={selectedCity}
              onDatesUpdate={handleDatesUpdate}
            />
          </div>

          {/* Daily Timings */}
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <DailyTimings 
              selectedCity={selectedCity}
              isRamadan={isRamadan}
              isEid={isEid}
            />
          </div>

          {/* Mini Calendar */}
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <MiniCalendar 
              ramadanDates={ramadanDates}
              eidDate={eidDate}
              isRamadan={isRamadan}
              isEid={isEid}
            />
          </div>
        </>
      )}

      {/* Top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '5px',
        background: 'linear-gradient(90deg, #2F5D62 0%, #A3C9A8 50%, #2F5D62 100%)'
      }}></div>
    </div>
  );
}
