# Rahat - Your Peaceful Companion

A beautiful React + Vite web app designed to provide spiritual support, study motivation, and positive energy through Islamic duas, Quranic verses, and motivational messages.
  
**Release Date:** February 2026  

## Features

### 🏠 Home Page
- Beautiful card-based navigation to all features
- Soft pastel theme with smooth animations
- Responsive design for desktop and mobile

### 😊 Mood Selector
- 4 mood options: Happy, Tired, Stressed, Busy
- Displays relevant duas and supportive messages
- Smooth fade-in/fade-out animations
- 3D hover effects on buttons

### 📚 Study Booster
- Pomodoro timer with 25, 30, and 45-minute options
- Animated circular progress bar
- Study tips and Quranic ayahs
- Motivational messages
- Session tracking

### 🌸 Wish Garden
- 3 interactive flowers: White (Dua), Yellow (Positivity), Blue (Motivation)
- Beautiful blessing cards with animations
- Floating particle effects on interaction

### 🏆 Achievement Badges
- Default badges: Completed Exam Week, Consistency Star, Stress Survivor
- Click to unlock badges
- Add custom badges
- All badges stored in localStorage

### 🌙 Ramadan & Eid Times (NEW!)
- **Daily Duʿā:** Contextual blessings for Ramadan, Eid, and regular days
- **City Selector:** 60+ cities worldwide including Lombardy, Italy
- **Real-time API Data:** Live AlAdhan API integration for accurate dates
- **Ramadan/Eid Dates:** Accurate Islamic calendar with Hijri dates
- **Prayer Times:** Sehri/Iftār timings with optional countdown timer
- **Mini Calendar:** Month view highlighting Ramadan and Eid days
- **Duration Display:** Shows Ramadan duration from start to end
- **API Integration:** Uses AlAdhan API for accurate Islamic calendar data
- **Mobile Optimized:** Responsive design for all devices

## Content

Rahat includes curated duas, Quranic verses, and supportive messages for its wellness and study features. Core content is bundled with the website in `src/data/messages.json`.

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animations
- **React Router** - Navigation
- **localStorage** - Data persistence

## Project Structure

```
src/
├── pages/           # Page components
├── styles/          # CSS files
├── utils/           # Utilities (messageService, storage)
├── data/            # JSON data files
└── App.jsx          # Main app with routing
```

## Features in Detail

### Data Persistence
- Selected mood preferences
- Pomodoro timer state
- Unlocked badges
- Custom badges
- Wish garden interaction counts

### Animations
- Fade-in/fade-out transitions
- 3D hover effects
- Scale animations
- Smooth page transitions
- Floating particles

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## License

This project is open source and available for personal use.

## Contributing

Feel free to contribute by adding more duas, ayahs, or improving the UI/UX!
