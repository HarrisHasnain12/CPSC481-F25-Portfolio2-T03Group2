const STORAGE_KEY = "convention_panels";

// Helper: load panels.json and save it to localStorage
async function loadPanelsFromFile() {
  try {
    const response = await fetch("panels.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // this is your JSON from panels.json
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    console.log("Saved default convention_panels from panels.json:", data);
    console.log("name of first event:", data.events[0].name);
    return data;
  } catch (err) {
    console.error("Failed to load panels.json:", err);
    return null;
  }
}

// Helper: ensure convention_panels exists in localStorage, then log it
async function ensureConventionPanels() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    // 1 & 2. It exists → parse and log it
    try {
      const conventionPanels = JSON.parse(saved);
      console.log("Loaded convention_panels from localStorage:", conventionPanels);
      console.log("name of first event:", conventionPanels.events[0].name);
      return conventionPanels;
    } catch (err) {
      console.error("Error parsing convention_panels from localStorage, reloading from file:", err);
      localStorage.removeItem(STORAGE_KEY);
      return await loadPanelsFromFile();
    }
  } else {
    // 3. It does not exist → load from panels.json, save, then log
    return await loadPanelsFromFile();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("home page loaded");
  ensureConventionPanels(); // run the logic when the home page loads

    // DELETE button logic
  const deleteBtn = document.getElementById("delete-panels-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      console.log("⚠️ Deleted convention_panels from localStorage");
      alert("Saved convention panel data has been deleted!");
    });
  }
});
