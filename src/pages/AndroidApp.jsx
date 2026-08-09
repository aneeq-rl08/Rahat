import { useNavigate } from 'react-router-dom';
import LucideIcon from '../components/LucideIcon';
import '../styles/AndroidApp.css';

const appFeatures = [
  ['WifiOff', 'Offline by design', "Du'as, wellbeing tools, timers, wishes, badges, and birthday content remain available without a connection."],
  ['BookOpen', 'Thoughtful daily support', "A native space for mood check-ins, du'as, study encouragement, blessings, and Islamic calendar information."],
  ['Clock3', 'Time that stays accurate', 'Italy and Pakistan clocks use the phone time, including the CET and CEST seasonal change.'],
  ['BellRing', 'Gentle reminders', 'Optional local reminders, including the annual birthday surprise, work without needing a web browser.'],
  ['Palette', 'Personal appearance', 'Themes, dark mode, and special-day treatments belong to the app experience.']
];
const sharedFeatures = ["Mood Selector and supportive du'as", 'Study Booster and saved progress', 'Wish Garden blessings', 'Achievement Badges', 'Islamic calendar and daily content'];

export default function AndroidApp() {
  const navigate = useNavigate();
  return <div className="android-page"><div className="android-page-inner">
    <button type="button" className="back-button android-back" onClick={() => navigate('/')}><LucideIcon name="ArrowLeft" size={18} />Back to Home</button>
    <header className="android-intro"><div className="android-title-mark"><LucideIcon name="Smartphone" size={30} /></div><p className="android-eyebrow">Native Android app</p><h1>Rahat for Android</h1><p className="android-lead">The native companion keeps Rahat close when a browser or internet connection is not.</p></header>
    <section className="android-release" aria-labelledby="release-title"><div><div className="release-status"><LucideIcon name="CheckCircle2" size={17} />Signed release available</div><h2 id="release-title">Rahat 1.0 is ready for Android</h2><p>Download the verified native app directly from Rahat. The same APK will be attached to a GitLab Release when publishing is available.</p></div><div className="release-actions"><a className="download-action" href={`${import.meta.env.BASE_URL}downloads/Rahat.apk`} download="Rahat.apk" aria-describedby="release-note"><LucideIcon name="Download" size={18} />Download Rahat.apk</a><button type="button" className="download-action secondary" disabled aria-describedby="release-note"><LucideIcon name="ExternalLink" size={18} />GitLab Release coming soon</button></div><p id="release-note" className="release-note">Signed APK · Android 6.0 and later · 10.3 MB · Works offline.</p></section>
    <section className="android-section" aria-labelledby="native-features-title"><div className="section-heading"><h2 id="native-features-title">Made for the app</h2><p>Native details that are more dependable on a phone.</p></div><div className="android-feature-grid">{appFeatures.map(([icon, title, description]) => <article className="android-feature" key={title}><LucideIcon name={icon} size={24} /><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="android-section shared-section" aria-labelledby="shared-title"><div className="section-heading"><h2 id="shared-title">One familiar Rahat experience</h2><p>The website and Android app share the features that matter most.</p></div><ul className="shared-list">{sharedFeatures.map(feature => <li key={feature}><LucideIcon name="CheckCircle2" size={18} />{feature}</li>)}</ul></section>
  </div></div>;
}
