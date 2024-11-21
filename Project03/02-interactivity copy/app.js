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

// Load and process data
async function dataLoad() {
  initializeLayout();
  const data = await d3.json("cleaned_data.json");

  // Filter out entries with missing years
  const validData = data.filter(d => d.year !== null);

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
function onGroupByChange(d) {
  setState({
    groupBy: {
      ...state.groupBy,
      selected: d.target.value,
    },
  });
}

// Handle mouse events for tooltip
function onMouseEvent(d) {
  if (d.type === "mouseenter") {
    setState({
      tooltip: {
        value: d.target.__data__[state.groupBy.selected],
        visible: true,
        coordinates: [
          +d3.select(d.target).attr("cx"),
          +d3.select(d.target).attr("cy") - 10,
        ],
      },
    });
  } else if (d.type === "mouseleave") {
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
  const svgWidth = 4 * state.dimensions[0]; // Increase width for better spacing
  const svgHeight = state.dimensions[1];
  const margin = 80;

  const parent = d3.select(".interactive");
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  xScale = d3.scalePoint().range([margin, svgWidth - margin]).padding(0.5);
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
}

// Draw the visualization
function draw() {
  // Group data by year
  const groupedData = d3.group(state.data, d => d.year);
  const years = Array.from(groupedData.keys()).sort((a, b) => a - b);

  xScale.domain(years);
  yScale.domain([0, d3.max(groupedData.values(), v => v.length) || 0]);

  // Update axes
  d3.select(".x-axis").call(d3.axisBottom(xScale)).attr("transform", `translate(0, ${yScale.range()[0]})`);
  d3.select(".y-axis").call(d3.axisLeft(yScale)).attr("transform", `translate(80, 0)`);

  // Stacking logic for y position
  const yearCounts = new Map();
  const dots = d3
    .select(".dots")
    .selectAll("circle")
    .data(state.data, d => d.id)
    .join("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => {
      const year = d.year;
      if (!yearCounts.has(year)) yearCounts.set(year, 0);
      const count = yearCounts.get(year);
      yearCounts.set(year, count + 1);
      return yScale(count); // Stack dots
    })
    .attr("r", 5)
    .attr("fill", d => colorScale(d[state.groupBy.selected]))
    .on("mouseenter", onMouseEvent)
    .on("mouseleave", onMouseEvent);

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
      <div class="legend-label">${d || "Unknown"}</div>
    `
    );
}

// Load data and start visualization
dataLoad();





