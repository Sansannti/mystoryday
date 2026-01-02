// CSS imports
import '../styles/style.css';

import App from './views/app.js';

// Tunggu hingga DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi aplikasi
  const app = new App({
    content: document.getElementById('mainContent'),
    drawerButton: document.getElementById('menuToggle'),
    navigationDrawer: document.getElementById('navLinks')
  });

  // Jalankan aplikasi
  app.init();
});