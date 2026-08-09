import React from 'react';
import './BirthdayCelebration.css';

const BirthdayCelebration = () => {
  return (
    <section className="stage active birthday-container">
      <h1 className="birthday-title fade-in-up">🎉 Happy Birthday to you 🎉</h1>
      <p className="birthday-message">May your day be filled with joy, blessings, and cherished moments.🌸</p>
      <div className="letter-container">
        <div className="letter-content">
          <p>
            Wishing you a birthday filled with laughter, joy, and warmth of those who truly care about you.
            May every moment today sparkle brighter than the candles, and may every wish you make come true in the most beautiful way possible.
          </p>
          <div className="highlight-box">
            <p>
              🌸 <b>May Allah (SWT) bless you with barakah</b> — endless happiness, health, peace, and protection from evil, and may your family always be safe and joyful.
            </p>
          </div>
          <p className="signature">With heartfelt blessings,<br />— Someone who wishes you calm joy🌙✨</p>
        </div>
      </div>
    </section>
  );
};

export default BirthdayCelebration;
