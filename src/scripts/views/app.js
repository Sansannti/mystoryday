import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import AuthData from '../data/auth-data.js';
import PushManager from '../utils/push-manager.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #deferredPrompt = null;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._initialAppShell();
  }

  _initialAppShell() {
    this._initializeNavigation();
    this._initializeScrollEffects();
    this._setupAuthUI();
    this._setupPWAFeatures();
  }

  _setupPWAFeatures() {
    this._setupInstallPrompt();
    this._setupPushNotifications();
  }

  _setupInstallPrompt() {
    const installBanner = document.getElementById('installBanner');
    const installButton = document.getElementById('installButton');
    const dismissBanner = document.getElementById('dismissBanner');

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      this.#deferredPrompt = e;
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('installBannerDismissed');
      const installed = localStorage.getItem('appInstalled');
      
      if (!dismissed && !installed) {
        installBanner.style.display = 'block';
      }
    });

    // Install button handler
    if (installButton) {
      installButton.addEventListener('click', async () => {
        if (!this.#deferredPrompt) {
          return;
        }

        this.#deferredPrompt.prompt();
        const { outcome } = await this.#deferredPrompt.userChoice;
        
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
          localStorage.setItem('appInstalled', 'true');
        }
        
        this.#deferredPrompt = null;
        installBanner.style.display = 'none';
      });
    }

    // Dismiss button handler
    if (dismissBanner) {
      dismissBanner.addEventListener('click', () => {
        installBanner.style.display = 'none';
        localStorage.setItem('installBannerDismissed', 'true');
        
        // Clear dismissal after 7 days
        setTimeout(() => {
          localStorage.removeItem('installBannerDismissed');
        }, 7 * 24 * 60 * 60 * 1000);
      });
    }

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      localStorage.setItem('appInstalled', 'true');
      installBanner.style.display = 'none';
    });
  }

  async _setupPushNotifications() {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationIcon = document.getElementById('notificationIcon');
    
    if (!notificationToggle || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // Check current subscription status
    const isSubscribed = await PushManager.isSubscribed();
    this._updateNotificationIcon(isSubscribed);

    notificationToggle.addEventListener('click', async () => {
      try {
        const currentStatus = await PushManager.isSubscribed();
        
        if (currentStatus) {
          // Unsubscribe
          await PushManager.unsubscribe();
          this._updateNotificationIcon(false);
          this._showNotificationAlert('Push notifications dinonaktifkan', 'success');
        } else {
          // Request permission and subscribe
          const hasPermission = await PushManager.requestPermission();
          
          if (hasPermission) {
            await PushManager.subscribe();
            this._updateNotificationIcon(true);
            this._showNotificationAlert('Push notifications diaktifkan!', 'success');
            
            // Show test notification
            await PushManager.showTestNotification();
          } else {
            this._showNotificationAlert('Permission ditolak untuk notifications', 'error');
          }
        }
      } catch (error) {
        console.error('Error toggling push notifications:', error);
        this._showNotificationAlert('Error mengatur notifications', 'error');
      }
    });
  }

  _updateNotificationIcon(isSubscribed) {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationToggle = document.getElementById('notificationToggle');
    
    if (notificationIcon) {
      notificationIcon.textContent = isSubscribed ? '🔔' : '🔕';
    }
    
    if (notificationToggle) {
      notificationToggle.setAttribute(
        'aria-label', 
        isSubscribed ? 'Nonaktifkan push notifications' : 'Aktifkan push notifications'
      );
      notificationToggle.setAttribute(
        'title',
        isSubscribed ? 'Push notifications aktif' : 'Push notifications nonaktif'
      );
    }
  }

  _showNotificationAlert(message, type) {
    // Create temporary alert element
    const alert = document.createElement('div');
    alert.className = `notification-alert notification-alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
      alert.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(alert);
      }, 300);
    }, 3000);
  }

  _initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      const links = document.querySelectorAll('.nav-links a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthData.logout();
        window.location.hash = '#/login';
        this._setupAuthUI();
      });
    }
  }

  _initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  _setupAuthUI() {
    const isLoggedIn = AuthData.isLoggedIn();
    
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const storiesLinkItem = document.getElementById('storiesLinkItem');
    const favoritesLinkItem = document.getElementById('favoritesLinkItem');
    const addStoryLinkItem = document.getElementById('addStoryLinkItem');
    const notificationLinkItem = document.getElementById('notificationLinkItem');
    const logoutLinkItem = document.getElementById('logoutLinkItem');
    
    if (isLoggedIn) {
      if (loginLink) loginLink.parentElement.style.display = 'none';
      if (registerLink) registerLink.parentElement.style.display = 'none';
      if (storiesLinkItem) storiesLinkItem.style.display = 'block';
      if (favoritesLinkItem) favoritesLinkItem.style.display = 'block';
      if (addStoryLinkItem) addStoryLinkItem.style.display = 'block';
      if (notificationLinkItem) notificationLinkItem.style.display = 'block';
      if (logoutLinkItem) logoutLinkItem.style.display = 'block';
    } else {
      if (loginLink) loginLink.parentElement.style.display = 'block';
      if (registerLink) registerLink.parentElement.style.display = 'block';
      if (storiesLinkItem) storiesLinkItem.style.display = 'none';
      if (favoritesLinkItem) favoritesLinkItem.style.display = 'none';
      if (addStoryLinkItem) addStoryLinkItem.style.display = 'none';
      if (notificationLinkItem) notificationLinkItem.style.display = 'none';
      if (logoutLinkItem) logoutLinkItem.style.display = 'none';
    }
  }

  _checkAuth() {
    const url = getActiveRoute();
    const isLoggedIn = AuthData.isLoggedIn();
    
    const protectedRoutes = ['/stories', '/add-story', '/favorites'];
    
    if (protectedRoutes.includes(url) && !isLoggedIn) {
      window.location.hash = '#/login';
      return false;
    }
    
    return true;
  }

  init() {
    this._initializeBackToTop();
    this.renderPage();
    
    window.addEventListener('hashchange', () => {
      this.renderPage();
    });

    window.addEventListener('popstate', () => {
      this.renderPage();
    });
  }

  _initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      backToTopBtn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    }
  }

  async renderPage() {
    if (!this._checkAuth()) {
      return;
    }
    
    const url = getActiveRoute();
    const page = routes[url];
    
    if (!page) {
      this._showError();
      return;
    }
    
    if (this.#content) {
      try {
        this._showLoading();
        this._setupAuthUI();
        
        if (document.startViewTransition) {
          await document.startViewTransition(async () => {
            this.#content.innerHTML = await page.render();
            await page.afterRender();
          }).finished;
        } else {
          this.#content.innerHTML = await page.render();
          this.#content.classList.add('page-enter');
          await page.afterRender();
        }
        
        window.scrollTo(0, 0);
        this._hideLoading();
      } catch (error) {
        console.error('Error rendering page:', error);
        this._showError();
      }
    }
  }

  _showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.style.display = 'flex';
    }
  }

  _hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }

  destroy() {
    window.removeEventListener('hashchange', this.renderPage);
    window.removeEventListener('popstate', this.renderPage);
  }
}

export default App;