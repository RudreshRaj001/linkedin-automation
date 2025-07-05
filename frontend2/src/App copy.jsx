// src/App.jsx
import React from 'react';
import Header from './components/Header';
import PostGenerator from './components/PostGenerator';
import ImageGenerator from './components/ImageGenerator';
import LinkedInActions from './components/LinkedInActions';
import './App.css';

function App() {
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', flexGrow: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome to Your LinkedIn Automation Dashboard
        </h1>

        <PostGenerator />
        <ImageGenerator />
        <LinkedInActions />

        <footer style={{ marginTop: '3rem', padding: '1rem 0', textAlign: 'center', borderTop: '1px solid #333' }}>
          <small>© {new Date().getFullYear()} LinkedIn Automation. All rights reserved.</small>
        </footer>
      </main>
    </div>
  );
}

export default App;
