/* ========================
   SEARCH AND FILTER FUNCTIONALITY
   ======================== */

import { propertiesData } from './config.js';
import { displayCards } from './cards.js';

let currentSearchTerm = '';
let currentTagFilter = '';
let currentLocationFilter = '';

/**
 * Initialize search functionality
 */
export function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const tagFilter = document.getElementById('tag-filter');
  const locationFilter = document.getElementById('location-filter');
  const searchStats = document.getElementById('search-stats');

  if (!searchInput || !tagFilter || !locationFilter) return;

  // Populate filter dropdowns
  populateFilterDropdowns();

  // Search input event listeners
  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    
    // Show/hide clear button
    const clearBtn = document.getElementById('search-clear');
    if (currentSearchTerm) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
    
    applyFilters();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    currentSearchTerm = '';
    searchClear.classList.remove('visible');
    applyFilters();
  });

  // Filter dropdown event listeners
  tagFilter.addEventListener('change', (e) => {
    currentTagFilter = e.target.value;
    applyFilters();
  });

  locationFilter.addEventListener('change', (e) => {
    currentLocationFilter = e.target.value;
    applyFilters();
  });
}

/**
 * Populate filter dropdowns with available options
 */
function populateFilterDropdowns() {
  const tagFilter = document.getElementById('tag-filter');
  const locationFilter = document.getElementById('location-filter');

  if (!tagFilter || !locationFilter) return;

  // Collect all unique tags
  const allTags = new Set();
  const allLocations = new Set();

  // Get tags from characters
  if (propertiesData.characters) {
    Object.values(propertiesData.characters).forEach(character => {
      if (character.tags && Array.isArray(character.tags)) {
        character.tags.forEach(tag => allTags.add(tag));
      }
      if (character.location) {
        allLocations.add(character.location);
      }
    });
  }

  // Get tags from locations
  if (propertiesData.locations) {
    Object.keys(propertiesData.locations).forEach(location => {
      allLocations.add(location);
      const locationData = propertiesData.locations[location];
      if (locationData.tags && Array.isArray(locationData.tags)) {
        locationData.tags.forEach(tag => allTags.add(tag));
      }
    });
  }

  // Populate tag filter
  Array.from(allTags).sort().forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
    tagFilter.appendChild(option);
  });

  // Populate location filter
  Array.from(allLocations).sort().forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationFilter.appendChild(option);
  });
}

/**
 * Apply all current filters and search
 */
function applyFilters() {
  // Filter characters
  const filteredCharacters = filterItems('characters');
  displayFilteredItems('characters', filteredCharacters);

  // Filter locations
  const filteredLocations = filterItems('locations');
  displayFilteredItems('locations', filteredLocations);
  
  // Update search statistics
  updateSearchStats(filteredCharacters, filteredLocations);
}

/**
 * Update search statistics display
 */
function updateSearchStats(filteredCharacters, filteredLocations) {
  const searchStats = document.getElementById('search-stats');
  if (!searchStats) return;
  
  const totalCharacters = Object.keys(filteredCharacters).length;
  const totalLocations = Object.keys(filteredLocations).length;
  const totalResults = totalCharacters + totalLocations;
  
  if (currentSearchTerm || currentTagFilter || currentLocationFilter) {
    if (totalResults === 0) {
      searchStats.textContent = 'No results found';
      searchStats.className = 'search-stats';
    } else {
      const parts = [];
      if (totalCharacters > 0) parts.push(`${totalCharacters} character${totalCharacters !== 1 ? 's' : ''}`);
      if (totalLocations > 0) parts.push(`${totalLocations} location${totalLocations !== 1 ? 's' : ''}`);
      
      searchStats.textContent = `Found: ${parts.join(', ')}`;
      searchStats.className = 'search-stats active';
    }
  } else {
    searchStats.textContent = '';
    searchStats.className = 'search-stats';
  }
}

/**
 * Filter items based on current search and filter criteria
 */
function filterItems(category) {
  if (!propertiesData[category]) return {};

  const items = propertiesData[category];
  const filtered = {};

  for (const [key, item] of Object.entries(items)) {
    let matchesSearch = true;
    let matchesTag = true;
    let matchesLocation = true;

    // Search filter
    if (currentSearchTerm) {
      const searchText = `${key} ${item.description || ''} ${item.author || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
      matchesSearch = searchText.includes(currentSearchTerm);
    }

    // Tag filter
    if (currentTagFilter && category === 'characters') {
      matchesTag = item.tags && item.tags.includes(currentTagFilter);
    } else if (currentTagFilter && category === 'locations') {
      matchesTag = item.tags && item.tags.includes(currentTagFilter);
    }

    // Location filter (only applies to characters)
    if (currentLocationFilter && category === 'characters') {
      matchesLocation = item.location === currentLocationFilter;
    }

    if (matchesSearch && matchesTag && matchesLocation) {
      filtered[key] = item;
    }
  }

  return filtered;
}

/**
 * Display filtered items with highlighting
 */
function displayFilteredItems(category, filteredItems) {
  const gridId = category === 'characters' ? 'characters-grid' : 'locations-grid';
  const grid = document.getElementById(gridId);
  
  if (!grid) return;

  grid.innerHTML = '';

  if (Object.keys(filteredItems).length === 0) {
    grid.innerHTML = '<div class="no-results">No results found</div>';
    return;
  }

  displayCards(category, gridId, category, null, false, filteredItems);

  // Add search highlighting if there's a search term
  if (currentSearchTerm) {
    addSearchHighlighting(grid);
  }
}

/**
 * Add highlighting to search results
 */
function addSearchHighlighting(container) {
  const cards = container.querySelectorAll('.card');
  cards.forEach(card => {
    const textElements = card.querySelectorAll('h3, p');
    textElements.forEach(element => {
      const text = element.textContent;
      const regex = new RegExp(`(${currentSearchTerm})`, 'gi');
      if (regex.test(text)) {
        element.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
      }
    });
  });
}
