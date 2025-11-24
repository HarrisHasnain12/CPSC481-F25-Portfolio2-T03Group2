// file-b.js
const STORAGE_KEY = 'expo:panels:v1';

// Provide a safe default in case nothing is saved yet
let expo_panels = { panels: [], amenities: [] };

try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
        expo_panels = JSON.parse(json);
    }
  // optional: console.log('Loaded expo_panels', expo_panels);
} catch (err) {
    console.error('Failed to load/parse expo_panels from localStorage:', err);
}

// ...use expo_panels here
