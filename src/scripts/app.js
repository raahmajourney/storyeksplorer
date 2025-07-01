import HomePresenter from './presenters/home-presenter.js';
import AddStoryPresenter from './presenters/add-story-presenter.js';
import AuthPresenter from './presenters/auth-presenter.js';
import DetailPresenter from './presenters/detail-presenter.js';
import { setupViewTransitions } from './utils/view-transition.js';
import { setupAccessibility } from './utils/accessibility.js';
import { registerPushNotification } from './utils/push-api.js';
import FavoritePresenter from './presenters/favorite-presenter.js';


const routes = {
  '/': HomePresenter,
  '/add': AddStoryPresenter,
  '/auth': AuthPresenter,
  '/detail/:id': DetailPresenter,
  '/fav': FavoritePresenter

};

function updateNavigation() {
  const token = localStorage.getItem('token');
  const authLink = document.getElementById('auth-link');
  const userNavItem = document.querySelector('.user-nav-item');
  const authNavItem = document.querySelector('.auth-nav-item');
  
  if (token) {
    authNavItem.style.display = 'none';
    userNavItem.style.display = 'block';
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('username-display').textContent = user.name || 'User';
  } else {
    authNavItem.style.display = 'block';
    userNavItem.style.display = 'none';
  }
}

function initApp() {
  setupViewTransitions();
  setupAccessibility();
  
  const mainContent = document.querySelector('#main-content');

  function renderPage() {
    const url = window.location.hash.slice(1) || '/';
    const token = localStorage.getItem('token');
    
    const isProtectedRoute = ['/', '/add'].includes(url) || url.startsWith('/detail');
    if (isProtectedRoute && !token) {
      window.location.hash = '#/auth';
      return;
    }

    for (const route in routes) {
      const routePattern = route.replace(/:\w+/g, '([^/]+)');
      const regex = new RegExp(`^${routePattern}$`);
      
      if (regex.test(url)) {
        document.startViewTransition(() => {
          mainContent.innerHTML = '';
          new routes[route]({ container: mainContent });
        });
        break;
      }
    }

    updateNavigation();

    // 🟢 Register push notification jika login
    const userToken = localStorage.getItem('token');
    if (userToken) {
      registerPushNotification();
    }
  }

  function handleNavigation(e) {
    const anchor = e.target.closest('a');
    if (!anchor || !anchor.classList.contains('nav-link')) return;
    e.preventDefault();
    const href = anchor.getAttribute('href');
    if (href.startsWith('#')) {
      window.location.hash = href.slice(1);
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-btn') {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/auth';
    }
  });

  window.addEventListener('hashchange', renderPage);
  document.addEventListener('click', handleNavigation);

  renderPage();
}

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      console.log('✅ Aplikasi diinstall');
    }
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});


document.addEventListener('DOMContentLoaded', initApp);