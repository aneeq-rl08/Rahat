import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LucideIcon from '../components/LucideIcon';
import BirthdayCelebration from '../components/BirthdayCelebration';
import '../styles/Home.css';

const BirthdaySurprise = () => {
  const navigate = useNavigate();
  const today = new Date();
  const isBirthday = today.getDate() === 18 && today.getMonth() === 0;

  if (!isBirthday) {
    return (
      <div className="home-container">
        <motion.button
          className="back-button"
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LucideIcon name="ArrowLeft" size={18} /> Back to Home
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="neutral-screen"
        >
          <h1 className="home-title">Peaceful Days</h1>
          <p className="birthday-message">Wishing you joy and blessings every day. The birthday surprise activates on January 18th!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <motion.button
        className="back-button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LucideIcon name="ArrowLeft" size={18} /> Back to Home
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BirthdayCelebration />
      </motion.div>
    </div>
  );
};

export default BirthdaySurprise;
