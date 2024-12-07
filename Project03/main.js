// Define the showView function
function showView(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show the selected view
  const activeView = document.getElementById(viewId);
  activeView.classList.add('active');

  // Trigger view-specific initialization
  if (viewId === "view1") {
    console.log("Switching to View 1: Initializing chart.");
    const chartContainer = document.querySelector("#view1 svg");
    if (!chartContainer) {
      dataLoad();
    }
  } else if (viewId === "view2") {
    console.log("Switching to View 2: Initializing gallery.");
    populateGallery(true); // Force initialization on view switch
  }
}

  
  // Attach event listener to the Switch View button
  document.getElementById("switch-view-btn").addEventListener("click", () => {
    const currentView = document.querySelector(".view.active").id;
    const nextView = currentView === "view1" ? "view2" : "view1";
    showView(nextView);
  });
  
    
  