/* ========================
   GLOBAL STATE & CONFIG
   ======================== */

// Detect base path for GitHub Pages support
export const BASE_PATH = (() => {
  const pathname = window.location.pathname;
  // Extract the repository name from pathname
  // e.g., /EcoTargetsWiki/ or /EcoTargets/ -> return /EcoTargetsWiki or /EcoTargets
  const match = pathname.match(/^\/([^\/]+)/);
  if (match) {
    const repoName = match[1];
    // Only return base path if it looks like a repo name (not empty, not root)
    if (repoName && repoName !== 'index.html') {
      return '/' + repoName;
    }
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
