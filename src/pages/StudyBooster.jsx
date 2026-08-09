import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMessageSync } from '../utils/messageService';
import { getPomodoroState, setPomodoroState, getCustomTimers, addCustomTimer, removeCustomTimer, getCustomTimerDeleteConfirm, setCustomTimerDeleteConfirm } from '../utils/storage';
import LucideIcon from '../components/LucideIcon';
import '../styles/StudyBooster.css';

const defaultDurations = [25, 30, 45];

function StudyBooster() {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(25); // in minutes for backward compatibility
  const [selectedDurationSeconds, setSelectedDurationSeconds] = useState(25 * 60); // in seconds for accurate tracking
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef(null);
  const [studyContent, setStudyContent] = useState(null);
  const [customTimers, setCustomTimers] = useState([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [pendingDeleteTimer, setPendingDeleteTimer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shouldConfirmDeleteTimer, setShouldConfirmDeleteTimer] = useState(getCustomTimerDeleteConfirm());
  const [dontAskAgainChecked, setDontAskAgainChecked] = useState(false);

  useEffect(() => {
    // Load saved state
    const savedState = getPomodoroState();
    setSelectedDuration(savedState.selectedDuration);
    const savedSeconds = savedState.timeRemaining || (savedState.selectedDuration * 60);
    setSelectedDurationSeconds(savedSeconds);
    setTimeRemaining(savedSeconds);
    setIsRunning(savedState.isRunning);
    setCompletedSessions(savedState.completedSessions || 0);
    
    // Load custom timers
    const custom = getCustomTimers();
    setCustomTimers(custom);
    
    // Load study content
    const content = getMessageSync('study');
    if (content) {
      setStudyContent(content);
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage
    setPomodoroState({
      selectedDuration,
      timeRemaining,
      isRunning,
      completedSessions
    });
  }, [selectedDuration, timeRemaining, isRunning, completedSessions]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompletedSessions((prev) => prev + 1);
            // Play notification sound or show alert
            if (window.Notification && Notification.permission === 'granted') {
              new Notification('Study Session Complete!', {
                body: 'Take a break! You\'ve completed a study session.',
                icon: '/vite.svg'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const handleStart = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(selectedDuration * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDurationSeconds);
  };

  const handleDurationChange = (durationInSeconds) => {
    if (!isRunning) {
      // Store the duration in seconds
      const durationInMinutes = Math.round(durationInSeconds / 60);
      setSelectedDuration(durationInMinutes);
      setSelectedDurationSeconds(durationInSeconds);
      setTimeRemaining(durationInSeconds);
    }
  };

  const handleNumberClick = useCallback((num) => {
    setCurrentInput(prev => {
      const newInput = prev + num;
      // Limit to 6 digits (HH:MM:SS format)
      return newInput.length <= 6 ? newInput : prev;
    });
  }, []);

  const handleClear = useCallback(() => {
    setCurrentInput('');
  }, []);

  const handleBackspace = useCallback(() => {
    setCurrentInput(prev => prev.slice(0, -1));
  }, []);

  // Parse input string to hours, minutes, seconds based on length
  const parseTimeInput = (input) => {
    if (!input || input === '0') {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const num = parseInt(input) || 0;
    const length = input.length;

    if (length <= 2) {
      // 1-2 digits: seconds only (e.g., "5" = 5s, "25" = 25s)
      return { hours: 0, minutes: 0, seconds: num };
    } else if (length === 3) {
      // 3 digits: MM:SS format (e.g., "125" = 1m 25s)
      const minutes = Math.floor(num / 100);
      const seconds = num % 100;
      return { hours: 0, minutes, seconds };
    } else if (length === 4) {
      // 4 digits: HH:MM format (e.g., "0130" = 1h 30m)
      const hours = Math.floor(num / 100);
      const minutes = num % 100;
      return { hours, minutes, seconds: 0 };
    } else if (length === 5) {
      // 5 digits: HH:MM:S format (e.g., "01305" = 1h 30m 5s)
      const hours = Math.floor(num / 10000);
      const minutes = Math.floor((num % 10000) / 10);
      const seconds = num % 10;
      return { hours, minutes, seconds };
    } else if (length === 6) {
      // 6 digits: HH:MM:SS format (e.g., "013025" = 1h 30m 25s)
      const hours = Math.floor(num / 10000);
      const minutes = Math.floor((num % 10000) / 100);
      const seconds = num % 100;
      return { hours, minutes, seconds };
    }

    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const handleAddCustomTimer = useCallback((e) => {
    if (e) e.preventDefault();
    
    const input = currentInput;
    if (!input || input === '0') {
      alert('Please enter a valid time');
      return;
    }

    const time = parseTimeInput(input);
    const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
    
    if (totalSeconds > 0 && totalSeconds <= 86400) { // Max 24 hours
      if (addCustomTimer(totalSeconds)) {
        setCustomTimers(getCustomTimers());
        setCurrentInput('');
        setShowCustomForm(false);
      } else {
        alert('Timer already exists or invalid duration (max 24 hours)');
      }
    } else {
      alert('Please set a valid duration (max 24 hours)');
    }
  }, [currentInput]);

  const formatDurationDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getDisplayTime = () => {
    return parseTimeInput(currentInput);
  };

  const removeTimerAndResetSelection = (durationInSeconds) => {
    removeCustomTimer(durationInSeconds);
    setCustomTimers(getCustomTimers());
    if (selectedDurationSeconds === durationInSeconds) {
      setSelectedDuration(25);
      setSelectedDurationSeconds(25 * 60);
      setTimeRemaining(25 * 60);
    }
  };

  const handleRemoveCustomTimer = (durationInSeconds, e) => {
    e.stopPropagation();
    if (!shouldConfirmDeleteTimer) {
      removeTimerAndResetSelection(durationInSeconds);
      return;
    }
    setPendingDeleteTimer(durationInSeconds);
    setShowDeleteConfirm(true);
    setDontAskAgainChecked(false);
  };

  const handleConfirmDeleteTimer = () => {
    if (pendingDeleteTimer == null) {
      return;
    }
    if (dontAskAgainChecked) {
      setShouldConfirmDeleteTimer(false);
      setCustomTimerDeleteConfirm(false);
    }
    removeTimerAndResetSelection(pendingDeleteTimer);
    setPendingDeleteTimer(null);
    setShowDeleteConfirm(false);
  };

  const handleCancelDeleteTimer = () => {
    setPendingDeleteTimer(null);
    setShowDeleteConfirm(false);
    setDontAskAgainChecked(false);
  };

  // Convert default durations to seconds and combine with custom timers
  const defaultDurationsInSeconds = defaultDurations.map(d => d * 60);
  const allDurations = [...defaultDurationsInSeconds, ...customTimers];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress based on selected duration in seconds
  const progress = selectedDurationSeconds > 0 
    ? ((selectedDurationSeconds - timeRemaining) / selectedDurationSeconds) * 100 
    : 0;

  // Request notification permission
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Keyboard input support for calculator pad
  useEffect(() => {
    if (!showCustomForm) return;

    const handleKeyDown = (e) => {
      // Prevent default for number keys and special keys when form is open
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAddCustomTimer();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCustomForm(false);
        handleClear();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCustomForm, handleNumberClick, handleBackspace, handleAddCustomTimer, handleClear]);

  return (
    <><div className="study-booster-container">
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
        className="study-header"
      >
        <h1>Study Booster</h1>
        <p>Pomodoro timer with tips and Quranic verses</p>
      </motion.div>

      <div className="study-content-wrapper">
        <div className="timer-section">
          <div className="duration-selector">
            {allDurations.map((duration) => {
              const isSelected = selectedDurationSeconds === duration;
              const isCustom = customTimers.includes(duration);
              return (
                <div key={duration} className="duration-button-wrapper">
                  <button
                    className={`duration-button ${isSelected ? 'active' : ''} ${isCustom ? 'custom' : ''}`}
                    onClick={() => handleDurationChange(duration)}
                    disabled={isRunning}
                  >
                    {formatDurationDisplay(duration)}
                  </button>
                  {isCustom && !isRunning && (
                    <button
                      className="remove-timer-button"
                      onClick={(e) => handleRemoveCustomTimer(duration, e)}
                      title="Remove custom timer"
                    aria-label="Close custom timer"
                    >
                      <LucideIcon name="X" size={18} />
                    </button>
                  )}
                </div>
              );
            })}
            {showDeleteConfirm && pendingDeleteTimer != null && (
              <div className="custom-timer-delete-confirm" role="dialog" aria-modal="true">
                <div className="custom-timer-delete-confirm-dialog">
                  <div className="custom-timer-delete-confirm-message">
                    Remove {formatDurationDisplay(pendingDeleteTimer)} timer?
                  </div>
                  <label className="custom-timer-delete-confirm-checkbox">
                    <input
                      type="checkbox"
                      checked={dontAskAgainChecked}
                      onChange={(e) => setDontAskAgainChecked(e.target.checked)} />
                    <span>Don't ask me again</span>
                  </label>
                  <div className="custom-timer-delete-confirm-actions">
                    <button className="custom-timer-delete-confirm-button confirm" onClick={handleConfirmDeleteTimer}>
                      Delete
                    </button>
                    <button className="custom-timer-delete-confirm-button cancel" onClick={handleCancelDeleteTimer}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>)}
            <button
              className="duration-button"
              onClick={() => setShowCustomForm(true)}
              disabled={isRunning}
            >
              + Add Timer
            </button>
          </div>
        </div>

        
        <AnimatePresence>
          {showCustomForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="keypad-modal"
              role="dialog"
              aria-modal="true"
              onClick={() => setShowCustomForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="keypad-modal-dialog"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Set Custom Timer</h2>
                <div className="keypad-display">
                  <div className="keypad-input">{currentInput || '0'}</div>
                  <div className="keypad-unit">Enter time in HH:MM:SS format</div>
                  <div className="time-display">
                    <div className="time-unit">
                      <span className="time-value">{getDisplayTime().hours}</span>
                      <span className="time-label">HH</span>
                    </div>
                    <span className="time-separator">:</span>
                    <div className="time-unit">
                      <span className="time-value">{getDisplayTime().minutes.toString().padStart(2, '0')}</span>
                      <span className="time-label">MM</span>
                    </div>
                    <span className="time-separator">:</span>
                    <div className="time-unit">
                      <span className="time-value">{getDisplayTime().seconds.toString().padStart(2, '0')}</span>
                      <span className="time-label">SS</span>
                    </div>
                  </div>
                </div>
                <div className="calculator-pad">
                  <div className="number-pad">
                    {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                      <motion.button
                        key={num}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`calc-button number-button ${num === 0 ? 'zero-button' : ''}`}
                        onClick={() => handleNumberClick(num.toString())}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                  <div className="action-pad">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="calc-button action-button clear"
                      onClick={handleClear}
                    >
                      Clear
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="calc-button action-button backspace"
                      onClick={handleBackspace}
                    >
                      ⌫
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="calc-button action-button submit"
                      onClick={handleAddCustomTimer}
                    >
                      Add
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="calc-button action-button cancel"
                      onClick={() => {
                        setShowCustomForm(false);
                        handleClear();
                      } }
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="timer-display">
          <motion.div
            className="progress-ring"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="progress-svg" viewBox="0 0 200 200">
              <circle
                className="progress-background"
                cx="100"
                cy="100"
                r="90" />
              <motion.circle
                className="progress-bar"
                cx="100"
                cy="100"
                r="90"
                strokeDasharray="565.48"
                animate={{
                  strokeDashoffset: 565.48 - (565.48 * progress) / 100
                }}
                transition={{ duration: 1, ease: "linear" }} />
            </svg>
            <div className="timer-text">
              <div className="time">{formatTime(timeRemaining)}</div>
              <div className="timer-status">
                {isRunning ? 'Studying...' : timeRemaining === 0 ? 'Complete!' : 'Ready'}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="timer-controls">
          {!isRunning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="control-button start"
              onClick={handleStart}
            >
              Start
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="control-button pause"
              onClick={handlePause}
            >
              Pause
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="control-button reset"
            onClick={handleReset}
          >
            Reset
          </motion.button>
        </div>
        <div className="sessions-counter">
          Completed Sessions: {completedSessions}
        </div>
      </div>

        <div className="study-info-section">
          {studyContent && (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="info-card"
              >
                <h3><LucideIcon name="Lightbulb" size={20} /> Study Tip</h3>
                <p className="english">{studyContent.tip.english}</p>
                <p className="urdu">{studyContent.tip.urdu}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="info-card"
              >
                <h3><LucideIcon name="BookOpen" size={20} /> Quranic Ayah</h3>
                <p className="ayah-arabic">{studyContent.ayah.arabic}</p>
                <p className="ayah-translation english">{studyContent.ayah.english}</p>
                <p className="ayah-translation urdu">{studyContent.ayah.urdu}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="info-card"
              >
                <h3><LucideIcon name="Sparkles" size={20} /> Motivation</h3>
                <p className="english">{studyContent.motivational.english}</p>
                <p className="urdu">{studyContent.motivational.urdu}</p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default StudyBooster;

