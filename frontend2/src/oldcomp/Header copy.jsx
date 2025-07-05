// src/components/Header.jsx
import React from 'react';

const Header = () => (
  <header style={{ background: '#212121', padding: '0.5rem 1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Replace with your own logo/icon if desired */}
      <span style={{ fontSize: '1.5rem', color: '#0A66C2', marginRight: '0.5rem' }}>in</span>
      <h2 style={{ color: '#fff', margin: 0 }}>LinkedIn Automation Dashboard</h2>
    </div>
  </header>
);

export default Header;
