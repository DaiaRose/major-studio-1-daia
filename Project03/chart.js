

// Initial state
let state = {
  data: [],
  groupBy: {
    menu: ["type", "material"],
    selected: "type", // Default grouping
  },
  tooltip: {
    value: "",
    visible: false,
    coordinates: [0, 0],
  },
  dimensions: [window.innerWidth, window.innerHeight],
  viewMode: "focused", // Default mode; can be "focused" or "overview"
};

// Initialize scales globally
let xScale, yScale, colorScale;

// Load and process data
// Load and process data
async function dataLoad() {
  if (!document.querySelector("#view1").classList.contains("active")) {
    console.log("View 1 is not active. Skipping chart initialization.");
    return;
  }

  initializeLayout();

  const data = await d3.json("cleaned_imgdata.json");
  const validData = data.filter(d => d.year !== null && d.type !== null);

  console.log(`Loaded ${validData.length} valid items.`);

  const processedData = validData.map((d, i) => ({
    ...d,
    id: d.ID || `item_${i}`, // Ensure unique IDs
  }));

  // Add this call for the interactive selector
  createCircleSelector(processedData);

  // Update state and redraw
  setState({
    data: processedData,
  });
}


// Update state and redraw the visualization
function setState(nextState) {
  state = Object.assign({}, state, nextState); // Immutable state update
  draw();
}

// Handle category toggle
function onGroupByChange(event) {
  const selectedValue = event.target.value;
  setState({
    groupBy: {
      ...state.groupBy,
      selected: selectedValue,
    },
  });
}

// Handle mouse events for tooltip
function onMouseEvent(event) {
  if (event.type === "mouseenter") {
    setState({
      tooltip: {
        value: event.target.__data__[state.groupBy.selected],
        visible: true,
        coordinates: [
          +d3.select(event.target).attr("cx"),
          +d3.select(event.target).attr("cy") - 10,
        ],
      },
    });
  } else if (event.type === "mouseleave") {
    setState({
      tooltip: {
        ...state.tooltip,
        value: "",
        visible: false,
      },
    });
  }
}


function showView(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show the selected view
  const activeView = document.getElementById(viewId);
  activeView.classList.add('active');

  // Handle view-specific behavior
  if (viewId === "view1") {
    console.log("Switching to View 1.");
    const chartContainer = document.querySelector("#view1 svg");
    if (!chartContainer) {
      console.log("Initializing chart for View 1.");
      dataLoad(); // Load data and initialize chart
    } else {
      console.log("Chart already initialized.");
    }
  } else if (viewId === "view2") {
    console.log("Switching to View 2.");
    // Add any specific logic for View 2 if needed
  }
}


// function populateDropdowns() {
//   const typeDropdown = d3.select("#typeDropdown");
//   const materialDropdown = d3.select("#materialDropdown");

//   // Get unique values for type and material
//   const types = Array.from(new Set(state.data.map(d => d.type)));
//   const materials = Array.from(new Set(state.data.map(d => d.material)));

//   // Populate type dropdown
//   typeDropdown
//     .selectAll("option")
//     .data(["All", ...types]) // Include "All" for no filtering
//     .join("option")
//     .attr("value", d => d)
//     .text(d => d);

//   // Populate material dropdown
//   materialDropdown
//     .selectAll("option")
//     .data(["All", ...materials]) // Include "All" for no filtering
//     .join("option")
//     .attr("value", d => d)
//     .text(d => d);
// }

function onFilterChange() {
  const selectedType = d3.select("#typeDropdown").property("value");
  const selectedMaterial = d3.select("#materialDropdown").property("value");

  // Filter data based on selections
  const filteredData = state.data.filter(d => {
    const matchesType = selectedType === "All" || d.type === selectedType;
    const matchesMaterial = selectedMaterial === "All" || d.material === selectedMaterial;
    return matchesType && matchesMaterial;
  });

  // Update state with filtered data
  setState({ filteredData });
}

