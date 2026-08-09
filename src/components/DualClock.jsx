import { useState, useEffect } from 'react';
import './DualClock.css';

const GRADIENTS = {
  morning:   'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  afternoon: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  evening:   'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  night:     'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
};

export default function DualClock() {
  const [time, setTime] = useState({ pk: { time: '', seconds: '', suffix: '' }, it: { time: '', seconds: '', suffix: '' } });
  const [timeOfDay, setTimeOfDay] = useState('night');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pkTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Karachi', 
        hour: 'numeric', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const itTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'Europe/Rome', 
        hour: 'numeric', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      const formatTime = (timeStr) => {
        const match = timeStr.match(/^(\d+:\d+):(\d+)\s*(AM|PM)$/i);
        if (match) return { time: match[1], seconds: match[2], suffix: match[3] };
        return { time: timeStr, seconds: '', suffix: '' };
      };
      
      setTime({
        pk: formatTime(pkTime),
        it: formatTime(itTime)
      });

      // Time-of-day based on PK hour
      const pkHour = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi', hour: 'numeric', hour12: false });
      const h = parseInt(pkHour);
      if (h >= 5 && h < 12)       setTimeOfDay('morning');
      else if (h >= 12 && h < 18) setTimeOfDay('afternoon');
      else if (h >= 18 && h < 22) setTimeOfDay('evening');
      else                         setTimeOfDay('night');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`dual-clock ${timeOfDay}`} style={{ background: GRADIENTS[timeOfDay] }}>
      <div className="clock it">
        <div className="clock-label">IT</div>
        <div className="time">{time.it.time}</div>
        <div className="time-seconds">:{time.it.seconds}</div>
        <div className="time-suffix">{time.it.suffix}</div>
      </div>
      <div className="divider" />
      <div className="clock pk">
        <div className="clock-label">PK</div>
        <div className="time">{time.pk.time}</div>
        <div className="time-seconds">:{time.pk.seconds}</div>
        <div className="time-suffix">{time.pk.suffix}</div>
      </div>
    </div>
  );
}
