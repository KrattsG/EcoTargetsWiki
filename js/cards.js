/* ========================
   CARD SHOWCASE
   ======================== */

import { propertiesData, BASE_PATH } from './config.js';

function isSpaMode() {
  return document.querySelectorAll('.page').length > 0;
}

function getExplorerHref(filePath) {
  const hash = `#/explorer/${filePath}`;
  return isSpaMode() ? hash : `${BASE_PATH}/explorer.html${hash}`;
}

/**
 * Display cards for a specific category
 * @param {string} category - 'characters', 'locations', etc.
 * @param {string} gridId - HTML element ID for the grid
 * @param {string} hrefBase - Base path for links (e.g., 'characters', 'locations')
 * @param {string} filterByLocation - Optional location name to filter characters by (e.g., 'ProtocolW')
 * @param {boolean} openInModal - Whether to open character details in modal instead of navigation
 * @param {Object<string, any> | null} itemsOverride - Optional explicit items map to display instead of propertiesData[category]
 */
export function displayCards(category = 'characters', gridId = 'characters-grid', hrefBase = null, filterByLocation = null, openInModal = false, itemsOverride = null) {
  console.log('displayCards called with:', { category, gridId, hrefBase, filterByLocation, openInModal });
  
  const grid = document.getElementById(gridId);
  if (!grid || !propertiesData[category]) {
    console.error('Grid or properties not found:', { grid: !!grid, properties: !!propertiesData[category] });
    return;
  }
  grid.innerHTML = '';

  // Default href base matches category
  const basePath = hrefBase || category;

  let itemsToDisplay = itemsOverride || propertiesData[category];
  console.log('Items to display:', Object.keys(itemsToDisplay));

  // If filtering by location, only show characters in that location
  if (filterByLocation && category === 'characters' && propertiesData.locations && propertiesData.locations[filterByLocation]) {
    const locationData = propertiesData.locations[filterByLocation];
    if (locationData.characters && Array.isArray(locationData.characters)) {
      // Filter to only characters in this location
      itemsToDisplay = {};
      for (const charName of locationData.characters) {
        if (propertiesData.characters[charName]) {
          itemsToDisplay[charName] = propertiesData.characters[charName];
        }
      }
    }
  }

  for (const [key, item] of Object.entries(itemsToDisplay)) {
    console.log('Creating card for:', key);
    
    const card = document.createElement('div');
    card.className = category === 'characters' ? 'character-card card' : 'location-card card';
    
    // Add data attributes for modal functionality
    if (category === 'characters') {
      card.dataset.character = key;
      card.addEventListener('click', () => {
        console.log('Character card clicked:', key);
        if (openInModal && typeof window.showCharacterModal === 'function') {
          window.showCharacterModal(key);
          return;
        }
        const filePath = `characters/${key.toLowerCase()}.html`;
        const href = getExplorerHref(filePath);
        console.log('Navigating to:', href);
        window.location.href = href;
      });
      card.style.cursor = 'pointer';
      console.log('Added click listener to character card:', key);
    } else if (category === 'locations') {
      card.dataset.location = key;
      card.addEventListener('click', () => {
        console.log('Location card clicked:', key);
        if (openInModal && typeof window.showLocationModal === 'function') {
          window.showLocationModal(key);
          return;
        }
        const filePath = `locations/${key.toLowerCase()}.html`;
        const href = getExplorerHref(filePath);
        console.log('Navigating to:', href);
        window.location.href = href;
      });
      card.style.cursor = 'pointer';
      console.log('Added click listener to location card:', key);
    }
    
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image}" alt="${key} profile">
        <div class="name-overlay">
          <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
}

/**
 * Backwards compatible function - displays character cards
 */
export function displayCharacters() {
  displayCards('characters', 'characters-grid', 'characters');
}

/**
 * Display character cards for a specific location
 * @param {string} locationName - Name of the location (e.g., 'ProtocolW')
 * @param {string} containerId - HTML element ID where cards should be displayed
 */
export function displayLocationCharacters(locationName, containerId = 'location-characters') {
  console.log('Displaying characters for location:', locationName);
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  
  // Clear existing content
  container.innerHTML = '';
  
  // Get location data
  const locationData = propertiesData.locations[locationName];
  if (!locationData || !locationData.characters || !Array.isArray(locationData.characters)) {
    console.log('No characters found for location:', locationName);
    return;
  }
  
  // Create a grid for character cards
  const grid = document.createElement('div');
  grid.className = 'characters-grid';
  grid.style.marginTop = '20px';
  
  // Display cards for characters in this location
  for (const charName of locationData.characters) {
    const charData = propertiesData.characters[charName];
    if (!charData) {
      console.log('Character data not found:', charName);
      continue;
    }
    
    const card = document.createElement('div');
    card.className = 'character-card card';
    card.dataset.character = charName;
    card.addEventListener('click', () => {
      console.log('Character card clicked:', charName);
      if (typeof window.showCharacterModal === 'function') {
        window.showCharacterModal(charName);
        return;
      }
      const filePath = `characters/${charName.toLowerCase()}.html`;
      window.location.href = getExplorerHref(filePath);
    });
    card.style.cursor = 'pointer';
    
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${charData.image}" alt="${charName} profile">
        <div class="name-overlay">
          <h3>${charName}</h3>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  }
  
  container.appendChild(grid);
}

/**
 * Display location cards
 */
export function displayLocations() {
  displayCards('locations', 'locations-grid', 'locations');
}
