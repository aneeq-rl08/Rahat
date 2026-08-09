import { useState, useEffect } from 'react';
import { getIslamicDates, getConfidenceLevel, isDateConfirmed, getDateDisplayText } from './IslamicDatesCascade.js';

function RamadanEidDates({ selectedCity, onDatesUpdate }) {
  const [ramadanDates, setRamadanDates] = useState(null);
  const [eidDate, setEidDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    if (selectedCity) {
      fetchRamadanDates();
    }
  }, [selectedCity]);

  const fetchRamadanDates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🌙 Fetching Islamic dates for ${selectedCity} using 3-layer cascade...`);
      
      // Use the new cascade system
      const dates = await getIslamicDates(selectedCity, currentYear);
      
      console.log('📅 Cascade result:', dates);
      
      // Update state with cascade results
      setRamadanDates(dates.ramadan);
      setEidDate(dates.eidUlFitr);
      setDataSource(dates.source);
      setConfidence(dates.confidence);
      setLastUpdated(dates.lastUpdated);
      
      // Notify parent component
      onDatesUpdate({
        ramadanDates: dates.ramadan,
        eidDate: dates.eidUlFitr
      });
      
    } catch (err) {
      console.error('Error fetching Islamic dates:', err);
      setError('Unable to fetch Islamic dates');
      
      // Fallback to estimated dates
      const fallbackDates = calculateEstimatedRamadanDates(currentYear, selectedCity);
      setRamadanDates(fallbackDates);
      setEidDate({ gregorian: new Date(fallbackDates.end.getTime() + 24 * 60 * 60 * 1000) });
      setDataSource('fallback');
      setConfidence('low');
      
      onDatesUpdate({
        ramadanDates: fallbackDates,
        eidDate: { gregorian: new Date(fallbackDates.end.getTime() + 24 * 60 * 60 * 1000) }
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedRamadanDates = (year, cityKey = '') => {
    // Location-based first Roza dates
    // Pakistan: Moon sighting Feb 18, First Roza Feb 19
    // Italy/Europe: Moon sighting Feb 17, First Roza Feb 18
    const isPakistanCity = cityKey && (
      cityKey.toLowerCase().includes('pakistan') || 
      cityKey.toLowerCase().includes('karachi') || 
      cityKey.toLowerCase().includes('lahore') || 
      cityKey.toLowerCase().includes('islamabad') ||
      cityKey.toLowerCase().includes('peshawar') ||
      cityKey.toLowerCase().includes('quetta')
    );
    let moonSighting, firstRoza;
    
    // Pakistan - Moon sighting Feb 18, First Roza Feb 19
    if (selectedCity && selectedCity.toLowerCase().includes('pakistan')) {
      moonSighting = new Date(year, 1, 18); // Feb 18
      firstRoza = new Date(year, 1, 19); // Feb 19
    }
    // Italy - Moon sighting Feb 17, First Roza Feb 18
    else if (selectedCity && selectedCity.toLowerCase().includes('italy')) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // Saudi Arabia - Moon sighting Feb 17, First Roza Feb 18
    else if (selectedCity && (selectedCity.toLowerCase().includes('saudi') || selectedCity.toLowerCase().includes('riyadh'))) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // UAE - Moon sighting Feb 17, First Roza Feb 18
    else if (selectedCity && (selectedCity.toLowerCase().includes('uae') || selectedCity.toLowerCase().includes('dubai') || selectedCity.toLowerCase().includes('abu dhabi'))) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // India - Moon sighting Feb 17, First Roza Feb 18
    else if (selectedCity && (selectedCity.toLowerCase().includes('india') || selectedCity.toLowerCase().includes('delhi') || selectedCity.toLowerCase().includes('mumbai'))) {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    // UK - Moon sighting Feb 16, First Roza Feb 17
    else if (selectedCity && (selectedCity.toLowerCase().includes('uk') || selectedCity.toLowerCase().includes('london'))) {
      moonSighting = new Date(year, 1, 16); // Feb 16
      firstRoza = new Date(year, 1, 17); // Feb 17
    }
    // USA - Moon sighting Feb 16, First Roza Feb 17
    else if (selectedCity && (selectedCity.toLowerCase().includes('usa') || selectedCity.toLowerCase().includes('new york') || selectedCity.toLowerCase().includes('washington'))) {
      moonSighting = new Date(year, 1, 16); // Feb 16
      firstRoza = new Date(year, 1, 17); // Feb 17
    }
    // Default - Moon sighting Feb 17, First Roza Feb 18
    else {
      moonSighting = new Date(year, 1, 17); // Feb 17
      firstRoza = new Date(year, 1, 18); // Feb 18
    }
    
    const ramadanEnd = new Date(firstRoza);
    ramadanEnd.setDate(ramadanEnd.getDate() + 29); // 29 days of fasting
    
    return {
      start: firstRoza,
      end: ramadanEnd,
      moonSighting: moonSighting,
      source: 'estimated'
    };
  };

  const getStatusDisplay = () => {
    if (!dataSource) return null;
    
    const statusInfo = {
      'official': { label: 'Official', color: '#22c55e', icon: '✅' },
      'astronomical': { label: 'Astronomical', color: '#3b82f6', icon: '🔭' },
      'api': { label: 'API', color: '#f59e0b', icon: '🌐' },
      'fallback': { label: 'Estimate', color: '#ef4444', icon: '⚠️' }
    };
    
    const info = statusInfo[dataSource] || statusInfo['fallback'];
    const confidenceLevel = getConfidenceLevel(confidence);
    
    return {
      ...info,
      confidence: confidenceLevel
    };
  };

  const formatRamadanDate = (date) => {
    if (!date) return 'Date not available';
    const options = { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatEidDate = (date) => {
    if (!date) return 'Date not available';
    if (date.possibleDates) {
      return `Possible: ${date.possibleDates.map(d => formatRamadanDate(d)).join(' or ')}`;
    }
    return formatRamadanDate(date.date);
  };

  // Get moon sighting color based on selected city
  const getMoonSightingColor = () => {
    if (!selectedCity) return '#059669'; // Default green
    
    const city = selectedCity.toLowerCase();
    
    // Pakistan - Special color for moon sighting
    if (city.includes('pakistan')) return '#dc2626'; // Red for Pakistan moon sighting
    // Italy - Special color for moon sighting
    if (city.includes('italy')) return '#2563eb'; // Blue for Italy moon sighting
    // Saudi Arabia - Special color for moon sighting
    if (city.includes('saudi') || city.includes('riyadh')) return '#059669'; // Green for Saudi
    // UAE - Special color for moon sighting
    if (city.includes('uae') || city.includes('dubai') || city.includes('abu dhabi')) return '#7c3aed'; // Purple for UAE
    // India - Special color for moon sighting
    if (city.includes('india') || city.includes('delhi') || city.includes('mumbai')) return '#f97316'; // Orange for India
    // UK - Special color for moon sighting
    if (city.includes('uk') || city.includes('london')) return '#0891b2'; // Sky blue for UK
    // USA - Special color for moon sighting
    if (city.includes('usa') || city.includes('new york') || city.includes('washington')) return '#dc2626'; // Red for USA
    
    return '#059669'; // Default green
  };

  if (loading) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.2rem', color: '#2F5D62', marginBottom: '0.5rem' }}>
          🌙
        </div>
        <p style={{ margin: 0, color: '#666' }}>
          Loading Islamic calendar dates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.2rem', color: '#ef4444', marginBottom: '0.5rem' }}>
          ⚠️
        </div>
        <p style={{ margin: 0, color: '#666' }}>
          {error}
        </p>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      {/* Status Badge - Mobile Responsive */}
      {statusDisplay && (
        <div style={{
          position: window.innerWidth <= 768 ? 'relative' : 'absolute',
          top: window.innerWidth <= 768 ? '0' : '1rem',
          right: window.innerWidth <= 768 ? '0' : '1rem',
          background: statusDisplay.color,
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          zIndex: 10,
          marginBottom: window.innerWidth <= 768 ? '1rem' : '0',
          alignSelf: window.innerWidth <= 768 ? 'flex-start' : 'auto'
        }}>
          <span>{statusDisplay.icon}</span>
          <span>{statusDisplay.label}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2F5D62'
        }}>
          Islamic Calendar {currentYear}
        </h3>
        {statusDisplay && (
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.85rem',
            color: statusDisplay.color
          }}>
            Confidence: {statusDisplay.confidence.label} ({statusDisplay.confidence.percentage}%)
          </p>
        )}
      </div>

      {/* Ramadan Dates */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h4 style={{
          margin: '0 0 0.75rem 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#2F5D62',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🌙 Ramadan 1447 AH
        </h4>
        {ramadanDates ? (
          <div>
            {ramadanDates.moonSighting && (
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: getMoonSightingColor() }}>
                <strong>🌙 Moon Sighting:</strong> {formatRamadanDate(ramadanDates.moonSighting)}
              </p>
            )}
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#333' }}>
              <strong>🌅 First Roza:</strong> {formatRamadanDate(ramadanDates.start)}
            </p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#333' }}>
              <strong>🌙 Last Roza:</strong> {formatRamadanDate(ramadanDates.end)}
            </p>
            <p style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
              <strong>Duration:</strong> {Math.round((ramadanDates.end - ramadanDates.start) / (1000 * 60 * 60 * 24)) + 1} days
            </p>
            {ramadanDates.official && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#22c55e' }}>
                ✅ Officially confirmed
              </p>
            )}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
            Ramadan dates not available
          </p>
        )}
      </div>

      {/* Eid ul-Fitr */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h4 style={{
          margin: '0 0 0.75rem 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#2F5D62',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎉 Eid ul-Fitr (1 Shawwal)
        </h4>
        {eidDate ? (
          <div>
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#333' }}>
              <strong>🎉 Eid Celebration:</strong> {formatEidDate(eidDate)}
            </p>
            <p style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
              <strong>Islamic Date:</strong> 1 Shawwal 1447 AH
            </p>
            {eidDate.official && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#22c55e' }}>
                ✅ Officially confirmed
              </p>
            )}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
            Eid date not available
          </p>
        )}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#999',
          marginTop: '1rem'
        }}>
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default RamadanEidDates;
