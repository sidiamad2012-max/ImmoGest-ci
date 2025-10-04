import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

// Performance monitoring
const startTime = performance.now();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log render performance
setTimeout(() => {
  const renderTime = performance.now() - startTime;
  console.log(`ImmoGest CI rendered in ${renderTime.toFixed(2)}ms`);
}, 0);
