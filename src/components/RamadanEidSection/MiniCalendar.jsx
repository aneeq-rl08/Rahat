import { useState } from 'react';

function MiniCalendar({ ramadanDates, eidDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  // Get moon sighting color based on ramadan dates
  const getMoonSightingColor = () => {
    console.log('🎨 getMoonSightingColor called with ramadanDates:', ramadanDates);
    
    if (!ramadanDates || !ramadanDates.moonSighting) {
      console.log('❌ No moonSighting data, using default red');
      return '#dc2626'; // Default red
    }
    
    // Use moon sighting date to determine country
    const moonDate = new Date(ramadanDates.moonSighting);
    const year = moonDate.getFullYear();
    const month = moonDate.getMonth() + 1;
    const day = moonDate.getDate();
    
    console.log(`🌙 Moon sighting date: ${year}-${month}-${day}`);
    
    // Pakistan - Moon sighting Feb 18
    if (year === 2026 && month === 2 && day === 18) {
      console.log('🇵🇰 Pakistan moon sighting detected - using RED');
      return '#dc2626'; // Red
    }
    // Italy - Moon sighting Feb 17
    if (year === 2026 && month === 2 && day === 17) {
      console.log('🇮🇹 Italy moon sighting detected - using BLUE');
      return '#2563eb'; // Blue
    }
    // Saudi Arabia - Moon sighting Feb 17
    if (year === 2026 && month === 2 && day === 17) {
      console.log('🇸🇦 Saudi moon sighting detected - using GREEN');
      return '#059669'; // Green
    }
    // UAE - Moon sighting Feb 17
    if (year === 2026 && month === 2 && day === 17) {
      console.log('🇦🇪 UAE moon sighting detected - using PURPLE');
      return '#7c3aed'; // Purple
    }
    // India - Moon sighting Feb 17
    if (year === 2026 && month === 2 && day === 17) {
      console.log('🇮🇳 India moon sighting detected - using ORANGE');
      return '#f97316'; // Orange
    }
    // UK - Moon sighting Feb 16
    if (year === 2026 && month === 2 && day === 16) {
      console.log('🇬🇧 UK moon sighting detected - using SKY BLUE');
      return '#0891b2'; // Sky blue
    }
    // USA - Moon sighting Feb 16
    if (year === 2026 && month === 2 && day === 16) {
      console.log('🇺🇸 USA moon sighting detected - using RED');
      return '#dc2626'; // Red
    }
    
    console.log('🌍 Default moon sighting color - RED');
    return '#dc2626'; // Default red
  };

  const isMoonSightingDay = (day) => {
    if (!ramadanDates || !ramadanDates.moonSighting) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const moonSightingDate = new Date(ramadanDates.moonSighting);
    return checkDate.toDateString() === moonSightingDate.toDateString();
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isRamadanDay = (day) => {
    if (!ramadanDates) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const ramadanStart = new Date(ramadanDates.start);
    const ramadanEnd = new Date(ramadanDates.end);
    
    // Simple date range check - use real ramadanDates
    const isInRange = checkDate >= ramadanStart && checkDate <= ramadanEnd;
    
    console.log(`🕌 Ramadan check for ${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}/${day}:`, {
      checkDate: checkDate.toDateString(),
      ramadanStart: ramadanStart.toDateString(),
      ramadanEnd: ramadanEnd.toDateString(),
      isInRange: isInRange,
      ramadanDates: ramadanDates
    });
    
    return isInRange;
  };

  const getRamadanDayNumber = (day) => {
    if (!isRamadanDay(day)) return null;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const ramadanStart = new Date(ramadanDates.start);
    const diffTime = Math.abs(checkDate - ramadanStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const isEidDay = (day) => {
    if (!eidDate) {
      console.log('❌ No eidDate provided');
      return false;
    }
    
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Handle different eidDate formats
    let eid;
    if (eidDate.gregorian) {
      eid = new Date(eidDate.gregorian);
    } else if (eidDate.date) {
      eid = new Date(eidDate.date);
    } else {
      eid = new Date(eidDate);
    }
    
    // Simple date range check - use real eidDate
    const eidStart = new Date(eid);
    const eidEnd = new Date(eid);
    eidEnd.setDate(eidEnd.getDate() + 3); // Add 3 days for 4-day celebration
    
    const isEid = checkDate >= eidStart && checkDate <= eidEnd;
    
    console.log(`🎯 Eid check for ${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}/${day}:`, {
      checkDate: checkDate.toDateString(),
      eidStart: eidStart.toDateString(),
      eidEnd: eidEnd.toDateString(),
      isEid: isEid,
      eidDate: eidDate
    });
    
    return isEid;
  };

  const getEidDayNumber = (day) => {
    if (!isEidDay(day)) return null;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Handle different eidDate formats
    let eid;
    if (eidDate.gregorian) {
      eid = new Date(eidDate.gregorian);
    } else if (eidDate.date) {
      eid = new Date(eidDate.date);
    } else {
      eid = new Date(eidDate);
    }
    
    const diffTime = Math.abs(checkDate - eid);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const isToday = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate.toDateString() === today.toDateString();
  };

  const calculateRamadanDuration = () => {
    if (!ramadanDates) return 30;
    const start = new Date(ramadanDates.start);
    const end = new Date(ramadanDates.end);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{ 
          width: '30px', 
          height: '30px',
          fontSize: '0.75rem'
        }}></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isRamadan = isRamadanDay(day);
      const isEid = isEidDay(day);
      const isCurrentDay = isToday(day);
      const isMoonSighting = isMoonSightingDay(day);
      const ramadanDayNumber = getRamadanDayNumber(day);
      const eidDayNumber = getEidDayNumber(day);

      // Debug: Log Eid days in March
      if (currentMonth.getMonth() === 2 && isEid) {
        console.log(`🎯 EID DAY FOUND: March ${day}`);
      }

      // Debug: Log Moon Sighting days
      if (isMoonSighting) {
        console.log(`🌙 MOON SIGHTING DAY FOUND: ${currentMonth.getMonth() + 1}/${day}`);
      }

      days.push(
        <div
          key={day}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontSize: '0.75rem',
            fontWeight: isCurrentDay ? '700' : isEid ? '700' : isMoonSighting ? '700' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            // Priority: Moon Sighting > Eid > Ramadan > Today > Normal
            backgroundColor: isMoonSighting ? getMoonSightingColor() :
                           isEid ? '#FFD700' : 
                           isRamadan ? '#A3C9A8' : 
                           isCurrentDay ? '#2F5D62' : 'white',
            background: isMoonSighting ? getMoonSightingColor() :
                       isEid ? 'radial-gradient(circle, #FFD700, #FFA500)' : 
                       isRamadan ? '#A3C9A8' : 
                       isCurrentDay ? '#2F5D62' : 'white',
            color: isMoonSighting ? 'white' :
                   isEid ? '#1C1C1C' : 
                   isRamadan || isCurrentDay ? 'white' : '#1C1C1C',
            border: isMoonSighting ? `2px solid ${getMoonSightingColor()}` :
                   isEid ? '1px solid #FFD700' : 
                   isRamadan ? '2px solid #A3C9A8' : 
                   isCurrentDay ? '2px solid #2F5D62' : '1px solid #e0e0e0',
            boxShadow: isMoonSighting ? `0 0 12px ${getMoonSightingColor()}40, 0 0 20px ${getMoonSightingColor()}20` :
                       isEid ? '0 0 15px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.3)' : 
                       isRamadan ? '0 2px 4px rgba(163, 202, 168, 0.3)' : 'none',
            transform: isMoonSighting ? 'scale(1.15)' : isEid ? 'scale(1.1)' : 'scale(1)',
            zIndex: isMoonSighting ? 9999 : isEid ? 9999 : 1,
            overflow: 'hidden',
            // Force visibility
            opacity: 1,
            visibility: 'visible'
          }}
          title={
            isMoonSighting ? '🌙 Moon Sighting Day' :
            isEid && eidDayNumber === 1 ? 'Eid ul-Fitr (Day 1)' : 
            isEid && eidDayNumber === 2 ? 'Eid Celebration (Day 2)' : 
            isEid && eidDayNumber === 3 ? 'Eid Celebration (Day 3)' : 
            isEid && eidDayNumber === 4 ? 'Eid Celebration (Day 4)' : 
            isEid ? 'Eid Celebration' : 
            isRamadan && ramadanDayNumber ? `Ramadan Day ${ramadanDayNumber}` : 
            isRamadan ? 'Ramadan' : 
            isCurrentDay ? 'Today' : ''
          }
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    // Fix: Use setMonth with proper date handling to avoid skipping months
    const currentDay = newMonth.getDate();
    newMonth.setDate(1); // Set to 1st to avoid month-end issues
    newMonth.setMonth(currentMonth.getMonth() + direction);
    // Restore the day if possible (or keep 1st if it doesn't exist)
    newMonth.setDate(Math.min(currentDay, getDaysInMonth(newMonth)));
    setCurrentMonth(newMonth);
  };

  return (
    <div className="mini-calendar" style={{
      background: 'white',
      padding: '1rem',
      borderRadius: '12px',
      border: '1px solid #A3C9A8',
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto',
      boxSizing: 'border-box',
      maxHeight: '500px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2F5D62',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '4px',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#f0f8f0'}
          onMouseOut={(e) => e.target.style.background = 'none'}
        >
          ‹
        </button>
        
        <h4 style={{ 
          margin: 0, 
          color: '#2F5D62', 
          fontSize: '1rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        
        <button
          onClick={() => navigateMonth(1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2F5D62',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '4px',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#f0f8f0'}
          onMouseOut={(e) => e.target.style.background = 'none'}
        >
          ›
        </button>
      </div>

      {/* Day names */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        marginBottom: '0.3rem'
      }}>
        {dayNames.map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '0.7rem',
              color: '#666',
              fontWeight: '600',
              padding: '0.25rem 0'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        justifyContent: 'center',
        marginBottom: '0.5rem'
      }}>
        {renderCalendarDays()}
      </div>

      {/* Ramadan Duration Line */}
      {ramadanDates && (
        <div style={{
          padding: '0.5rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '0.5rem',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.85rem', 
            color: '#2F5D62', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1rem' }}>🌙</span>
            Ramadan Duration: {calculateRamadanDuration()} days
            <span style={{ fontSize: '1rem' }}>🌙</span>
          </p>
          {ramadanDates.start && ramadanDates.end && (
            <p style={{ 
              margin: '0.25rem 0 0 0', 
              fontSize: '0.75rem', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              {new Date(ramadanDates.start).toLocaleDateString()} - {new Date(ramadanDates.end).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{
        padding: '0.5rem',
        background: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#A3C9A8',
            marginRight: '0.5rem',
            flexShrink: 0
          }}></div>
          <span>Ramadan</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#FFD700',
            marginRight: '0.5rem',
            flexShrink: 0
          }}></div>
          <span>Eid</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid #2F5D62',
            background: 'transparent',
            marginRight: '0.5rem',
            flexShrink: 0
          }}></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

export default MiniCalendar;
