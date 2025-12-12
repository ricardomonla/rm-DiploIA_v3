// Browser-compatible data persistence using localStorage with JSON structure
// This provides a more organized approach than the current per-video localStorage

const STORAGE_KEY = 'rmDiploIA_appData';

// Load the complete app data from localStorage
const loadAppData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading app data:', error);
  }
  
  // Return default structure if no data exists
  return {
    lastVideoUrl: '',
    lastVideoId: '',
    videos: {}
  };
};

// Save the complete app data to localStorage
const saveAppData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('App data saved successfully');
  } catch (error) {
    console.error('Error saving app data:', error);
  }
};

// Save annotations for a specific video
export const saveVideoAnnotations = (videoId, annotations) => {
  const appData = loadAppData();
  appData.videos[videoId] = annotations;
  saveAppData(appData);
};

// Load annotations for a specific video
export const loadVideoAnnotations = (videoId) => {
  const appData = loadAppData();
  return appData.videos[videoId] || [];
};

// Save the last video information
export const saveLastVideo = (videoUrl, videoId) => {
  const appData = loadAppData();
  appData.lastVideoUrl = videoUrl;
  appData.lastVideoId = videoId;
  saveAppData(appData);
};

// Load the last video information
export const loadLastVideo = () => {
  const appData = loadAppData();
  return {
    url: appData.lastVideoUrl,
    id: appData.lastVideoId
  };
};

// Export complete app data (for backup/export functionality)
export const exportAppData = () => {
  const appData = loadAppData();
  return JSON.stringify(appData, null, 2);
};

// Import complete app data (for restore/import functionality)
export const importAppData = (data) => {
  try {
    const parsedData = JSON.parse(data);
    if (parsedData && typeof parsedData === 'object') {
      saveAppData(parsedData);
      return true;
    }
  } catch (error) {
    console.error('Error importing app data:', error);
    return false;
  }
  return false;
};