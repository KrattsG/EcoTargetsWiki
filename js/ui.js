/* ========================
   UI BUILDING & RENDERING
   ======================== */

import { propertiesData } from './config.js';

/**
 * Build file tree in explorer sidebar
 */
export function buildFileTree() {
  const tree = document.getElementById('file-tree');
  if (!tree) return;
  tree.innerHTML = '';

  for (const [folder, files] of Object.entries(propertiesData)) {
    const folderLi = document.createElement('li');
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder open';
    folderDiv.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
    folderDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      folderDiv.classList.toggle('open');
      folderDiv.nextElementSibling?.classList.toggle('open');
    });
    folderLi.appendChild(folderDiv);

    const nestedUl = document.createElement('ul');
    nestedUl.className = 'nested open';

    for (const [fileKey, props] of Object.entries(files)) {
      const filePath = `${folder}/${fileKey.toLowerCase()}.html`;
      const fileLi = document.createElement('li');
      const fileLink = document.createElement('a');
      fileLink.className = 'file';
      fileLink.href = `#/explorer/${filePath}`;
      fileLink.textContent = fileKey.charAt(0).toUpperCase() + fileKey.slice(1);
      fileLink.dataset.path = filePath;
      fileLi.appendChild(fileLink);
      nestedUl.appendChild(fileLi);
    }

    folderLi.appendChild(nestedUl);
    tree.appendChild(folderLi);
  }
}

/**
 * Initialize map markers on map page
 */
export function initMap() {
  const markersDiv = document.getElementById('map-markers');
  if (!markersDiv || window.mapInstance) return;

  markersDiv.innerHTML = '';

  // Add markers for locations from properties.json
  if (propertiesData.locations) {
    for (const [key, location] of Object.entries(propertiesData.locations)) {
      if (location.position && location.position.x !== undefined && location.position.y !== undefined) {
        const marker = document.createElement('a');
        marker.href = `#/explorer/locations/${key.toLowerCase()}.html`;
        marker.style.position = 'absolute';
        marker.style.left = `${location.position.x}%`;
        marker.style.top = `${location.position.y}%`;
        marker.style.transform = 'translate(-50%, -50%)';
        marker.style.zIndex = '10';
        marker.title = key;
        
        const markerElement = document.createElement('div');
        markerElement.style.background = '#e74c3c';
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.cursor = 'pointer';
        markerElement.style.border = '2px solid #fff';
        markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        markerElement.title = key;
        
        marker.appendChild(markerElement);
        markersDiv.appendChild(marker);
      }
    }
  }

  window.mapInstance = true;
}
