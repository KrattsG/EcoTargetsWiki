/* ========================
   APP INITIALIZATION
   ======================== */

import { loadProperties } from './config.js';
import { buildFileSystem } from './fileSystem.js';
import { displayCards } from './cards.js';
import { buildFileTree, initMap } from './ui.js';
import { initRouting } from './routing.js';
import { initSearch } from './search.js';

function hasElement(id) {
  return !!document.getElementById(id);
}

/**
 * Initialize the entire application
 */
async function init() {
  try {
    // Show loading state
    showLoadingState();
    
    // Load and parse properties data
    await loadProperties();
    
    // Build internal file system map
    buildFileSystem();
    
    // Render initial UI elements
    console.log('Rendering cards...');
    if (hasElement('characters-grid')) {
      displayCards('characters', 'characters-grid', 'characters');
    }
    if (hasElement('locations-grid')) {
      displayCards('locations', 'locations-grid', 'locations');
    }
    if (hasElement('file-tree')) {
      buildFileTree();
    }
    
    // Initialize routing functionality
    console.log('Initializing routing...');
    initRouting();
    
    // Initialize search functionality
    console.log('Initializing search...');
    initSearch();
    
    // Hide loading state
    hideLoadingState();
    
    console.log('App initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showErrorState(`Failed to load application: ${error.message}. Please refresh the page.`);
  }
}

/**
 * Show loading state
 */
function showLoadingState() {
  const loadingElement = document.createElement('div');
  loadingElement.id = 'app-loading';
  loadingElement.className = 'loading-overlay';
  loadingElement.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading EcoTargets World...</p>
    </div>
  `;
  document.body.appendChild(loadingElement);
}

/**
 * Hide loading state
 */
function hideLoadingState() {
  const loadingElement = document.getElementById('app-loading');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => loadingElement.remove(), 300);
  }
}

/**
 * Show error state
 */
function showErrorState(message) {
  hideLoadingState();
  
  const errorElement = document.createElement('div');
  errorElement.className = 'error-overlay';
  errorElement.innerHTML = `
    <div class="error-content">
      <h2>⚠️ Oops!</h2>
      <p>${message}</p>
      <button onclick="window.location.reload()" class="retry-button">Try Again</button>
    </div>
  `;
  document.body.appendChild(errorElement);
}

// Re-add modal handlers after DOM updates (not needed with dynamic imports)
// const observer = new MutationObserver(() => {
//   addModalClickHandlers();
// });

// observer.observe(document.body, {
//   childList: true,
//   subtree: true
// });

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
