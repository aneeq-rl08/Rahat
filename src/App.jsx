import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MoodSelector from './pages/MoodSelector';
import StudyBooster from './pages/StudyBooster';
import WishGarden from './pages/WishGarden';
import AchievementBadges from './pages/AchievementBadges';
import BirthdaySurprise from './pages/BirthdaySurprise';
import RamadanEid from './pages/RamadanEid';
import AndroidApp from './pages/AndroidApp';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="appShell">
        <main className="appMain">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood-selector" element={<MoodSelector />} />
            <Route path="/study-booster" element={<StudyBooster />} />
            <Route path="/wish-garden" element={<WishGarden />} />
            <Route path="/achievement-badges" element={<AchievementBadges />} />
            <Route path="/ramadan-eid" element={<RamadanEid />} />
            <Route path="/birthday-surprise" element={<BirthdaySurprise />} />
            <Route path="/islamic-calendar" element={<RamadanEid />} />
            <Route path="/android" element={<AndroidApp />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
