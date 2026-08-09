import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LucideIcon from '../components/LucideIcon';
import RamadanEidSection from '../components/RamadanEidSection';
import '../styles/RamadanEid.css';

function RamadanEid() {
  const navigate = useNavigate();

  return (
    <div className="ramadan-eid-page">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="back-button"
        onClick={() => navigate('/')}
      >
        <LucideIcon name="ArrowLeft" size={18} /> Back to Home
      </motion.button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="ramadan-eid-container"
      >
        <RamadanEidSection />
      </motion.div>
    </div>
  );
}

export default RamadanEid;
