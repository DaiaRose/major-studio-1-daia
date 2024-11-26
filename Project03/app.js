// Initial state
let state = {
  data: [],
  groupBy: {
    menu: ["type", "material", "country"],
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
  // Only initialize chart if #view1 is active
  if (!document.querySelector("#view1").classList.contains("active")) {
    console.log("View 1 is not active. Skipping chart initialization.");
    return;
  }

  initializeLayout();
  const data = await d3.json("cleaned_data.json");

  // Filter out entries with missing years or countries
  const validData = data.filter(d => d.year !== null && d.country && d.type !== null);

  console.log("Filtered Data:", validData);
  const earliest30Years = Array.from(new Set(validData.map(d => d.year)))
    .sort((a, b) => a - b) // Sort ascending
    .slice(0, 30); // Take the first 30
  console.log("Earliest 30 Years:", earliest30Years);

  setState({
    data: validData.map((d, i) => ({
      ...d,
      id: d.ID || `item_${i}`, // Ensure unique IDs
    })),
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
    // Initialize or redraw chart if not already present
    const chartContainer = document.querySelector("#view1 svg");
    if (!chartContainer) {
      console.log("Initializing chart for View 1.");
      dataLoad(); // Load data and initialize chart
    }
  } else {
    console.log("View 2 is active. Chart is hidden.");
  }
}



// Initialize layout
function initializeLayout() {
  const parentContainer = document.querySelector("#view1");

  if (!parentContainer) {
    console.error("Parent container '#view1' not found!");
    return;
  }

  // Double the width
  const svgWidth = Math.min((parentContainer.offsetWidth || state.dimensions[0]) * 2, 1600); // Cap at 1600px
  const svgHeight = Math.min(state.dimensions[1], 600); // Cap height
  const margin = { top: 80, right: 80, bottom: 80, left: 80 };

  // Calculate chart area dimensions
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Store chart dimensions in state
  state.chartWidth = chartWidth;
  state.chartHeight = chartHeight;

  const parent = d3.select("#view1");

  // Create the SVG
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Add a group for the chart area and apply margins
  const chart = svg
    .append("g")
    .attr("class", "chart-area")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Define scales using chart area dimensions
  xScale = d3.scaleLinear().range([0, chartWidth]);
  yScale = d3.scaleLinear().range([chartHeight, 0]);
  colorScale = d3.scaleOrdinal(d3.schemeDark2);

  // Add axes groups
  chart.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${chartHeight})`);
  chart.append("g").attr("class", "axis y-axis");

  // Add a group for dots
  chart.append("g").attr("class", "dots");

  // Add menu to toggle grouping
  const rightMenu = parent.append("div").attr("class", "right-menu");
  rightMenu
    .append("form")
    .html(
      state.groupBy.menu
        .map(
          d =>
            `<input type="radio" name="groupby" value="${d}" ${
              state.groupBy.selected === d ? "checked" : ""
            }>${d}<br>`
        )
        .join("")
    )
    .on("change", onGroupByChange);

  // Add legend container
  parent.append("div").attr("class", "legend");
}



//axis break
function customScale(input) {
  const gapStart = 510;
  const gapEnd = 1540;
  const lostyears = gapStart - gapEnd;
  const gapWidth = 50; // Fixed width for the gap

  if (input <= gapStart) {
    return xScale(input); // Normal range before the gap
  } else if (input >= gapEnd) {
    return xScale(gapStart) + gapWidth + xScale(input) - xScale(gapEnd); // Normal range after the gap
  }
}



// Updated draw 
function draw() {
  console.log("draw function is running");

  // Filter out data between 510 and 1540
  const filteredData = state.data.filter(d => d.year <= 510 || d.year >= 1540);

  // Get all years from the filtered data
  const allYears = filteredData.map(d => d.year);

  // Compute the min and max years
  const minYear = d3.min(allYears);
  const maxYear = d3.max(allYears);

  // Update xScale to use the full range of years and spread out the data
  xScale.domain([minYear - 5, maxYear + 5]); // Adjust domain for padding
  xScale.range([0, state.chartWidth * 2]); // Use state.chartWidth for spreading out data

  // Group data by year
  const groupedData = d3.group(filteredData, d => d.year);

  // Update yScale based on the maximum count of items in any year
  yScale.domain([0, d3.max(groupedData.values(), v => v.length) || 0]);

  // Update axes
  const tickValues = [500, 510, 1540, 1550, 1580, 1600]; // Explicit ticks
  d3.select(".x-axis").selectAll("*").remove(); // Clear existing axis elements

  d3.select(".x-axis")
    .call(
      d3.axisBottom(xScale)
        .tickValues(tickValues) // Explicitly set tick values
        .tickSize(0) // Remove tick marks
        .tickFormat(() => "") // Remove tick labels
    )
    .attr("transform", `translate(0, ${yScale.range()[0]})`);
  d3.select(".x-axis .domain").remove();

  d3.select(".y-axis").call(d3.axisLeft(yScale).tickSizeOuter(0));

  // Add a custom line for the visible axis
  const axisStart = customScale(minYear); // Start of the axis
  const axisEnd = customScale(maxYear);   // End of the axis

  d3.select(".x-axis")
    .append("line")
    .attr("x1", axisStart)
    .attr("x2", axisEnd)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "black");

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

  // Render dots
  const yearCounts = new Map();
  d3.select(".dots")
    .selectAll("circle")
    .data(filteredData, d => d.id)
    .join("circle")
    .attr("cx", d => customScale(d.year)) // Use customScale for x positioning
    .attr("cy", d => {
      const year = d.year;
      if (!yearCounts.has(year)) yearCounts.set(year, 0);
      const count = yearCounts.get(year);
      yearCounts.set(year, count + 1);
      return yScale(count);
    })
    .attr("r", 5)
    .attr("fill", d => colorScale(d[state.groupBy.selected] || "Unknown"))
    .on("mouseenter", (event, d) => {
      // Update the tooltip state
      onMouseEvent(event); // Call existing onMouseEvent for state updates
      // Show the tooltip
      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${state.groupBy.selected}:</strong> ${d[state.groupBy.selected]}<br>
          <strong>Year:</strong> ${d.year}<br>
          <strong>Country:</strong> ${d.country}
        `);
    })
    .on("mousemove", event => {
      tooltip
        .style("left", `${event.pageX + 10}px`) // Offset to avoid cursor overlap
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseleave", event => {
      // Hide the tooltip
      tooltip.style("opacity", 0);
      // Call existing onMouseEvent to clear state
      onMouseEvent(event);
    });

  // Add axis break indicator
  const breakX = xScale(560); // 
  const breakY = yScale(-12.5); // Adjusted for alignment

  d3.select("svg")
    .append("line")
    .attr("x1", breakX - 5)
    .attr("x2", breakX + 5)
    .attr("y1", breakY - 5)
    .attr("y2", breakY + 5)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  d3.select("svg")
    .append("line")
    .attr("x1", breakX + 5)
    .attr("x2", breakX - 5)
    .attr("y1", breakY - 5)
    .attr("y2", breakY + 5)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

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
