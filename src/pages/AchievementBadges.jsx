import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getUnlockedBadges, unlockBadge, getCustomBadges, addCustomBadge } from '../utils/storage';
import LucideIcon from '../components/LucideIcon';
import '../styles/AchievementBadges.css';

const defaultBadges = [
  { id: 'exam-week', name: 'Completed Exam Week', icon: 'FilePenLine', description: 'Completed a full week of exams' },
  { id: 'consistency', name: 'Consistency Star', icon: 'Star', description: 'Studied for 7 days in a row' },
  { id: 'stress-survivor', name: 'Stress Survivor', icon: 'Dumbbell', description: 'Used mood selector during stress' }
];

const badgeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 }
  }
};

function AchievementBadges() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(() => getUnlockedBadges());
  const [customBadges, setCustomBadges] = useState(() => getCustomBadges());
  const [showCreateBadgeModal, setShowCreateBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: '', icon: 'Award', description: '' });

  const handleUnlock = (badgeId) => {
    if (!unlocked.includes(badgeId)) {
      unlockBadge(badgeId);
      setUnlocked([...unlocked, badgeId]);
    }
  };

  const handleAddCustomBadge = (e) => {
    e.preventDefault();
    if (newBadge.name) {
      const badge = {
        id: `custom-${Date.now()}`,
        ...newBadge
      };
      addCustomBadge(badge);
      setCustomBadges([...customBadges, badge]);
      setNewBadge({ name: '', icon: 'Award', description: '' });
      setShowCreateBadgeModal(false);
    }
  };

  const isUnlocked = (badgeId) => unlocked.includes(badgeId);

  return (
    <div className="badges-container">
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
        className="badges-header"
      >
        <h1>Achievement Badges</h1>
        <p>Track your progress and achievements</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="create-badge-button"
          onClick={() => setShowCreateBadgeModal(true)}
        >
          Create Badge
        </motion.button>
      </motion.div>

      <div className="badges-section">
        <h2>Default Badges</h2>
        <div className="badges-grid">
          {defaultBadges.map((badge) => {
            const unlocked = isUnlocked(badge.id);
            return (
              <motion.button
                type="button"
                key={badge.id}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
                onClick={() => handleUnlock(badge.id)}
              >
                <div className="badge-content">
                  <div className="badge-icon"><LucideIcon name={badge.icon} size={58} /></div>
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                </div>
                {unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="unlock-indicator"
                  >
                    <LucideIcon name="Check" size={15} /> Unlocked
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {customBadges.length > 0 && (
        <div className="badges-section">
          <h2>Custom Badges</h2>
          <div className="badges-grid">
            {customBadges.map((badge) => {
              const unlocked = isUnlocked(badge.id);
              return (
                <motion.button
                  type="button"
                  key={badge.id}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => handleUnlock(badge.id)}
                >
                  <div className="badge-icon"><LucideIcon name={badge.icon || 'Award'} size={58} /></div>
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description || 'Custom badge'}</p>
                  {unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="unlock-indicator"
                    >
                      <LucideIcon name="Check" size={15} /> Unlocked
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Badge Modal */}
      <AnimatePresence>
        {showCreateBadgeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="create-badge-modal"
            role="dialog"
            aria-modal="true"
            onClick={() => setShowCreateBadgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="create-badge-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Create Badge</h2>
              <form className="create-badge-form" onSubmit={handleAddCustomBadge}>
                <label>
                  Badge Name
                  <input
                    type="text"
                    placeholder="e.g. Focus Master"
                    value={newBadge.name}
                    onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Description
                  <textarea
                    placeholder="e.g. Completed 10 study sessions"
                    rows={3}
                    value={newBadge.description}
                    onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                  />
                </label>
                <label>
                  Badge icon
                  <select value={newBadge.icon} onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}>
                    <option value="Award">Award</option><option value="Star">Star</option><option value="Trophy">Trophy</option><option value="BookOpen">Book</option><option value="Target">Target</option><option value="Flame">Flame</option>
                  </select>
                </label>
                <div className="create-badge-form-actions">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="create-badge-form-button submit"
                  >
                    Create
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="create-badge-form-button cancel"
                    onClick={() => setShowCreateBadgeModal(false)}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AchievementBadges;



