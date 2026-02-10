import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import App from './App.jsx'

// Esperar a que SweetAlert2 esté disponible
function waitForLibraries() {
  return new Promise((resolve) => {
    const checkLibraries = () => {
      if (window.Swal) {
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
