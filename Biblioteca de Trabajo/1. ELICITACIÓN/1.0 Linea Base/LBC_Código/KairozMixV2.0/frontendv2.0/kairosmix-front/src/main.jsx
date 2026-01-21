import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Esperar a que Lucide y SweetAlert2 estén disponibles
function waitForLibraries() {
  return new Promise((resolve) => {
    const checkLibraries = () => {
      if (window.lucide && window.Swal) {
        resolve();
      } else {
        setTimeout(checkLibraries, 50);
      }
    };
    checkLibraries();
  });
}

waitForLibraries().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
