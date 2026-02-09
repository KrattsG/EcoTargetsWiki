/* ========================
   UI BUILDING & RENDERING
   ======================== */

import { propertiesData, BASE_PATH } from './config.js';

function isSpaMode() {
  return document.querySelectorAll('.page').length > 0;
}

function getExplorerHref(filePath) {
  const hash = `#/explorer/${filePath}`;
  return isSpaMode() ? hash : `${BASE_PATH}/explorer.html${hash}`;
}

function getOrCreateMarkerHoverCard() {
  let card = document.getElementById('marker-hover-card');
  if (card) return card;

  card = document.createElement('div');
  card.id = 'marker-hover-card';
  card.style.cssText = [
    'position: fixed',
    'display: none',
    'z-index: 1500',
    'min-width: 220px',
    'max-width: 320px',
    'background: #141821',
    'border: 1px solid rgba(138, 143, 163, 0.25)',
    'border-radius: 10px',
    'box-shadow: 0 10px 30px rgba(0,0,0,0.45)',
    'padding: 12px',
    'color: #e8eeff',
    'pointer-events: auto'
  ].join(';');

  document.body.appendChild(card);
  return card;
}

function setHoverCardPosition(card, clientX, clientY) {
  const margin = 12;
  const rect = card.getBoundingClientRect();
  let x = clientX + margin;
  let y = clientY + margin;

  if (x + rect.width > window.innerWidth - margin) {
    x = clientX - rect.width - margin;
  }
  if (y + rect.height > window.innerHeight - margin) {
    y = clientY - rect.height - margin;
  }

  card.style.left = `${Math.max(margin, x)}px`;
  card.style.top = `${Math.max(margin, y)}px`;
}

function renderLocationCharactersHover(card, locationKey, locationData) {
  const characterNames = Array.isArray(locationData.characters) ? locationData.characters : [];

  const items = characterNames
    .map((name) => {
      const character = propertiesData.characters?.[name];
      const img = character?.image || '';
      const href = getExplorerHref(`characters/${String(name).toLowerCase()}.html`);
      return `
        <a href="${href}" style="display:flex;align-items:center;gap:10px;padding:6px 0;border-top:1px solid rgba(138, 143, 163, 0.12);text-decoration:none;">
          <div style="width:34px;height:34px;border-radius:8px;overflow:hidden;background:rgba(138,143,163,0.12);flex:0 0 auto;">
            <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          </div>
          <div style="font-size:13px;line-height:1.2;color:#e8eeff;">${name}</div>
        </a>
      `;
    })
    .join('');

  card.innerHTML = `
    <div style="font-weight:700;color:#8a9eff;margin-bottom:6px;">${locationKey}</div>
    <div style="font-size:12px;color:#a8b0d1;margin-bottom:8px;">Characters</div>
    <div>${items || '<div style="font-size:13px;color:#8a92b2;">No characters listed</div>'}</div>
  `;
}

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
      fileLink.href = getExplorerHref(filePath);
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
        marker.href = getExplorerHref(`locations/${key.toLowerCase()}.html`);
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

        const hoverCard = getOrCreateMarkerHoverCard();
        let hideTimer = null;

        const show = (e) => {
          if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
          }
          renderLocationCharactersHover(hoverCard, key, location);
          hoverCard.style.display = 'block';
          setHoverCardPosition(hoverCard, e.clientX, e.clientY);
        };

        const move = (e) => {
          if (hoverCard.style.display === 'block') {
            setHoverCardPosition(hoverCard, e.clientX, e.clientY);
          }
        };

        const scheduleHide = () => {
          if (hideTimer) clearTimeout(hideTimer);
          hideTimer = setTimeout(() => {
            hoverCard.style.display = 'none';
          }, 120);
        };

        marker.addEventListener('mouseenter', show);
        marker.addEventListener('mousemove', move);
        marker.addEventListener('mouseleave', scheduleHide);

        hoverCard.addEventListener('mouseenter', () => {
          if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
          }
        });
        hoverCard.addEventListener('mouseleave', scheduleHide);
      }
    }
  }

  window.mapInstance = true;
}
