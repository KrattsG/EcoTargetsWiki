/* ========================
   APP INITIALIZATION
   ======================== */

import { loadProperties } from './config.js';
import { buildFileSystem } from './fileSystem.js';
import { displayCharacters } from './cards.js';
import { buildFileTree, initMap } from './ui.js';
import { initPopup } from './popup.js';
import { initRouting } from './routing.js';

/**
 * Initialize the entire application
 */
async function init() {
  try {
    // Load and parse properties data
    await loadProperties();
    
    // Build internal file system map
    buildFileSystem();
    
    // Render initial UI elements
    displayCharacters();
    buildFileTree();
    
    // Initialize popup preview feature
    initPopup();
    
    // Setup routing and handle initial route
    initRouting();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
