
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

// Custom scale for axis break
function customScale(input) {
  const gapStart = 550;
  const gapEnd = 1450;
  const compressionFactor = 0.1; // Compression ratio for the gap

  if (input <= gapStart) {
    return xScale(input); // Normal range before the gap
  } else if (input > gapStart && input <= gapEnd) {
    return (
      xScale(gapStart) +
      compressionFactor * (xScale(gapEnd) - xScale(gapStart)) * ((input - gapStart) / (gapEnd - gapStart))
    ); // Compressed gap range
  } else {
    return (
      xScale(gapStart) +
      compressionFactor * (xScale(gapEnd) - xScale(gapStart)) +
      (1 - compressionFactor) * (xScale(input) - xScale(gapEnd))
    ); // Normal range after the gap
  }
}

// Load and process data
async function dataLoad() {
  initializeLayout();
  const data = await d3.json("cleaned_data.json");

  // Filter out entries with missing years or countries
  const validData = data.filter(d => d.year !== null && d.country && d.type !== null);

  console.log("Filtered Data:", validData);
  console.log("Valid Data:", validData.map(d => d.country));


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

// Initialize layout
function initializeLayout() {
  const svgWidth = state.dimensions[0]-200;
  const svgHeight = state.dimensions[1];
  const margin = { top: 80, right: 80, bottom: 80, left: 80 };

  // Calculate chart area dimensions
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const parent = d3.select(".interactive");

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



// Draw the visualization
function draw() {
  console.log("draw function is running");
  // Get all years from the data
  const allYears = state.data.map(d => d.year);

  // Compute the min and max years directly from the data
  const minYear = d3.min(allYears);
  const maxYear = d3.max(allYears);

  // Log the min and max years to verify
  console.log("Min Year:", minYear, "Max Year:", maxYear);

  // Update xScale to use the full range of years
  xScale.domain([minYear-5, maxYear+5]);

  // Group data by year
  const groupedData = d3.group(state.data, d => d.year);

  // Update yScale based on the maximum count of items in any year
  yScale.domain([0, d3.max(groupedData.values(), v => v.length) || 0]);

  // Update axes
  d3.select(".x-axis")
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .attr("transform", `translate(0, ${yScale.range()[0]})`);

  d3.select(".y-axis").call(d3.axisLeft(yScale).tickSizeOuter(0));

  // Ensure dots align with customScale
  const yearCounts = new Map();
  const dots = d3
    .select(".dots")
    .selectAll("circle")
    .data(state.data, d => d.id)
    .join("circle")
    .attr("cx", d => {
      const scaledX = customScale(d.year);
      // console.log(`Dot Year: ${d.year}, Scaled X: ${scaledX}`); // Debug dot positions
      

      return scaledX;
    })
    .attr("cy", d => {
      const year = d.year;
      if (!yearCounts.has(year)) yearCounts.set(year, 0);
      const count = yearCounts.get(year);
      yearCounts.set(year, count + 1);
      return yScale(count);
    })
    .attr("r", 5)
    .attr("fill", d => {
      console.log("Group By Selected:", state.groupBy.selected); // Check current grouping
      console.log("Data Field Value:", d[state.groupBy.selected]); // Check the field value
      return colorScale(d[state.groupBy.selected] || "Unknown"); // Fallback to 'Unknown' if undefined
    })
    
    .on("mouseenter", onMouseEvent)
    .on("mouseleave", onMouseEvent);

  // Check alignment with axis
  const xAxis = d3.select(".x-axis");

  // Clear existing axis and ticks
  xAxis.selectAll("*").remove();

  // Define tick values
  const tickValues = [minYear, 550, 1300, maxYear];
  const tickLabels = tickValues.map(d => (d === 550 || d === 1300 ? "" : d));

  tickValues.forEach((value, i) => {
    const tickGroup = xAxis.append("g").attr("class", "tick");

    tickGroup
      .append("line")
      .attr("x1", customScale(value))
      .attr("x2", customScale(value))
      .attr("y1", 0)
      .attr("y2", 6)
      .attr("stroke", "black");

    if (tickLabels[i]) {
      tickGroup
        .append("text")
        .attr("x", customScale(value))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text(tickLabels[i]);
    }
  });

  // Add the axis line
  xAxis
    .append("line")
    .attr("x1", customScale(minYear))
    .attr("x2", customScale(maxYear))
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "black");

  // // Add axis break indicators
  // const svg = d3.select("svg");
  // svg.selectAll(".break-line").remove(); // Clear old indicators

  // svg.append("line")
  //   .attr("class", "break-line")
  //   .attr("x1", customScale(550) - 5)
  //   .attr("x2", customScale(550) + 5)
  //   .attr("y1", yScale(0) - 10) // Slightly above x-axis
  //   .attr("y2", yScale(0))
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 1);

  // svg.append("line")
  //   .attr("class", "break-line")
  //   .attr("x1", customScale(1300) - 5)
  //   .attr("x2", customScale(1300) + 5)
  //   .attr("y1", yScale(0) - 10)
  //   .attr("y2", yScale(0))
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 1);

  // Update legend
  const legendData = Array.from(new Set(state.data.map(d => d[state.groupBy.selected])));
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

