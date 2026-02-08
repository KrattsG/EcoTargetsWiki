/* ========================
   FILE SYSTEM MANAGEMENT
   ======================== */

import { propertiesData, fileSystem, BASE_PATH } from './config.js';

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
 * Load and display a file from the file system
 */
export async function loadAndDisplayFile(filePath) {
  const fileInfo = fileSystem[filePath];
  
  if (!fileInfo) {
    console.error('File not found in system:', filePath);
    showError('File not found');
    return;
  }

  try {
    const url = BASE_PATH + '/' + filePath;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const content = await response.text();
    displayContent(fileInfo.key, content, fileInfo.props);
    updateActiveFile(filePath);
  } catch (error) {
    console.error('Error loading file:', error);
    showError(`Error loading ${fileInfo.key}`);
  }
}

/**
 * Display file content in the explorer main area
 */
function displayContent(title, content, props) {
  const main = document.querySelector("#explorer .main");
  if (!main) return;

  const iframeId = 'content-iframe-' + Date.now();
  const tags = Array.isArray(props.tags) ? props.tags.filter(t => t).join(', ') : '';
  
  main.innerHTML = `
    <h1>${title}</h1>
    <div class="properties">
      <p><strong>Type:</strong> ${props.type || '—'}</p>
      <p><strong>Author:</strong> ${props.author || '—'}</p>
      <p><strong>Tags:</strong> ${tags || '—'}</p>
    </div>
    <div class="file-content">
      <iframe id="${iframeId}" style="width: 100%; min-height: 1000px; border: none; border-radius: 8px;"></iframe>
    </div>
  `;
  
  // Write content to iframe
  const iframe = document.getElementById(iframeId);
  if (iframe && iframe.contentDocument) {
    iframe.contentDocument.open();
    iframe.contentDocument.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            margin: 16px; 
            font-family: Inter, system-ui, sans-serif;
            color: #e0e6ff;
            line-height: 1.8;
            font-size: 16px;
            background: #0f1115;
          }
          p { 
            color: #e0e6ff;
            line-height: 1.8;
            margin: 12px 0;
          }
          a {
            color: #8a9eff;
            text-decoration: underline;
          }
          a:hover {
            color: #b0c4ff;
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    iframe.contentDocument.close();
  }
}

/**
 * Display error message in explorer
 */
export function showError(message) {
  const main = document.querySelector("#explorer .main");
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
