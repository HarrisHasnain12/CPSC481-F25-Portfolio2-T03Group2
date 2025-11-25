document.addEventListener("DOMContentLoaded", () => {
  console.log("showing convention map");

  const colorMap = {
    anime: "red",
    "movie-franchise": "blue",
    restroom: "orange",
    "help-center": "yellow",
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

  function resetHighlights() {
    allPanels.forEach((panel) => {
      // Reset inline styles so CSS background comes back
      panel.style.backgroundColor = "";
      panel.classList.remove("is-highlighted");
    });
  }

  function applyFilters() {
    resetHighlights();

    // Get all checked filters
    const activeFilters = checkboxes
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    if (activeFilters.length === 0) {
      return; // nothing selected → no highlighting
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
  }

  // Re-apply whenever a checkbox changes
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", applyFilters);
  });
});
