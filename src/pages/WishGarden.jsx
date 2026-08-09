import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMessageSync } from '../utils/messageService';
import { incrementWishGardenClick } from '../utils/storage';
import LucideIcon from '../components/LucideIcon';
import '../styles/WishGarden.css';

const flowers = [
  { id: 'white', icon: 'HandHeart', label: 'Dua', color: '#FFFFFF' },
  { id: 'yellow', icon: 'Sun', label: 'Positivity', color: '#FFD700' },
  { id: 'blue', icon: 'Sparkles', label: 'Motivation', color: '#87CEEB' }
];

const flowerVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.2, 
    y: -10,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 10
    }
  },
  tap: { scale: 0.9 }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: -50,
    transition: { duration: 0.3 }
  }
};

function WishGarden() {
  const navigate = useNavigate();
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [blessing, setBlessing] = useState(null);
  const [particles, setParticles] = useState([]);

  const handleFlowerClick = (flowerId) => {
    setSelectedFlower(flowerId);
    incrementWishGardenClick(flowerId);
    
    const wishData = getMessageSync('wish', flowerId);
    if (wishData) {
      setBlessing(wishData);
    }

    // Create floating particles
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.1
    }));
    setParticles(newParticles);

    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 2000);
  };

  const handleCloseCard = () => {
    setSelectedFlower(null);
    setBlessing(null);
  };

  return (
    <div className="wish-garden-container">
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
        className="wish-header"
      >
        <h1>Wish Garden</h1>
        <p>Choose a flower and receive a blessing</p>
      </motion.div>

      <div className="flowers-container">
        {flowers.map((flower) => (
          <motion.button
            type="button"
            key={flower.id}
            variants={flowerVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="flower"
            onClick={() => handleFlowerClick(flower.id)}
            style={{ '--flower-color': flower.color }}
          >
            <div className="flower-icon"><LucideIcon name={flower.icon} size={64} /></div>
            <div className="flower-label">{flower.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            initial={{ 
              opacity: 1, 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              scale: 0
            }}
            animate={{ 
              opacity: [1, 0],
              y: `${particle.y - 20}%`,
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              delay: particle.delay,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Blessing Card */}
      <AnimatePresence>
        {blessing && selectedFlower && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="blessing-card-overlay"
            onClick={handleCloseCard}
          >
            <motion.div
              className="blessing-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="close-button" onClick={handleCloseCard} aria-label="Close blessing">
                <LucideIcon name="X" size={24} />
              </button>
              <div className="blessing-icon">
                <LucideIcon name={flowers.find(f => f.id === selectedFlower)?.icon} size={58} />
              </div>
              <h2 className="blessing-title">{blessing.title}</h2>
              <p className="blessing-text english">{blessing.blessing.english}</p>
              <p className="blessing-text urdu">{blessing.blessing.urdu}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WishGarden;



