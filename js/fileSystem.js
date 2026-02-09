/* ========================
   FILE SYSTEM MANAGEMENT
   ======================== */

import { propertiesData, fileSystem, BASE_PATH } from './config.js';
import { displayLocationCharacters } from './cards.js';

function getExplorerMainElement() {
  return document.querySelector('#explorer .main') || document.querySelector('main.main');
}

/**
 * Build file system map for quick lookups
 * Format: "folder/filename.html" -> { key, props, folder }
 */
export function buildFileSystem() {
  for (const [folder, files] of Object.entries(propertiesData)) {
    for (const [fileKey, props] of Object.entries(files)) {
      const path = `${folder}/${fileKey.toLowerCase()}.html`;
      fileSystem[path] = { key: fileKey, props: props, folder: folder };
    }
  }
}

/**
 * Load and display a file from file system
 */
export async function loadAndDisplayFile(filePath) {
  const fileInfo = fileSystem[filePath];
  
  if (!fileInfo) {
    console.error('File not found in system:', filePath);
    showError('File not found');
    return;
  }

  // Display content directly from properties data instead of loading external files
  displayContent(filePath, fileInfo.key, fileInfo.props, fileInfo.folder);
  updateActiveFile(filePath);
}

/**
 * Display file content in explorer main area
 */
async function displayContent(filePath, title, props, folder) {
  console.log('displayContent called with:', { filePath, title, folder, props });
  
  const main = getExplorerMainElement();
  if (!main) {
    console.error('Explorer main element not found!');
    return;
  }
  
  console.log('Explorer main element found:', main);
  
  let content = '';
  
  if (folder === 'characters') {
    console.log('Generating character content for:', title);
    // Generate character content
    const skills = Array.isArray(props.skills) ? props.skills.join(', ') : 'None';
    const tags = Array.isArray(props.tags) ? props.tags.join(', ') : 'None';
    
    content = `
      <div class="character-profile">
        <div class="profile-header">
          <div class="profile-image-container">
            <img src="${props.image || ''}" alt="${title}">
          </div>
          <div>
            <h2>${title}</h2>
            <p class="author">Created by: ${props.author || 'Unknown'}</p>
          </div>
        </div>
        <div class="profile-details">
          <div class="detail-section">
            <h3>Description</h3>
            <p>${props.description || 'No description available.'}</p>
          </div>
          <div class="detail-section">
            <h3>Location</h3>
            <p>${props.location || 'Unknown'}</p>
          </div>
          <div class="detail-section">
            <h3>Skills</h3>
            <p>${skills}</p>
          </div>
          <div class="detail-section">
            <h3>Tags</h3>
            <p>${tags}</p>
          </div>
        </div>
      </div>
    `;
  } else if (folder === 'locations') {
    console.log('Generating location content for:', title);
    // Generate location content
    const characters = Array.isArray(props.characters) ? props.characters.join(', ') : 'None';
    const tags = Array.isArray(props.tags) ? props.tags.join(', ') : 'None';
    
    content = `
      <div class="location-profile">
        <div class="profile-header">
          <div class="profile-image-container">
            <img src="${props.image || ''}" alt="${title}">
          </div>
          <div>
            <h2>${title}</h2>
            <p class="author">Created by: ${props.author || 'Unknown'}</p>
          </div>
        </div>
        <div class="profile-details">
          <div class="detail-section">
            <h3>Description</h3>
            <p>${props.description || 'No description available.'}</p>
          </div>
          <div class="detail-section">
            <h3>Tags</h3>
            <p>${tags}</p>
          </div>
          <div class="detail-section">
            <h3>Position</h3>
            <p>X: ${props.position?.x || 'Unknown'}, Y: ${props.position?.y || 'Unknown'}</p>
          </div>
        </div>
      </div>
    `;
  } else {
    console.log('Unknown folder type:', folder);
    content = `<p>Unknown content type: ${folder}</p>`;
  }
  
  const tags = Array.isArray(props.tags) ? props.tags.filter(t => t).join(', ') : '';
  
  const finalHTML = `
    <h1>${title}</h1>
    <div class="properties">
      <p><strong>Type:</strong> ${props.type || '—'}</p>
      <p><strong>Author:</strong> ${props.author || '—'}</p>
      <p><strong>Tags:</strong> ${tags || '—'}</p>
    </div>
    <div class="file-content">
      ${content}
    </div>
    <div class="additional-content">
      <div id="file-html-content"></div>
    </div>
    <div id="location-characters"></div>
  `;
  
  console.log('Setting innerHTML with length:', finalHTML.length);
  main.innerHTML = finalHTML;
  
  // Load and display the HTML file content
  try {
    const response = await fetch(`${BASE_PATH}/${filePath}`);
    if (response.ok) {
      const fileContent = await response.text();
      const contentDiv = document.getElementById('file-html-content');
      if (contentDiv) {
        contentDiv.innerHTML = fileContent;
      }
    }
  } catch (error) {
    console.log('Could not load file content for:', title);
  }
  
  // If this is a location, display character cards
  if (folder === 'locations' && props.characters && Array.isArray(props.characters)) {
    console.log('Displaying character cards for location:', title);
    setTimeout(() => {
      displayLocationCharacters(title, 'location-characters');
    }, 100);
  }
  
  console.log('Content set successfully');
  console.log('Explorer main element styles:', window.getComputedStyle(main));
  console.log('Explorer main element visibility:', main.style.display);
  console.log('Explorer main element opacity:', main.style.opacity);
}

/**
 * Display error message in explorer
 */
export function showError(message) {
  const main = getExplorerMainElement();
  if (main) {
    main.innerHTML = `<p style="color: #e74c3c;">${message}</p>`;
  }
}

/**
 * Highlight the currently active file in the tree
 */
function updateActiveFile(filePath) {
  document.querySelectorAll('.file').forEach(file => {
    file.classList.remove('active');
    if (file.dataset.path === filePath) {
      file.classList.add('active');
    }
  });
}
