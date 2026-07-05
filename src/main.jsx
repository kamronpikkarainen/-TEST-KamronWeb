import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import './index.css';
import App from './App.jsx';

// StrictMode is intentionally omitted: its double-mount in dev fights
// GSAP ScrollTrigger pinning. gsap.context() cleanup covers unmounts.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
