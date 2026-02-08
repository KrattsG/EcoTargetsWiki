/* ========================
   POPUP IFRAME FUNCTIONALITY
   ======================== */

let ctrlPressed = false;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let currentPopupPath = null;

/**
 * Initialize popup iframe for Ctrl+hover preview
 */
export function initPopup() {
  const popup = document.getElementById('popup-iframe');
  const closeBtn = document.getElementById('popup-close');
  
  // Make popup draggable
  popup.addEventListener('mousedown', (e) => {
    // Only drag from the header area (top 30px)
    if (e.clientY - popup.getBoundingClientRect().top < 30) {
      isDragging = true;
      dragOffsetX = e.clientX - popup.getBoundingClientRect().left;
      dragOffsetY = e.clientY - popup.getBoundingClientRect().top;
      popup.style.cursor = 'grabbing';
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      popup.style.left = (e.clientX - dragOffsetX) + 'px';
      popup.style.top = (e.clientY - dragOffsetY) + 'px';
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    popup.style.cursor = 'default';
  });
  
  // Handle Escape key to close popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hidePopup();
    }
  });
  
  // Use delegation on document for all mouseover events
  document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'A') {
      // Check ctrlKey directly from the event
      const isCtrlHeld = e.ctrlKey || e.metaKey;
      
      if (isCtrlHeld) {
        const href = e.target.getAttribute('href');
        if (href) {
          let path = href;
          // Handle hash-based routing (#/explorer/...)
          if (href.includes('#/explorer/')) {
            path = href.replace('#/explorer/', '');
          }
          showPopup(path, e.clientX, e.clientY);
        }
      }
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'A' && !(e.ctrlKey || e.metaKey)) {
      hidePopup();
    }
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', hidePopup);
  }
}

/**
 * Show popup with preview of a file
 */
function showPopup(path, x, y) {
  const popup = document.getElementById('popup-iframe');
  const iframe = document.getElementById('popup-iframe-content');
  
  // Only load if it's a different file or popup is hidden
  if (currentPopupPath !== path) {
    popup.style.left = `${x}px`;
    popup.style.top = `${y + 10}px`;
    popup.style.display = 'block';
    
    currentPopupPath = path;
    iframe.src = path;
    
    // Apply zoom after iframe loads
    iframe.onload = function() {
      try {
        if (iframe.contentDocument) {
          iframe.contentDocument.body.style.zoom = '50%';
        }
      } catch (e) {
        console.log('Could not set zoom on iframe:', e);
      }
    };
  } else {
    // Same file, just update position
    popup.style.left = `${x}px`;
    popup.style.top = `${y + 10}px`;
  }
}

/**
 * Hide popup iframe
 */
function hidePopup() {
  document.getElementById('popup-iframe').style.display = 'none';
  currentPopupPath = null;
}
