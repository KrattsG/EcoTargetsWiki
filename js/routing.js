/* ========================
   ROUTING & NAVIGATION
   ======================== */

import { loadAndDisplayFile } from './fileSystem.js';
import { BASE_PATH } from './config.js';

function isSpaMode() {
  return document.querySelectorAll('.page').length > 0;
}

function getCurrentPageId() {
  if (isSpaMode()) {
    return document.querySelector('.page.active')?.id || null;
  }
  const filename = window.location.pathname.split('/').pop()?.toLowerCase() || '';
  if (filename === 'explorer.html') return 'explorer';
  if (filename === 'map.html') return 'map';
  if (filename === 'home.html') return 'home';
  if (filename === 'index.html' || filename === '') return 'home';
  return null;
}

/**
 * Show a specific page by hiding all others
 */
export async function showPage(pageId) {
  console.log('showPage called with:', pageId);
  if (isSpaMode()) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
      console.log('Removed active class from:', page.id);
    });
    
    const page = document.getElementById(pageId);
    console.log('Found page element:', page);
    
    if (page) {
      page.classList.add('active');
      console.log('Added active class to:', pageId);
    }
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`a[href="#/${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
  
  // Initialize map on demand
  if (pageId === 'map' && !window.mapInstance) {
    const { initMap } = await import('./ui.js');
    setTimeout(initMap, 100);
  }
}

/**
 * Handle hash changes for routing
 * Supports both #/page routes and #/explorer/path/to/file routes
 */
export function handleHashChange() {
  const hash = window.location.hash;
  console.log('Hash changed to:', hash);
  
  // Parse hash: #/explorer/characters/dent.html
  if (hash.includes('/explorer/')) {
    const match = hash.match(/#\/explorer\/(.+)$/);
    if (match) {
      const filePath = match[1];
      console.log('Loading explorer file:', filePath);

      const currentPageId = getCurrentPageId();
      if (!isSpaMode() && currentPageId !== 'explorer') {
        window.location.href = `${BASE_PATH}/explorer.html#/explorer/${filePath}`;
        return;
      }

      showPage('explorer');
      loadAndDisplayFile(filePath);
    } else {
      console.log('Invalid explorer hash format');
    }
  } else {
    // Regular page navigation: #/home, #/map, etc
    const pageId = hash.substring(2) || 'home'; // Remove #/
    console.log('Loading page:', pageId);
    if (isSpaMode()) {
      showPage(pageId);
    }
  }
}

/**
 * Initialize routing listeners
 */
export function initRouting() {
  console.log('Initializing routing...');
  window.addEventListener('hashchange', handleHashChange);
  // Handle initial load
  setTimeout(() => {
    console.log('Checking initial hash...');
    handleHashChange();
    const currentPageId = getCurrentPageId();
    if (currentPageId === 'map') showPage('map');
  }, 100);
}
