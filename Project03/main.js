// Define the showView function
function showView(viewId) {
  // Hide all views
  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active");
  });

  // Show the selected view
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add("active");
    console.log(`Switched to view: ${viewId}`);
  } else {
    console.error(`View with ID '${viewId}' not found.`);
    return;
  }

  // Hide the homepage overlay when not on the homepage
  const homepage = document.getElementById("homepage");
  const overlay = document.getElementById("homepage-overlay");
  if (homepage && overlay) {
    if (viewId === "homepage") {
      overlay.style.display = "block";
    } else {
      overlay.style.display = "none";
    }
  }

  // Handle visibility of shared elements
  const titleSection = document.getElementById("title-section");
  const navButtons = document.getElementById("nav-buttons");
  if (viewId === "view1" || viewId === "view2") {
    if (titleSection) titleSection.classList.remove("hidden");
    if (navButtons) navButtons.classList.remove("hidden");
  } else if (viewId === "about-page") {
    if (titleSection) titleSection.classList.add("hidden");
    if (navButtons) navButtons.classList.add("hidden");
  } else {
    if (titleSection) titleSection.classList.add("hidden");
    if (navButtons) navButtons.classList.add("hidden");
  }
}

// Event listener for homepage to gallery
document.getElementById("homepage-button").addEventListener("click", () => {
  // Hide the homepage
  const homepage = document.getElementById("homepage");
  if (homepage) {
    homepage.classList.remove("active");
    homepage.classList.add("hidden");
  } else {
    console.error("Homepage element not found.");
  }

  // Show the gallery view
  showView("view2");
});

// Switch view button event listener
document.getElementById("switch-view-btn").addEventListener("click", () => {
  const currentView = document.querySelector(".view.active");
  if (!currentView) {
    console.error("No active view found.");
    return;
  }

  const currentViewId = currentView.id;
  const nextView = currentViewId === "view1" ? "view2" : "view1";
  showView(nextView);

  // Update the button appearance
  const button = document.getElementById("switch-view-btn");
  if (!button) {
    console.error("Switch view button not found.");
    return;
  }

  const buttonIcon = button.querySelector(".button-icon");
  const buttonText = button.querySelector(".button-text");

  if (nextView === "view1") {
    buttonIcon.src = "view-spoon-icon.png";
    buttonIcon.alt = "View Chart";
    buttonText.textContent = "View Gallery";
  } else if (nextView === "view2") {
    buttonIcon.src = "view-fork-icon.png";
    buttonIcon.alt = "View Gallery";
    buttonText.textContent = "View Chart";
  } else {
    console.error("Unexpected view ID:", nextView);
  }
});

// Event listener for About button in Gallery view
document.getElementById("about-btn").addEventListener("click", () => {
  showView("about-page");
});