// Create the selector grid
function createCircleSelector(data) {
  // Group data by material and type
  const groupedData = {};
  data.forEach(item => {
      if (!groupedData[item.material]) groupedData[item.material] = {};
      if (!groupedData[item.material][item.type]) groupedData[item.material][item.type] = 0;
      groupedData[item.material][item.type]++;
  });

  // Flatten grouped data for visualization
  const selectorData = Object.entries(groupedData).flatMap(([material, types]) =>
      Object.entries(types).map(([type, count]) => ({
          material,
          type,
          count,
      }))
  );

  // Define dimensions
  const width = 250;
  const height = 250;
  const margin = { top: 10, right: 10, bottom: 150, left: 60 };
  const spacing = 10;

  // Create SVG
  const svg = d3.select("#circle-selector")
      .html("") // Clear existing content
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Scales
  const materials = [...new Set(selectorData.map(d => d.material))];
  const types = [...new Set(selectorData.map(d => d.type))];

  const x = d3.scaleBand()
      .domain(materials)
      .range([0, width * 0.4])
      .padding(0);

  const y = d3.scaleBand()
      .domain(["knife", "fork",  "spoon", "folding","stick", "utensil", "dessert"])
      .range([0, height* 0.7])
      .padding(0);

  const maxCount = d3.max(selectorData, d => d.count);
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Add circles
  svg.selectAll("circle")
  .data(selectorData)
  .enter()
  .append("circle")
  .attr("cx", d => x(d.material) + x.bandwidth() / 2) // Center within material column
  .attr("cy", d => y(d.type) + y.bandwidth() / 2) // Center within type row
  .attr("r", 10)
  .attr("fill", d => color(d.type))
  .attr("opacity", d => {
      const minOpacity = 0.2; // Minimum opacity
      return minOpacity + (d.count / maxCount) * (1 - minOpacity);
  })
  .style("cursor", "pointer")
  .on("mouseover", function (event, d) {
      // Bold the corresponding material label
      svg.selectAll(".material-label")
        .filter(label => label === d.material)
        .style("font-weight", "bold");

      // Bold the corresponding type label
      svg.selectAll(".tick text")
        .filter(label => label === d.type)
        .style("font-weight", "bold");
  })
  .on("mouseout", function () {
      // Remove bold styling from all labels
      svg.selectAll(".material-label, .tick text")
        .style("font-weight", "normal");
  })
  .on("click", (event, d) => {
      console.log(`Filtering by Material: ${d.material}, Type: ${d.type}`);
      filterDataBySelection(d.material, d.type);
  });

  // X-axis labels (material)
  svg.selectAll(".material-label")
  .data(materials)
  .join("text")
  .attr("class", "material-label")
  .attr("x", material => x(material) + x.bandwidth() - 5)
  .attr("y", material => {
      // Find the lowest circle's y-coordinate for this material
      const circlesForMaterial = selectorData.filter(d => d.material === material);
      if (circlesForMaterial.length > 0) {
          const lowestCircle = d3.max(circlesForMaterial.map(d => y(d.type) + y.bandwidth() / 2));
          return lowestCircle + 23; // Add padding below the lowest circle
      }
      return height + 20; // Default to bottom if no circles
  })
  .text(material => material)
  .attr("text-anchor", "middle") // Center the text horizontally
  .style("font-size", "12px")
  .style("fill", "#333"); // Adjust style as needed

  // Y-axis labels (type)
  const yAxis = svg.append("g")
  .attr("transform", `translate(0, 0)`)
  .call(d3.axisLeft(y));

  yAxis.selectAll("path") // Select the axis line
    .remove(); // Remove the line

  yAxis.selectAll(".tick line") // Select the tick lines
    .remove(); // Remove tick lines

  yAxis.selectAll(".tick text") // Keep the labels
    .attr("class", "tick-text") // Add a class for easier selection
    .style("font-size", "12px") // Optionally style the labels
    .style("fill", "#333"); // Adjust color as needed


function filterDataBySelection(material, type) {
  const filteredData = state.data.filter(
      d => d.material === material && d.type === type
  );
  setState({ filteredData });
}
}


