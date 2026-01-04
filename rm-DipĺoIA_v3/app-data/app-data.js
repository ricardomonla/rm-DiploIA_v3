// app-data.js - Versioning utility functions for key files
// This file provides functions to work with the app-data.json file
// for individual file versioning and overall app versioning
// It also integrates with app-version.js for global version management

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DATA_PATH = path.join(__dirname, 'app-data.json');
const APP_VERSION_PATH = path.join(__dirname, 'app-version.js');

// Load app data from JSON file
async function loadAppData() {
  try {
    const data = await fs.readFile(APP_DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default structure
      return {
        keyFiles: [],
        appVersion: '1.0.0',
        lastUpdated: null
      };
    }
    console.error('Error loading app data:', error);
    throw error;
  }
}

// Save app data to JSON file
async function saveAppData(data) {
  try {
    await fs.writeFile(APP_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving app data:', error);
    return false;
  }
}

// Get all key files
async function getKeyFiles() {
  const data = await loadAppData();
  return data.keyFiles || [];
}

// Get a specific key file by ID
async function getKeyFileById(id) {
  const keyFiles = await getKeyFiles();
  return keyFiles.find(file => file.id === id);
}

// Update file version
async function updateFileVersion(id, newVersion) {
  const data = await loadAppData();
  const file = data.keyFiles.find(file => file.id === id);
  
  if (file) {
    file.version = newVersion;
    file.lastModified = new Date().toISOString();
    data.lastUpdated = new Date().toISOString();
    
    // Update app version based on file versions
    // Simple logic: app version follows the highest file version
    const versions = data.keyFiles.map(f => parseFloat(f.version));
    data.appVersion = `v${Math.max(...versions)}.0.0`;
    
    const success = await saveAppData(data);
    
    // Also update the global app version in app-version.js
    if (success) {
      await updateGlobalAppVersion(data.appVersion.replace('v', ''));
    }
    
    return success;
  }
  
  return false;
}

// Get current app version
async function getAppVersion() {
  const data = await loadAppData();
  return data.appVersion || '1.0.0';
}

// Update global app version in app-version.js
async function updateGlobalAppVersion(newVersion) {
  try {
    // Read the current app-version.js file
    let content = await fs.readFile(APP_VERSION_PATH, 'utf-8');
    
    // Update APP_VERSION constant
    const versionRegex = /const APP_VERSION = "\d+\.\d+\.\d+";/;
    content = content.replace(versionRegex, `const APP_VERSION = "${newVersion}";`);
    
    // Update version in header comment
    const headerRegex = /\/\/ {2}Version: {5}\d+\.\d+\.\d+/;
    content = content.replace(headerRegex, `//  Version:     ${newVersion}`);
    
    // Update date in header comment
    const dateRegex = /\/\/ {2}Date: {8}\d{4}-\d{2}-\d{2}/;
    const currentDate = new Date().toISOString().split('T')[0];
    content = content.replace(dateRegex, `//  Date:        ${currentDate}`);
    
    // Write the updated content back to the file
    await fs.writeFile(APP_VERSION_PATH, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error updating global app version:', error);
    return false;
  }
}

// Initialize app data with default key files if empty
async function initializeAppData() {
  const data = await loadAppData();
  
  if (data.keyFiles.length === 0) {
    // Set default key files
    data.keyFiles = [
      {
        id: 'package-json',
        path: 'package.json',
        type: 'configuration',
        description: 'Core configuration and dependencies',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'vite-config',
        path: 'vite.config.js',
        type: 'configuration',
        description: 'Build configuration',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'main-jsx',
        path: 'src/main.jsx',
        type: 'entry-point',
        description: 'Application entry point',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'app-jsx',
        path: 'src/App.jsx',
        type: 'component',
        description: 'Main application component',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'data-persistence',
        path: 'src/dataPersistence.js',
        type: 'logic',
        description: 'Data storage and retrieval logic',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'rm-vertical-scrubber',
        path: 'src/components/rmVerticalScrubber.jsx',
        type: 'component',
        description: 'Core UI component for video scrubbing',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'index-html',
        path: 'index.html',
        type: 'entry-point',
        description: 'HTML entry point',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'app-css',
        path: 'src/App.css',
        type: 'styles',
        description: 'Main application styles',
        version: '1.0.0',
        lastModified: null
      },
      {
        id: 'rm-vertical-scrubber-css',
        path: 'src/components/rmVerticalScrubber.css',
        type: 'styles',
        description: 'Component-specific styles',
        version: '1.0.0',
        lastModified: null
      }
    ];
    
    data.lastUpdated = new Date().toISOString();
    return await saveAppData(data);
  }
  
  return true;
}

// Export the functions for use in other parts of the application
export {
  getKeyFiles,
  getKeyFileById,
  updateFileVersion,
  getAppVersion,
  initializeAppData,
  updateGlobalAppVersion
};