/* ========================
   GLOBAL STATE & CONFIG
   ======================== */

// Detect base path for GitHub Pages support
export const BASE_PATH = (() => {
  const { hostname, pathname } = window.location;
  const match = pathname.match(/^\/([^\/]+)/);
  const firstSegment = match ? match[1] : '';

  // GitHub Pages project site: https://<user>.github.io/<repo>/...
  if (hostname.endsWith('github.io')) {
    return firstSegment ? `/${firstSegment}` : '';
  }

  // Non-GitHub hosting (localhost/custom domain): treat the site as rooted at '/'
  // so subpages like '/locations/...' still load '/properties.json'.
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
