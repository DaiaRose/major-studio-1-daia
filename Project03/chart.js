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
};

// Initialize scales globally
let xScale, yScale, colorScale;

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

  setState({
    data: validData.map((d, i) => ({
      ...d,
      id: d.ID || `item_${i}`, // Ensure unique IDs
    })),
  });

  populateDropdowns(); // Populate the dropdown menus after loading data
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


function populateDropdowns() {
  const typeDropdown = d3.select("#typeDropdown");
  const materialDropdown = d3.select("#materialDropdown");

  // Get unique values for type and material
  const types = Array.from(new Set(state.data.map(d => d.type)));
  const materials = Array.from(new Set(state.data.map(d => d.material)));

  // Populate type dropdown
  typeDropdown
    .selectAll("option")
    .data(["All", ...types]) // Include "All" for no filtering
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // Populate material dropdown
  materialDropdown
    .selectAll("option")
    .data(["All", ...materials]) // Include "All" for no filtering
    .join("option")
    .attr("value", d => d)
    .text(d => d);
}

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

  // Add menu to toggle grouping
  const rightMenu = parent.append("div").attr("class", "right-menu");

  // Create type dropdown
  rightMenu
    .append("label")
    .text("Type: ")
    .append("select")
    .attr("id", "typeDropdown")
    .on("change", onFilterChange); // Event listener for dropdown change

  // Create material dropdown
  rightMenu
    .append("label")
    .text("Material: ")
    .append("select")
    .attr("id", "materialDropdown")
    .on("change", onFilterChange); // Event listener for dropdown change
}


// Updated draw 
function draw() {
  console.log("draw function is running");

  const dataToDraw = state.filteredData || state.data; // Use filtered data if available

  // Filter data to include only the range from 1500 to 2000
  const filteredData = dataToDraw.filter(d => d.year >= 1500 && d.year <= 1950);

  // Compute the min and max years
  const minYear = 1500;
  const maxYear = 1950;

  // Update xScale to cover the full range from 1500 to 2000
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
    const dotSpacing = 10; // Space between stacked dots
    const axisPadding = 10; // Padding above the x-axis
    
    d3.select(".dots")
      .selectAll("circle")
      .data(filteredData, d => d.id)
      .join("circle")
      .attr("cx", d => xScale(d.year)) // Use xScale for horizontal positioning
      .attr("cy", (d) => {
        const yearGroup = groupedData.get(d.year); // Get all data points for this year
        const stackIndex = yearGroup.indexOf(d);  // Find the position of this dot in the stack
        return state.chartHeight - stackIndex * dotSpacing - axisPadding; // Apply padding
      })
      .attr("r", 5)
      .attr("fill", d => colorScale(d[state.groupBy.selected] || "Unknown"))
      .on("mouseenter", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${state.groupBy.selected}:</strong> ${d[state.groupBy.selected]}<br>
            <strong>Year:</strong> ${d.year}<br>
            <strong>Location:</strong> ${d.country}
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
