/* ========================
   CARD SHOWCASE
   ======================== */

import { propertiesData } from './config.js';

/**
 * Display cards for a specific category
 * @param {string} category - 'characters', 'locations', etc.
 * @param {string} gridId - HTML element ID for the grid
 * @param {string} hrefBase - Base path for links (e.g., 'characters', 'locations')
 * @param {string} filterByLocation - Optional location name to filter characters by (e.g., 'ProtocolW')
 */
export function displayCards(category = 'characters', gridId = 'characters-grid', hrefBase = null, filterByLocation = null) {
  const grid = document.getElementById(gridId);
  if (!grid || !propertiesData[category]) return;
  grid.innerHTML = '';

  // Default href base matches category
  const basePath = hrefBase || category;

  let itemsToDisplay = propertiesData[category];

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
    const link = document.createElement('a');
    link.href = `#/explorer/${basePath}/${key.toLowerCase()}.html`;
    link.style.textDecoration = 'none';

    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image}" alt="${key} profile">
        <div class="name-overlay">
          <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
        </div>
      </div>
    `;

    link.appendChild(card);
    grid.appendChild(link);
  }
}

/**
 * Backwards compatible function - displays character cards
 */
export function displayCharacters() {
  displayCards('characters', 'characters-grid', 'characters');
}
