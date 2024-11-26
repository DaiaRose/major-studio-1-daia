

/////////////////////////////////////

// using constants makes it easy to update when values change
// many editors also autocomplete variable names
// by convention, constants in JS have UPPERCASE names

const CLASS = "class";
const PETAL_LENGTH = "petallength";
const PETAL_WIDTH =  "petalwidth";
const SEPAL_LENGTH = "sepallength";
const SEPAL_WIDTH = "sepalwidth";
const TOOLTIP_WIDTH =  150;
const TOOLTIP_HEIGHT =  20;


// we can set up our state schema before we have any data
let state = {
  data: [],
  filters: {
    menu: [],
    checked: [],
  },
  sizeBy: {
    menu: [PETAL_LENGTH, PETAL_WIDTH, SEPAL_LENGTH, SEPAL_WIDTH],
    selected: PETAL_LENGTH,
  },
  tooltip: {
    value: "",
    visible: false,
    coordinates: [0, 0],
  },
  dimensions: [window.innerWidth, window.innerHeight],
};

// initializing these globally will be useful later
let xScale, yScale, colorScale;

async function dataLoad() {
  // we can set up our layout before we have data
  initializeLayout();
  const data = await d3.json("./iris_json.json");

  // once data is on state, we can access it from any other function because state is a global variable
  
  // we also populate our checkboxes with values from the data
  const checkboxValues = Array.from(new Set(data.map(d => d[CLASS])));

  // copy the data into the state variable, add a unique ID for each object and add the filters
  setState({
    data: data.map((d, i) => ({
      ...d,
      id: d[CLASS] + "_" + i, // each object should have a unique ID
    })),
    filters: {
      menu: checkboxValues,
      checked: checkboxValues,
    },
  });
}

// whenever state changes, update the state variable, then redraw the viz
function setState(nextState) {
  // console.log("state updated");
  // using Object.assign keeps the state *immutable*
  state = Object.assign({}, state, nextState);//can have many sources for one target
  draw();
}

function onCheckboxChange(d) {
  console.log(d.target.name)
  // first, was the clicked box already checked or not?
  const index = state.filters.checked.indexOf(d.target.name);
  const isBoxChecked = index > -1;
  let nextCheckedValues;
  // if box is checked, uncheck it
  if (isBoxChecked) {
    nextCheckedValues = [
      ...state.filters.checked.slice(0, index),
      ...state.filters.checked.slice(index + 1),
    ];
    // otherwise, add it to the checked values
  } else {
    nextCheckedValues = [...state.filters.checked, d.target.name];
  }
  setState({
    filters: {
      ...state.filters,
      checked: nextCheckedValues,
    },
  });
}

function onRadioChange(d) {
  console.log(d)
  const nextSelected = d.target.value;
  setState({
    sizeBy: {
      ...state.sizeBy,
      selected: nextSelected,
    },
  });
}

function onMouseEvent(d) {
  if (d.type === "mouseenter") {
    console.log("mouseenter")
    setState({
      tooltip: {
        value: d.target.__data__,
        visible: true,
        coordinates: [
          +d3.select(d.target).attr("width") + TOOLTIP_WIDTH / 2 + 10,
          +d3.select(d.target).attr("y") - TOOLTIP_HEIGHT / 2,
        ],
      },
    });
  } else if (d.type === "mouseleave") {
    console.log("mouseleave")
    setState({
      tooltip: {
        ...state.tooltip,
        value: "",
        visible: false,
      },
    });
  }
}

