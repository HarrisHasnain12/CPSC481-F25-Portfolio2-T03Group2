const STORAGE_KEY = "convention_panels";

document.addEventListener("DOMContentLoaded", () => {
  console.log("showing convention map");

  const colorMap = {
    anime: "red",
    "movie-franchise": "blue",
    restroom: "orange",
    "help-center": "purple",
    "food-court": "green",
  };

  // Map amenity filters to panel IDs
  const amenityIdMap = {
    restroom: ["mens-washroom", "womens-washroom"],
    "help-center": ["help-center"],
    "food-court": ["food-court"],
  };

  const allPanels = Array.from(document.querySelectorAll(".map-panel"));
  const checkboxes = Array.from(
    document.querySelectorAll(".filter-checkbox")
  );

  /**
   * Highlight panels based on the convention_panels JSON in localStorage.
   * - added_to_my_expo === true  -> pink
   * - view_on_map === true       -> yellow (takes precedence)
   */
  function applySavedPanelHighlights() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      console.error(
        "Could not retrieve convention_panels from localStorage."
      );
      return;
    }

    let conventionPanels;
    try {
      conventionPanels = JSON.parse(saved);
    } catch (err) {
      console.error(
        "Error parsing convention_panels from localStorage:",
        err
      );
      return;
    }

    if (!conventionPanels || !Array.isArray(conventionPanels.events)) {
      console.error(
        "convention_panels JSON does not contain a valid 'events' array."
      );
      return;
    }

    conventionPanels.events.forEach((event) => {
      const panelId = event.panel;
      if (!panelId) return;

      const panelEl = document.getElementById(panelId);
      if (!panelEl) return;

      // added_to_my_expo -> pink
      if (event.added_to_my_expo === true) {
        panelEl.classList.add("my-expo-highlight");
      }

      // view_on_map -> yellow (can coexist, but CSS makes yellow win)
      if (event.view_on_map === true) {
        panelEl.classList.add("view-on-map-highlight");
      }
    });
  }

  function resetHighlights() {
    allPanels.forEach((panel) => {
      // Reset *filter* highlights (inline styles + is-highlighted class)
      panel.style.backgroundColor = "";
      panel.classList.remove("is-highlighted");
      // NOTE: we intentionally do NOT remove my-expo-highlight or
      //       view-on-map-highlight so the saved state persists.
    });
  }

  function applyFilters() {
    resetHighlights();

    // Get all checked filters
    const activeFilters = checkboxes
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    if (activeFilters.length === 0) {
      // No filters selected → just show saved My Expo / view_on_map highlights
      applySavedPanelHighlights();
      return;
    }

    activeFilters.forEach((filterValue) => {
      const color = colorMap[filterValue];
      if (!color) return;

      // Event filters: match by class (anime, movie-franchise)
      if (filterValue === "anime" || filterValue === "movie-franchise") {
        const matchingPanels = document.querySelectorAll(
          `.map-panel.${filterValue}`
        );
        matchingPanels.forEach((panel) => {
          panel.style.backgroundColor = color;
          panel.classList.add("is-highlighted");
        });
      } else {
        // Amenity filters: match by ID(s)
        const ids = amenityIdMap[filterValue] || [];
        ids.forEach((id) => {
          const panel = document.getElementById(id);
          if (panel) {
            panel.style.backgroundColor = color;
            panel.classList.add("is-highlighted");
          }
        });
      }
    });

    // When filters are active, their inline colors override the saved ones.
    // When user clears all filters, applyFilters() will be called again,
    // see the early return above which re-applies saved highlights.
  }

  // Wire up filter change listeners
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", applyFilters);
  });

  // Initial load: apply highlights based on saved convention_panels
  applySavedPanelHighlights();

  // NEW: when the map page loads, clear all view_on_map flags in storage
  // so that "View on Map" highlights only once (on the first load
  // after clicking the button).
  (function resetViewOnMapFlags() {
    // 1. Load the convention_panels JSON object from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      console.error(
        "Could not retrieve convention_panels from localStorage when resetting view_on_map flags."
      );
      // If it can't be found, don't perform the following steps
      return;
    }

    let panelsData;
    try {
      panelsData = JSON.parse(saved);
    } catch (err) {
      console.error(
        "Error parsing convention_panels when resetting view_on_map flags:",
        err
      );
      return;
    }

    if (!panelsData || !Array.isArray(panelsData.events)) {
      console.error(
        "convention_panels JSON does not contain a valid 'events' array when resetting view_on_map flags."
      );
      return;
    }

    // 2. Set view_on_map = false for all events
    panelsData.events.forEach((event) => {
      event.view_on_map = false;
    });

    // 3. Save convention_panels back to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(panelsData));
    } catch (err) {
      console.error(
        "Failed to save convention_panels after resetting view_on_map flags:",
        err
      );
    }
  })();
});
