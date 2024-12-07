
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
    const extraSpace = 50; // Add extra space for better visibility
  
    if (input <= gapStart) {
      return xScale(input);
    } else if (input > gapStart && input <= gapEnd) {
      return (
        xScale(gapStart) +
        compressionFactor * (xScale(gapEnd) - xScale(gapStart)) * ((input - gapStart) / (gapEnd - gapStart)) +
        extraSpace
      );
    } else {
      return (
        xScale(gapStart) +
        compressionFactor * (xScale(gapEnd) - xScale(gapStart)) +
        (1 - compressionFactor) * (xScale(input) - xScale(gapEnd)) +
        extraSpace
      );
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
    // Use the parent container's width for calculation
    const parentContainer = document.querySelector(".interactive");
    
    if (!parentContainer) {
      console.error("Parent container '.interactive' not found!");
      return;
    }
  
    const svgWidth = Math.min(parentContainer.offsetWidth || state.dimensions[0], 800); // Cap at 600px
    const svgHeight = Math.min(state.dimensions[1], 600); // Cap the height at 600px
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
  
  



///
  ///this one now is before i got rid of axis break.
///






// // Initial state
// let state = {
//   data: [],
//   groupBy: {
//     menu: ["type", "material"],
//     selected: "type", // Default grouping
//   },
//   tooltip: {
//     value: "",
//     visible: false,
//     coordinates: [0, 0],
//   },
//   dimensions: [window.innerWidth, window.innerHeight],
// };

// // Initialize scales globally
// let xScale, yScale, colorScale;

// // Load and process data
// async function dataLoad() {
//   if (!document.querySelector("#view1").classList.contains("active")) {
//     console.log("View 1 is not active. Skipping chart initialization.");
//     return;
//   }

//   initializeLayout();
//   const data = await d3.json("cleaned_imgdata.json");

//   const validData = data.filter(d => d.year !== null && d.type !== null);
//   console.log(`Loaded ${validData.length} valid items.`);

//   setState({
//     data: validData.map((d, i) => ({
//       ...d,
//       id: d.ID || `item_${i}`, // Ensure unique IDs
//     })),
//   });

//   populateDropdowns(); // Populate the dropdown menus after loading data
// }


// // Update state and redraw the visualization
// function setState(nextState) {
//   state = Object.assign({}, state, nextState); // Immutable state update
//   draw();
// }

// // Handle category toggle
// function onGroupByChange(event) {
//   const selectedValue = event.target.value;
//   setState({
//     groupBy: {
//       ...state.groupBy,
//       selected: selectedValue,
//     },
//   });
// }

// // Handle mouse events for tooltip
// function onMouseEvent(event) {
//   if (event.type === "mouseenter") {
//     setState({
//       tooltip: {
//         value: event.target.__data__[state.groupBy.selected],
//         visible: true,
//         coordinates: [
//           +d3.select(event.target).attr("cx"),
//           +d3.select(event.target).attr("cy") - 10,
//         ],
//       },
//     });
//   } else if (event.type === "mouseleave") {
//     setState({
//       tooltip: {
//         ...state.tooltip,
//         value: "",
//         visible: false,
//       },
//     });
//   }
// }


// function showView(viewId) {
//   // Hide all views
//   document.querySelectorAll('.view').forEach(view => {
//     view.classList.remove('active');
//   });

//   // Show the selected view
//   const activeView = document.getElementById(viewId);
//   activeView.classList.add('active');

//   // Handle view-specific behavior
//   if (viewId === "view1") {
//     console.log("Switching to View 1.");
//     const chartContainer = document.querySelector("#view1 svg");
//     if (!chartContainer) {
//       console.log("Initializing chart for View 1.");
//       dataLoad(); // Load data and initialize chart
//     } else {
//       console.log("Chart already initialized.");
//     }
//   } else if (viewId === "view2") {
//     console.log("Switching to View 2.");
//     // Add any specific logic for View 2 if needed
//   }
// }


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

// function onFilterChange() {
//   const selectedType = d3.select("#typeDropdown").property("value");
//   const selectedMaterial = d3.select("#materialDropdown").property("value");

//   // Filter data based on selections
//   const filteredData = state.data.filter(d => {
//     const matchesType = selectedType === "All" || d.type === selectedType;
//     const matchesMaterial = selectedMaterial === "All" || d.material === selectedMaterial;
//     return matchesType && matchesMaterial;
//   });

//   // Update state with filtered data
//   setState({ filteredData });
// }


// // Initialize layout
// function initializeLayout() {
//   const parentContainer = document.querySelector("#view1");

//   if (!parentContainer) {
//     console.error("Parent container '#view1' not found!");
//     return;
//   }

//   // Double the width
//   const svgWidth = Math.min((parentContainer.offsetWidth || state.dimensions[0]) * 2, 1600); // Cap at 1600px
//   const svgHeight = Math.min(state.dimensions[1], 600); // Cap height
//   const margin = { top: 80, right: 80, bottom: 80, left: 80 };

//   // Calculate chart area dimensions
//   const chartWidth = svgWidth - margin.left - margin.right;
//   const chartHeight = svgHeight - margin.top - margin.bottom;

//   // Store chart dimensions in state
//   state.chartWidth = chartWidth;
//   state.chartHeight = chartHeight;

//   const parent = d3.select("#view1");

//   // Create the SVG
//   const svg = parent
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

//   // Add a group for the chart area and apply margins
//   const chart = svg
//     .append("g")
//     .attr("class", "chart-area")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // Define scales using chart area dimensions
//   xScale = d3.scaleLinear().range([0, chartWidth]);
//   yScale = d3.scaleLinear().range([chartHeight, 0]);
//   colorScale = d3.scaleOrdinal(d3.schemeDark2);

//   // Add axes groups
//   chart.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${chartHeight})`);
//   chart.append("g").attr("class", "axis y-axis");

//   // Add a group for dots
//   chart.append("g").attr("class", "dots");

//   // Add menu to toggle grouping
// // Add dropdown menus for filtering by type and material
// const rightMenu = parent.append("div").attr("class", "right-menu");

// // Create type dropdown
// rightMenu
//   .append("label")
//   .text("Type: ")
//   .append("select")
//   .attr("id", "typeDropdown")
//   .on("change", onFilterChange); // Event listener for dropdown change

// // Create material dropdown
// rightMenu
//   .append("label")
//   .text("Material: ")
//   .append("select")
//   .attr("id", "materialDropdown")
//   .on("change", onFilterChange); // Event listener for dropdown change
// }



// //axis break
// function customScale(input) {
//   const gapStart = 510;
//   const gapEnd = 1540;
//   const lostyears = gapStart - gapEnd;
//   const gapWidth = 50; // Fixed width for the gap

//   if (input <= gapStart) {
//     return xScale(input); // Normal range before the gap
//   } else if (input >= gapEnd) {
//     return xScale(gapStart) + gapWidth + xScale(input) - xScale(gapEnd); // Normal range after the gap
//   }
// }



// // Updated draw 
// function draw() {
//   console.log("draw function is running");
  
//   const dataToDraw = state.filteredData || state.data; // Use filtered data if available
  
//   // Filter out data between 510 and 1540
//   const filteredData = dataToDraw.filter(d => d.year <= 510 || d.year >= 1540);

//   // Get all years from the filtered data
//   const allYears = filteredData.map(d => d.year);

//   // Compute the min and max years
//   const minYear = d3.min(allYears);
//   const maxYear = d3.max(allYears);

//   // Update xScale to use the full range of years and spread out the data
//   xScale.domain([minYear - 5, maxYear + 5]); // Adjust domain for padding
//   xScale.range([0, state.chartWidth * 2]); // Use state.chartWidth for spreading out data

//   // Group data by year
//   const groupedData = d3.group(filteredData, d => d.year);

//   // Update yScale based on the maximum count of items in any year
//   yScale.domain([0, d3.max(groupedData.values(), v => v.length) || 0]);

//   // Update axes
//   const tickValues = [500, 510, 1540, 1550, 1580, 1600]; // Explicit ticks
//   d3.select(".x-axis").selectAll("*").remove(); // Clear existing axis elements

//   d3.select(".x-axis")
//     .call(
//       d3.axisBottom(xScale)
//         .tickValues(tickValues) // Explicitly set tick values
//         .tickSize(0) // Remove tick marks
//         .tickFormat(() => "") // Remove tick labels
//     )
//     .attr("transform", `translate(0, ${yScale.range()[0]})`);
//   d3.select(".x-axis .domain").remove();

//   d3.select(".y-axis").call(d3.axisLeft(yScale).tickSizeOuter(0));

//   // Add a custom line for the visible axis
//   const axisStart = customScale(minYear); // Start of the axis
//   const axisEnd = customScale(maxYear);   // End of the axis

//   d3.select(".x-axis")
//     .append("line")
//     .attr("x1", axisStart)
//     .attr("x2", axisEnd)
//     .attr("y1", 0)
//     .attr("y2", 0)
//     .attr("stroke", "black");

//   // Tooltip div
//   const tooltip = d3.select("body").selectAll(".tooltip").data([null]).join("div")
//     .attr("class", "tooltip")
//     .style("position", "absolute")
//     .style("background", "white")
//     .style("border", "1px solid #ccc")
//     .style("padding", "5px")
//     .style("border-radius", "3px")
//     .style("pointer-events", "none")
//     .style("opacity", 0);

//   // Render dots
//   const yearCounts = new Map();
//   d3.select(".dots")
//     .selectAll("circle")
//     .data(filteredData, d => d.id)
//     .join("circle")
//     .attr("cx", d => customScale(d.year)) // Use customScale for x positioning
//     .attr("cy", d => {
//       const year = d.year;
//       if (!yearCounts.has(year)) yearCounts.set(year, 0);
//       const count = yearCounts.get(year);
//       yearCounts.set(year, count + 1);
//       return yScale(count);
//     })
//     .attr("r", 5)
//     .attr("fill", d => colorScale(d[state.groupBy.selected] || "Unknown"))
//     .on("mouseenter", (event, d) => {
//       // Update the tooltip state
//       onMouseEvent(event); // Call existing onMouseEvent for state updates
//       // Show the tooltip
//       tooltip
//         .style("opacity", 1)
//         .html(`
//           <strong>${state.groupBy.selected}:</strong> ${d[state.groupBy.selected]}<br>
//           <strong>Year:</strong> ${d.year}<br>
//           <strong>Location:</strong> ${d.country}
//         `);
//     })
//     .on("mousemove", event => {
//       tooltip
//         .style("left", `${event.pageX + 10}px`) // Offset to avoid cursor overlap
//         .style("top", `${event.pageY + 10}px`);
//     })
//     .on("mouseleave", event => {
//       // Hide the tooltip
//       tooltip.style("opacity", 0);
//       // Call existing onMouseEvent to clear state
//       onMouseEvent(event);
//     });

//   // Add axis break indicator
//   const breakX = xScale(560); // 
//   const breakY = yScale(-12.5); // Adjusted for alignment

//   d3.select("svg")
//     .append("line")
//     .attr("x1", breakX - 5)
//     .attr("x2", breakX + 5)
//     .attr("y1", breakY - 5)
//     .attr("y2", breakY + 5)
//     .attr("stroke", "black")
//     .attr("stroke-width", 1);

//   d3.select("svg")
//     .append("line")
//     .attr("x1", breakX + 5)
//     .attr("x2", breakX - 5)
//     .attr("y1", breakY - 5)
//     .attr("y2", breakY + 5)
//     .attr("stroke", "black")
//     .attr("stroke-width", 1);

//   // Update legend
//   const legendData = Array.from(new Set(filteredData.map(d => d[state.groupBy.selected])));
//   const legend = d3.select(".legend");
//   legend
//     .selectAll(".legend-row")
//     .data(legendData)
//     .join("div")
//     .attr("class", "legend-row")
//     .html(
//       d => `
//         <div class="box" style="background-color:${colorScale(d)};"></div>
//         <div class="legend-label">${d}</div>
//       `
//     );
// }


// // Load data and start visualization
// dataLoad();