// this function sets up everything we can before data loads
function initializeLayout() {
  const svgWidth = 0.6 * state.dimensions[0];
  const svgHeight = state.dimensions[1];
  const margin = 80;

  const parent = d3.select(".interactive");
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  xScale = d3.scalePoint()
    .range([margin, svgWidth - margin])
    .padding(0.5); // For categorical data on the x-axis

  yScale = d3.scaleLinear()
    .range([svgHeight - margin, margin]); // Flips the y-axis for stacking up

  colorScale = d3.scaleOrdinal(d3.schemeDark2); // For categorical coloring

  // Add x axis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${svgHeight - margin})`);

  // Add y axis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin}, 0)`);

  svg.append("g").attr("class", "dots");

  const tooltip = svg.append("g").attr("class", "tooltip");
  tooltip
    .append("rect")
    .attr("height", TOOLTIP_HEIGHT)
    .attr("width", TOOLTIP_WIDTH)
    .attr("fill", "#fff")
    .attr("stroke", "#000");
  tooltip
    .append("text")
    .attr("x", 5)
    .attr("y", 14)
    .attr("font-size", 13);

  // Add left menu
  const leftMenu = parent.append("div").attr("class", "left-menu");
  leftMenu.append("div").attr("class", "title").html(`
      <h1>Fisher's Iris Dataset</h1>
      <h4>Which properties of a flower best distinguish it from other species?</h4>
    `);
  leftMenu.append("div").attr("class", "filters");

  // Add right menu
  const rightMenu = parent.append("div").attr("class", "right-menu");
  rightMenu
    .append("form")
    .html(
      state.sizeBy.menu
        .map(
          d =>
            `<input type="radio" name="sizeby" value="${d}" ${
              state.sizeBy.selected === d ? "checked" : ""
            }>${d}<br>`
        )
        .join("")
    )
    .on("change", onRadioChange);
  rightMenu.append("div").attr("class", "legend");
}


// everything in this function depends on data, so the function is called after data loads and whenever state changes
function draw() {
  const filteredData = state.data
    .filter(d => state.filters.checked.indexOf(d[CLASS]) > -1);

  console.log("filteredData:", filteredData);

  xScale.domain(state.sizeBy.menu);
  yScale.domain([0, d3.max(filteredData, d => d[state.sizeBy.selected]) || 0]);
  colorScale.domain(state.filters.menu);

  d3.select(".x-axis")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${yScale.range()[0]})`);

  d3.select(".y-axis")
    .call(d3.axisLeft(yScale))
    .attr("transform", `translate(${xScale.range()[0]}, 0)`);

  const dots = d3
    .select(".dots")
    .selectAll("circle")
    .data(filteredData, d => d.id)
    .join("circle")
    .attr("cx", d => xScale(state.sizeBy.selected))
    .attr("cy", d => yScale(d[state.sizeBy.selected]))
    .attr("r", 5)
    .attr("fill", d => colorScale(d[CLASS]))
    .on("mouseenter", onMouseEvent)
    .on("mouseleave", onMouseEvent);

  dots.transition()
    .duration(1000)
    .attr("cx", d => xScale(state.sizeBy.selected))
    .attr("cy", d => yScale(d[state.sizeBy.selected]))
    .attr("r", 5)
    .attr("fill", d => colorScale(d[CLASS]));


  // Tooltip logic
  const tooltip = d3.select(".tooltip");
  tooltip
    .attr(
      "transform",
      `translate(${state.tooltip.coordinates[0]}, ${
        state.tooltip.coordinates[1]
      })`
    )
    .classed("visible", state.tooltip.visible);
  tooltip.select("text").text(() => {
    const d = state.tooltip.value;
    return `${d.id}: ${d[state.sizeBy.selected]}`;
  });

}

  
  // update tooltip based on state.tooltip
  const tooltip = d3.select(".tooltip");
  tooltip
    .attr(
      "transform",
      `translate(${state.tooltip.coordinates[0]}, ${
        state.tooltip.coordinates[1]
      })`
    )
    .classed("visible", state.tooltip.visible);
  tooltip.select("text").text(() => {
    const d = state.tooltip.value;
    return `${d.id}: ${d[state.sizeBy.selected]}`;
  });

  // update legend based on filteredData
  const legend = d3.select(".legend");
  legend
    .selectAll(".legend-row")
    .data(state.filters.checked)
    .join("div")
    .attr("class", "legend-row")
    .html(
      d => `
      <div class="box" style="background-color:${colorScale(d)};"></div>
      <div class="legend-label">${d}</div>
    `
    );

// this function is only called once
dataLoad();
