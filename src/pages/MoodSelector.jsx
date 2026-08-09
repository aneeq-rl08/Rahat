import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMessageSync } from '../utils/messageService';
import { getSelectedMood, setSelectedMood } from '../utils/storage';
import LucideIcon from '../components/LucideIcon';
import '../styles/MoodSelector.css';

const moods = [
  { id: 'happy', label: 'Happy', icon: 'Smile', color: '#FFD700' },
  { id: 'tired', label: 'Tired', icon: 'BedDouble', color: '#87CEEB' },
  { id: 'stressed', label: 'Stressed', icon: 'Brain', color: '#FF6B6B' },
  { id: 'busy', label: 'Busy', icon: 'CalendarDays', color: '#FFA500' }
];

const buttonVariants = {
  rest: { scale: 1, rotateY: 0 },
  hover: { 
    scale: 1.1, 
    rotateY: 5,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

function MoodSelector() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMoodState] = useState(() => getSelectedMood());
  const [content, setContent] = useState(() => {
    const savedMood = getSelectedMood();
    return savedMood ? getMessageSync('mood', savedMood) : null;
  });

  const handleMoodClick = (moodId) => {
    setSelectedMoodState(moodId);
    setSelectedMood(moodId);
    
    const moodData = getMessageSync('mood', moodId);
    if (moodData) {
      setContent(moodData);
    }
  };

  return (
    <div className="mood-selector-container">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="back-button"
        onClick={() => navigate('/')}
      >
        <LucideIcon name="ArrowLeft" size={18} /> Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mood-header"
      >
        <h1>Mood Selector</h1>
        <p>Select your mood and receive a dua and supportive message</p>
      </motion.div>

      <div className="mood-buttons">
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className={`mood-button ${selectedMood === mood.id ? 'selected' : ''}`}
            onClick={() => handleMoodClick(mood.id)}
            style={{ '--mood-color': mood.color }}
          >
            <span className="mood-icon"><LucideIcon name={mood.icon} size={42} /></span>
            <span className="mood-label">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {content && (
          <motion.div
            key={selectedMood}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mood-content"
          >
            <div className="content-card">
              <h3>Dua (Supplication)</h3>
              <p className="dua-text arabic">{content.dua.arabic}</p>
              <p className="dua-translation english">{content.dua.english}</p>
              <p className="dua-translation urdu">{content.dua.urdu}</p>
            </div>
            <div className="content-card">
              <h3>Supportive Message</h3>
              <p className="message-text english">{content.message.english}</p>
              <p className="message-text urdu">{content.message.urdu}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MoodSelector;



