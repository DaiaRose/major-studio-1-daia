const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 20;

// Initial state
let state = {
  data: [],
  groupBy: {
    menu: ["type", "material", "county"],
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
  const gapEnd = 1300;
  const compressionFactor = 0.3; // Compression ratio for the gap

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
  const validData = data.filter(d => d.year !== null && d.country !== null && d.type !== null);

  console.log("Filtered Data:", validData);

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
  const svgWidth = state.dimensions[0]; // Increase width for better spacing
  const svgHeight = state.dimensions[1];
  const margin = 80;

  const parent = d3.select(".interactive");
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  xScale = d3.scaleLinear().range([margin, svgWidth - margin]); // Domain will be set dynamically
  yScale = d3.scaleLinear().range([svgHeight - margin, margin]);
  colorScale = d3.scaleOrdinal(d3.schemeDark2);

  // Add axes
  svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${svgHeight - margin})`);
  svg.append("g").attr("class", "axis y-axis").attr("transform", `translate(${margin}, 0)`);

  svg.append("g").attr("class", "dots");

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
  const groupedData = d3.group(state.data, d => d.year);
  const years = Array.from(groupedData.keys()).sort((a, b) => a - b);

  // Update xScale domain
  xScale.domain([d3.min(state.data, d => d.year), d3.max(state.data, d => d.year)]);
  yScale.domain([0, d3.max(groupedData.values(), v => v.length) || 0]);

  // Clear existing axis and ticks
  d3.select(".x-axis").selectAll("*").remove();

  const xAxis = d3.select(".x-axis");

  // Add the continuous x-axis line
  xAxis
    .append("line")
    .attr("x1", customScale(d3.min(state.data, d => d.year)))
    .attr("x2", customScale(d3.max(state.data, d => d.year)))
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // Define tick values
  const tickValues = [500, 550, 1300, 1400, 2000, ...years];
  const tickLabels = tickValues.map(d => (d === 550 || d === 1300 ? "" : d)); // Hide labels at breaks

  // Add manual ticks and labels
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
        .attr("y", 20) // Adjust distance from axis line
        .attr("text-anchor", "middle")
        .text(tickLabels[i]);
    }
  });

  // Stacking logic for y position
  const yearCounts = new Map();
  const dots = d3
    .select(".dots")
    .selectAll("circle")
    .data(state.data, d => d.id)
    .join("circle")
    .attr("cx", d => {
      console.log("Dot Year:", d.year, "Custom Scaled X:", customScale(d.year));
      return customScale(d.year);
    })
    .attr("cy", d => {
      const year = d.year;
      if (!yearCounts.has(year)) yearCounts.set(year, 0);
      const count = yearCounts.get(year);
      yearCounts.set(year, count + 1);
      return yScale(count);
    })
    .attr("r", 5)
    .attr("fill", d => colorScale(d[state.groupBy.selected]))
    .on("mouseenter", onMouseEvent)
    .on("mouseleave", onMouseEvent);

  // Add axis break indicators (overlay zigzag markers)
  d3.select("svg").selectAll(".break-line").remove();

  // const breakMarkers = [
  //   { position: 550, direction: 1 },
  //   { position: 1300, direction: -1 },
  // ];

  // breakMarkers.forEach(marker => {
  //   const x = customScale(marker.position);
  //   const y1 = -5 * marker.direction;
  //   const y2 = 5 * marker.direction;

  //   d3.select("svg")
  //     .append("line")
  //     .attr("class", "break-line")
  //     .attr("x1", x - 5)
  //     .attr("x2", x + 5)
  //     .attr("y1", y1)
  //     .attr("y2", y2)
  //     .attr("stroke", "black")
  //     .attr("stroke-width", 1);
  // });

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