// Initialize layout
function initializeLayout() {
  const parentContainer = document.querySelector("#view1");

  if (!parentContainer) {
    console.error("Parent container '#view1' not found!");
    return;
  }

  const svgWidth = Math.min((parentContainer.offsetWidth || state.dimensions[0]), 1600); // Cap at 1600px
  const svgHeight = Math.min(state.dimensions[1], 600); // Cap height
  const margin = { top: 80, right: 80, bottom: 80, left: 80 };

  // Calculate chart area dimensions
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Store chart dimensions in state
  state.chartWidth = chartWidth;
  state.chartHeight = chartHeight;

  const parent = d3.select("#view1");

  // Clear existing SVG if any
  parent.select("svg").remove();

  // Create the SVG
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Add a group for the chart area and apply margins
  const chart = svg
    .append("g")
    .attr("class", "chart-area")
    .attr("transform", `translate(${margin.left}, ${margin.top + 100})`);

  // Define scales using chart area dimensions
  xScale = d3.scaleLinear().range([0, state.chartWidth]);
  yScale = d3.scaleLinear().range([chartHeight, 0]);

  colorScale = d3.scaleOrdinal(d3.schemeDark2);

  // Add axes groups
  chart.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${chartHeight})`);
  chart.append("g").attr("class", "axis y-axis");

  // Add a group for dots
  chart.append("g").attr("class", "dots");

  // Initialize the right menu
  initializeRightMenu();
}

// Right menu initialization
function initializeRightMenu() {
  const parent = d3.select("#view1");

  // Clear any existing menu elements
  parent.select(".right-menu").remove();

  // Add a new right menu
  const rightMenu = parent.append("div").attr("class", "right-menu");

  // Create toggle button for switching between modes
  rightMenu
    .append("button")
    .attr("id", "toggleViewButton")
    .text(state.viewMode === "focused" ? "Overview" : "Focused")
    .on("click", () => {
      // Toggle view mode
      const nextMode = state.viewMode === "focused" ? "overview" : "focused";
      setState({ viewMode: nextMode });

      // Update button text
      d3.select("#toggleViewButton")
        .text(nextMode === "focused" ? "Overview" : "Switch to Focused");

      draw(); // Redraw the chart based on the current mode
    });

  // Create type dropdown
  rightMenu
    .append("label")
    .text("Type: ")
    .append("select")
    .attr("id", "typeDropdown")
    .on("change", onFilterChange);

  // Create material dropdown
  rightMenu
    .append("label")
    .text("Material: ")
    .append("select")
    .attr("id", "materialDropdown")
    .on("change", onFilterChange);
}

// Updated draw 
function draw() {
  console.log("draw function is running");

  const dataToDraw = state.filteredData || state.data; // Use filtered data if available

  // Adjust parameters based on view mode
  const isFocused = state.viewMode === "focused";
  const minYear = isFocused ? 1500 : 500;
  const maxYear = isFocused ? 1950 : 2000;
  const dotSpacing = isFocused ? 13 : 7; // Space between stacked dots
  const axisPadding = isFocused ? 10 : 5; // Padding above the x-axis
  const dotRadius = isFocused ? 6 : 3; // Dot radius

  // Filter data to include only the range specified by the current mode
  const filteredData = dataToDraw.filter(d => d.year >= minYear && d.year <= maxYear);

  // Update xScale to cover the full range for the current mode
  xScale.domain([minYear, maxYear]);

  // Group data by year
  const groupedData = d3.group(filteredData, d => d.year);

  // Compute the maximum stack height for any year
  const maxStackHeight = d3.max(groupedData.values(), v => v.length) || 0;

  // Adjust yScale to reflect the maximum stack height
  yScale.domain([0, maxStackHeight]).range([state.chartHeight, 0]);

  // Update axes
  d3.select(".x-axis").selectAll("*").remove(); // Clear existing axis elements
  d3.select(".x-axis")
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .attr("transform", `translate(0, ${yScale(0)})`);

  d3.select(".y-axis").selectAll("*").remove(); // Clear existing axis elements
  d3.select(".y-axis").call(
    d3.axisLeft(yScale)
      .ticks(maxStackHeight)
      .tickSizeOuter(0)
  );

  // Tooltip div
  const tooltip = d3.select("body").selectAll(".tooltip").data([null]).join("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "3px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Draw dots
  d3.select(".dots")
    .selectAll("circle")
    .data(filteredData, d => d.id)
    .join("circle")
    .attr("cx", d => xScale(d.year)) // Use xScale for horizontal positioning
    .attr("cy", (d) => {
      const yearGroup = groupedData.get(d.year); // Get all data points for this year
      const stackIndex = yearGroup.indexOf(d);  // Find the position of this dot in the stack
      return state.chartHeight - stackIndex * dotSpacing - axisPadding; // Apply spacing
    })
    .attr("r", dotRadius)
    .attr("fill", d => colorScale(d[state.groupBy.selected] || "Unknown"))
    .style("fill-opacity", 0.4) // Semi-transparent fill
    .attr("stroke", d => colorScale(d[state.groupBy.selected] || "Unknown")) // Stroke matches the color
    .attr("stroke-width", 1.5) // Define stroke width
    .on("mouseenter", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`
          ${d.year || "Unknown Year"} <strong>○</strong> ${d.country || "Unknown Country"}
        `);
    })
    .on("mousemove", event => {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseleave", () => {
      tooltip.style("opacity", 0);
    });

  // Remove any existing y-axis elements
  d3.select(".y-axis").selectAll("*").remove();

  // Update legend
  const legendData = Array.from(new Set(filteredData.map(d => d[state.groupBy.selected])));
  const legend = d3.select(".legend");
  legend
    .selectAll(".legend-row")
    .data(legendData)
    .join("div")
    .attr("class", "legend-row")
    .html(
      d => `
        <div class="box" style="background-color:${colorScale(d)};"></div>
        <div class="legend-label">${d}</div>
      `
    );
}


// Load data and start visualization
dataLoad();
