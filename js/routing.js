/* ========================
   ROUTING & NAVIGATION
   ======================== */

import { loadAndDisplayFile } from './fileSystem.js';

/**
 * Show a specific page by hiding all others
 */
export async function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`a[href="#/${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');
  
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
  
  // Parse hash: #/explorer/characters/dent.html
  if (hash.includes('/explorer/')) {
    const match = hash.match(/#\/explorer\/(.+)$/);
    if (match) {
      const filePath = match[1];
      showPage('explorer');
      loadAndDisplayFile(filePath);
    }
  } else {
    // Regular page navigation: #/home, #/map, etc
    const pageId = hash.substring(2) || 'home'; // Remove #/
    showPage(pageId);
  }
}

/**
 * Initialize routing listeners
 */
export function initRouting() {
  window.addEventListener('hashchange', handleHashChange);
  // Handle initial load
  setTimeout(() => handleHashChange(), 100);
}
