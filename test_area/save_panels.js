// file-a.js
const STORAGE_KEY = 'expo:panels:v1';

// Save your object to localStorage (must be a string)
try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expo_panels));
  // optional: console.log('Saved expo_panels');
} catch (err) {
    console.error('Failed to save expo_panels to localStorage:', err);
}
