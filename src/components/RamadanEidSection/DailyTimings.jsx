import { useState, useEffect } from 'react';

function DailyTimings({ selectedCity, isRamadan, isEid }) {
  const [timings, setTimings] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCity) {
      fetchTimings();
      checkCountdownPreference();
    }
  }, [selectedCity]);

  useEffect(() => {
    let interval;
    if (showCountdown && timings) {
      interval = setInterval(() => {
        updateCountdown();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCountdown, timings]);

  const checkCountdownPreference = () => {
    const today = new Date().toDateString();
    const savedPreference = localStorage.getItem(`countdown_${today}`);
    setShowCountdown(savedPreference === 'true');
  };

  const toggleCountdown = () => {
    const today = new Date().toDateString();
    const newValue = !showCountdown;
    setShowCountdown(newValue);
    localStorage.setItem(`countdown_${today}`, newValue.toString());
  };

  const fetchTimings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const date = today.toISOString().split('T')[0];
      
      // Method 1: Try to get prayer times by city using AlAdhan API
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${date}?city=${selectedCity.split(',')[0]}&country=${selectedCity.split(',')[1]}&method=2`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTimings(data.data.timings);
      } else {
        throw new Error('Failed to fetch prayer times');
      }
      
    } catch (err) {
      console.error('Error fetching timings:', err);
      setError('Unable to fetch prayer times');
      setEstimatedTimings();
    } finally {
      setLoading(false);
    }
  };

  const setEstimatedTimings = () => {
    // Set estimated timings for demonstration
    const now = new Date();
    const estimatedSehri = new Date(now);
    estimatedSehri.setHours(5, 15, 0); // 5:15 AM
    
    const estimatedIftar = new Date(now);
    estimatedIftar.setHours(18, 30, 0); // 6:30 PM
    
    setTimings({
      Fajr: formatTime(estimatedSehri),
      Maghrib: formatTime(estimatedIftar)
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const updateCountdown = () => {
    if (!timings) return;
    
    const now = new Date();
    const today = new Date();
    
    // Parse Sehri time (Fajr)
    const [sehriHour, sehriMin] = timings.Fajr.split(':').map(Number);
    const sehriTime = new Date(today);
    sehriTime.setHours(sehriHour, sehriMin, 0);
    
    // Parse Iftar time (Maghrib)
    const [iftarHour, iftarMin] = timings.Maghrib.split(':').map(Number);
    const iftarTime = new Date(today);
    iftarTime.setHours(iftarHour, iftarMin, 0);
    
    let targetTime, targetType;
    
    if (now < sehriTime) {
      targetTime = sehriTime;
      targetType = 'Sehri';
    } else if (now < iftarTime) {
      targetTime = iftarTime;
      targetType = 'Iftar';
    } else {
      // After iftar, count down to tomorrow's sehri
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowSehri = new Date(tomorrow);
      tomorrowSehri.setHours(sehriHour, sehriMin, 0);
      targetTime = tomorrowSehri;
      targetType = 'Sehri';
    }
    
    const diff = targetTime - now;
    
    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({
        type: targetType,
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        targetTime: targetTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      });
    } else {
      setCountdown(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <div style={{ color: '#2F5D62', fontSize: '0.9rem' }}>
          Loading prayer times...
        </div>
      </div>
    );
  }

  if (!isRamadan && !isEid) {
    // Show prayer times year-round, not just during Ramadan/Eid
    return (
      <div className="daily-timings">
        {timings && (
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            border: `1px solid #A3C9A8`,
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <h4 style={{ margin: 0, color: '#2F5D62', fontSize: '1rem' }}>
                Daily Prayer Times
              </h4>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              {Object.entries(timings)
                .filter(([prayer]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayer))
                .map(([prayer, time]) => (
                  <div key={prayer} style={{
                    background: '#f8f9fa',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                      {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2F5D62' }}>
                      {time}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="daily-timings">
      {timings && (
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid #A3C9A8`,
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
            <h4 style={{ margin: 0, color: '#2F5D62', fontSize: '1rem' }}>
              Today's Times
            </h4>
            {isRamadan && (
              <button
                onClick={toggleCountdown}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: `1px solid #2F5D62`,
                  borderRadius: '15px',
                  background: showCountdown ? '#2F5D62' : 'white',
                  color: showCountdown ? 'white' : '#2F5D62',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {showCountdown ? 'Hide Timer' : 'Show Timer'}
              </button>
            )}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isRamadan ? '1fr 1fr' : 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0.5rem'
          }}>
            {isRamadan ? (
              // Ramadan: Show only Sehri/Iftar
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                    Sehri (Fajr)
                  </div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#2F5D62' 
                  }}>
                    {timings.Fajr}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                    Iftar (Maghrib)
                  </div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#2F5D62' 
                  }}>
                    {timings.Maghrib}
                  </div>
                </div>
              </>
            ) : (
              // Regular Days: Show only 5 essential prayers (STRICT FILTER)
              <>
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                  <div key={prayer} style={{
                    background: '#f8f9fa',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                      {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2F5D62' }}>
                      {timings[prayer] || '--:--'}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {showCountdown && countdown && (
        <div style={{
          background: '#2F5D62',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Time until {countdown.type}
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            fontFamily: 'monospace'
          }}>
            {countdown.time}
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>
            {countdown.targetTime}
          </div>
        </div>
      )}

      {!showCountdown && isRamadan && (
        <div style={{
          background: '#f8f9fa',
          padding: '0.75rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: `1px solid #e9ecef`
        }}>
          <button
            onClick={toggleCountdown}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid #2F5D62`,
              borderRadius: '20px',
              background: 'white',
              color: '#2F5D62',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#2F5D62';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#2F5D62';
            }}
          >
            Enable Countdown Timer
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          marginTop: '0.5rem'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default DailyTimings;
