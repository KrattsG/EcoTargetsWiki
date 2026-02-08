/* ========================
   GLOBAL STATE & CONFIG
   ======================== */

export let propertiesData = {};
export let fileSystem = {};

/**
 * Load properties data from JSON file
 */
export async function loadProperties() {
  try {
    const response = await fetch('properties.json');
    propertiesData = await response.json();
    return propertiesData;
  } catch (error) {
    console.error('Error loading properties.json:', error);
    throw error;
  }
}
