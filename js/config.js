/* ========================
   GLOBAL STATE & CONFIG
   ======================== */

// Detect base path for GitHub Pages support
export const BASE_PATH = (() => {
  const pathname = window.location.pathname;
  if (pathname.includes('EcoTargets')) {
    return '/EcoTargets';
  }
  return '';
})();

export let propertiesData = {};
export let fileSystem = {};

/**
 * Load properties data from JSON file
 */
export async function loadProperties() {
  try {
    const url = BASE_PATH + '/properties.json';
    const response = await fetch(url);
    propertiesData = await response.json();
    return propertiesData;
  } catch (error) {
    console.error('Error loading properties.json:', error);
    throw error;
  }
}
