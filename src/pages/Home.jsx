import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBirthdayNotificationSeen, setBirthdayNotificationSeen } from '../utils/storage';
import DualClock from '../components/DualClock';
import LucideIcon from '../components/LucideIcon';
import '../styles/Home.css';
import '../styles/BirthdayNotification.css';

const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, hover: { y: -4, transition: { duration: 0.2 } } };
const cards = [
  { id: 'mood', title: 'Mood Selector', description: 'Select your mood and receive a dua and supportive message', icon: 'Smile', path: '/mood-selector', color: '#FFB6C1' },
  { id: 'study', title: 'Study Booster', description: 'Pomodoro timer with tips and Quranic verses', icon: 'BookOpen', path: '/study-booster', color: '#B0E0E6' },
  { id: 'wish', title: 'Wish Garden', description: 'Garden of wishes with positive blessings', icon: 'Flower2', path: '/wish-garden', color: '#DDA0DD' },
  { id: 'badges', title: 'Achievement Badges', description: 'Track your progress and achievements', icon: 'Trophy', path: '/achievement-badges', color: '#FFE4B5' },
  { id: 'birthday', title: 'Birthday Surprise', description: 'Celebrate special moments with heartfelt blessings', icon: 'PartyPopper', path: '/birthday-surprise', color: '#FFD700' },
  { id: 'ramadan-eid', title: 'Islamic Calendar and Blessings', description: 'Daily blessings, prayer times, and important dates', icon: 'MoonStar', path: '/islamic-calendar', color: '#2F5D62' },
  { id: 'android', title: 'Rahat for Android', description: 'Explore the native offline companion and release information', icon: 'Smartphone', path: '/android', color: '#8DBCC9' }
];

export default function Home() {
  const navigate = useNavigate();
  const [showBirthdayNotification, setShowBirthdayNotification] = useState(false);
  const today = new Date();
  const isBirthday = today.getDate() === 18 && today.getMonth() === 0;
  useEffect(() => {
    if (!isBirthday || getBirthdayNotificationSeen()) return undefined;
    const timer = setTimeout(() => setShowBirthdayNotification(true), 1000);
    return () => clearTimeout(timer);
  }, [isBirthday]);
  const openBirthday = () => { setShowBirthdayNotification(false); setBirthdayNotificationSeen(true); navigate('/birthday-surprise'); };
  const closeBirthday = (event) => { event.stopPropagation(); setShowBirthdayNotification(false); setBirthdayNotificationSeen(true); };
  return <div className="home-container">
    {showBirthdayNotification && <motion.div initial={{ opacity: 0, y: -50, scale: .8 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="birthday-notification clickable" role="button" tabIndex={0} onClick={openBirthday} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openBirthday(); }}>
      <div className="notification-content"><LucideIcon name="PartyPopper" size={26} className="notification-icon" /><div className="notification-text"><h3>Happy Birthday</h3><p>Open your special birthday blessing.</p></div><button type="button" className="notification-close" onClick={closeBirthday} aria-label="Dismiss birthday notification"><LucideIcon name="X" size={20} /></button></div>
    </motion.div>}
    <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }} className="home-header">
      <div className="logo-container"><h1 className="home-title">راحة</h1><p className="home-subtitle">Your Wellness Companion</p></div>
      <div className="home-header-actions"><DualClock /><button type="button" className="android-header-action" onClick={() => navigate('/android')} aria-label="Rahat for Android" title="Rahat for Android"><LucideIcon name="Smartphone" size={21} /></button></div>
    </motion.header>
    <div className="cards-grid">{cards.map((card, index) => <motion.button key={card.id} type="button" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: index * .08 }} whileHover="hover" className="home-card" onClick={() => navigate(card.path)} style={{ '--card-color': card.color }}><div className="card-icon"><LucideIcon name={card.icon} size={42} /></div><h2 className="card-title">{card.title}</h2><p className="card-description">{card.description}</p></motion.button>)}</div>
  </div>;
}
