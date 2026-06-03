import React from 'react';

const ThinkingAnimation = () => {
  return (
    <div className="neon-brain-container">
      <svg viewBox="0 0 100 100" className="neon-brain">
        
        <path className="circuit-path" d="M50 10 C30 10, 20 25, 20 50 C20 75, 40 90, 50 90 C60 90, 80 75, 80 50 C80 25, 70 10, 50 10 Z" fill="none" stroke="#00f2ff" strokeWidth="1.5" />
        <path className="circuit-line" d="M30 40 L45 40 M30 50 L45 50 M55 40 L70 40 M55 50 L70 50" stroke="#00f2ff" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="#00f2ff" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <div className="thinking-text-wrapper">
        <span className="thinking-text">ELITE AI ANALYZING</span>
      </div>
    </div>
  );
};

export default ThinkingAnimation;