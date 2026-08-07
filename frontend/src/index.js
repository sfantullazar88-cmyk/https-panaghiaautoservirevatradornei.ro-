import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import App from '@/App';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log(
          'Service worker înregistrat:',
          registration.scope
        );
      })
      .catch((error) => {
        console.error(
          'Service worker nu a putut fi înregistrat:',
          error
        );
      });
  });
}