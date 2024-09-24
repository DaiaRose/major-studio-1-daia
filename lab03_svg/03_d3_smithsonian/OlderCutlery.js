
let cutlery;
let allDesc = [];

// load the data
d3.json('data/Cutlery2.json').then(data => { 
  cutlery = data;
  analyzeData();
  displayData();
});

// analyze the data
function analyzeData(){
  let desc;

  // go through the list of cutlery
  cutlery.forEach(n => {
    desc = n.description;
    let match = false;

    // see if their location already exists the allplaces array
    allDesc.forEach(p => {
      if(p.desc == desc){
        p.count++;
        match = true;
      }
    });
    // if not create a new entry for that place name
      if(!match){
        allDesc.push({
          name: desc,
          count: 1
        });
      }
  });

  // sort by amount of items in the list
  allDesc.sort((a, b) => (a.count < b.count) ? 1 : -1);
  console.log(allDesc)
}

// display the data
function displayData(){
  
  // define dimensions and margins for the graphic
  const margin = ({top: 100, right: 50, bottom: 100, left: 80});
  const width = 1400;
  const height = 700;

  // let's define our scales. 
  // yScale corresponds with amount of cutlery per country
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allDesc, d => d.count)+1])
    .range([height - margin.bottom, margin.top]); 

  // xScale corresponds with country names
  const xScale = d3.scaleBand()
    .domain(allDesc.map(d => d.name))
    .range([margin.left, width - margin.right]);

  // interpolate colors
  const sequentialScale = d3.scaleSequential()
    .domain([0, d3.max(allDesc, d => d.count)])
    .interpolator(d3.interpolateRgb("orange", "purple"));

  // create an svg container from scratch
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // attach a graphic element, and append rectangles to it
  svg.append('g')
    .selectAll('rect')
    .data(allDesc)
    .join('rect')
    .attr('x', d => {return xScale(d.name) })
    .attr('y', d => {return yScale(d.count) })
    .attr('height', d => {return yScale(0)-yScale(d.count) })
    .attr('width', d => {return xScale.bandwidth()})//idk whu -2 so i took out and rect not neg now
    .style('fill', d => {return sequentialScale(d.count);});
 

  // Axes
  // Y Axis
  const yAxis =  d3.axisLeft(yScale).ticks(5)

  svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(yAxis);

  // X Axis
  const xAxis =  d3.axisBottom(xScale).tickSize(0);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')	
    .style('text-anchor', 'end')
    .attr('dx', '-.6em')
    .attr('dy', '-0.1em')
    .attr('transform', d => {return 'rotate(-45)' });

  // Labelling the graph
  svg.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('font-size', 20)
    .attr('y', margin.top-20)
    .attr('x', margin.left)
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .text('Cutlery by Type')
}





















/*
------------------- PASTING BELOW CAUSE IT WORKS OKAY ----------------------

function cleanData(data) {
  if (!Array.isArray(data)) {
      console.error('Provided data is not an array:', data);
      return [];
  }

  const cleanedData = [];
  const seenIDs = new Set(); // To keep track of unique IDs

  const typeMapping = {
    'dessert': ['dessert', 'Ice-Cream', 'Cake', 'Sugar'],
    'folding': ['folding', 'Folding'],
    'knife': ['knife', 'Knife', 'Knives'],
    'fork': ['fork', 'Fork', '"Tipsy Tavener"'],
    'spoon': ['spoon', 'Ladle','ladle', 'Spoon'],
    'stick': ['skewer', 'Skewer','Toothpick', 'Chopsticks', 'Chopstick'],
    'tool': ['Server', 'spreader', 'Spreader','Scoop', 'Sifter', 'Shears', 'corkscrew', 'nutpick', 'Scraper', 'tongs','Tongs', 'Strainer', 'Peeler','peeler', 'pliers']
  };

  //console.log(`Total items in raw data: ${data.length}`);

  data.forEach(item => {
    const typeKey = Object.keys(typeMapping).find(type => {
        return typeMapping[type].some(keyword => item.title.includes(keyword));
    }) || 'other';

    // Skip items with 'other' type
    if (typeKey === 'other') {
      //console.warn(`Item excluded due to type 'other': ${item.title}`);
      return; // Skip this item
  }

    // Initialize a new item structure
    let cleanedItem = {
        id: item.id,
        title: item.title,
        date: item.date.content,
        type: typeKey,
        materials: []
    };

    // Check if description is defined and is an array
    if (Array.isArray(item.description)) {
        item.description.forEach(desc => {
          const materials = extractMaterials(desc.content);
          cleanedItem.materials.push(...materials); // Accumulate materials catergory
      });
    }

    // Remove duplicates
    cleanedItem.materials = [...new Set(cleanedItem.materials)];

    // Assign a default if no materials found
    if (cleanedItem.materials.length === 0) {
        cleanedItem.materials = ['unknown'];
        console.warn(`Item without specific materials assigned: ${item.title}`);
    }

    // Add the item to cleanedData if it hasn't been seen before
    if (!seenIDs.has(item.id)) {
        seenIDs.add(item.id);
        cleanedData.push(cleanedItem);
      } else {
        console.warn(`Duplicate ID skipped: ${item.id}`);
      }
  });

  console.log("Cleaned Data:", cleanedData); // Debugging log
  console.log(`Total cleaned items: ${cleanedData.length}`); // Count of cleaned items
  return cleanedData; // Return the single array
}

const materialMapping = {
  ivory: 'organic',
  wood: 'organic',
  antler: 'organic',
  steel: 'metal',
  silver: 'metal',
  brass: 'metal',
  gold: 'metal',
  pearl: 'organic',
  bone: 'organic',
  pewter: 'metal',
  porcelain: 'ceramic',
  stone: 'natural',
  copper: 'metal',
  skin: 'organic',
  hoof: 'organic',
  shell: 'organic',
  tortoise: 'organic',
  plastic: 'synthetic',
  enamel: 'coating',
  glass: 'glass',
  fiber: 'organic',
  leather: 'organic',
  metal: 'metal',
  horn: 'organic',
};

// Helper function to extract materials from content
function extractMaterials(content) {
  const materials = [];
  const keywords = Object.keys(materialMapping);

  keywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
          materials.push(materialMapping[keyword]); // Push the broader category
      }
  });

  return materials.length > 0 ? [...new Set(materials)] : ['unknown']; // Fallback to 'unknown'
}

//-----------------------------------------------------------------------------

fetch('data/Cutlery2.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json(); // Parse the JSON
  })
  .then(data => {
    console.log(data);
    const cutlery = cleanData(data); // Clean data

    if (cutlery.length > 0) {
      // Group by material and type
      const groupedData = {};
      
      cutlery.forEach(item => {
        item.materials.forEach(material => {
          if (!groupedData[material]) {
            groupedData[material] = {};
          }
          if (!groupedData[material][item.type]) {
            groupedData[material][item.type] = 0; // Initialize count
          }
          groupedData[material][item.type]++; // Increment count
        });
      });

      // Convert to array format
      const scatterPlotData = [];
      for (const material in groupedData) {
        for (const type in groupedData[material]) {
          scatterPlotData.push({
            material,
            type,
            count: groupedData[material][type]
          });
        }
      }

      const filteredScatterPlotData = scatterPlotData.filter(d => d.material !== 'unknown');

      console.log("Scatter Plot Data:", filteredScatterPlotData); // Log for debugging
      createScatterplot(filteredScatterPlotData);
    } else {
        console.error("No valid data to analyze.");
    }
});


//-----------------------------------------------------------------------------

// Function to create the scatterplot
function createScatterplot(scatterPlotData) {
  const svg = d3.select("#scatterplot"),
      margin = {top: 100, right: 50, bottom: 100, left: 80},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales
  const x = d3.scaleBand()
      .domain([...new Set(scatterPlotData.map(d => d.material))]) // Unique materials
      .range([0, width])
      .padding(0.1);

  const y = d3.scaleBand()
      .domain([...new Set(scatterPlotData.map(d => d.type))]) // Unique types
      .range([height, 0])
      .padding(0.1);

  // Add axes
  g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

  // Create a color scale for the types
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create circles for the scatterplot
  g.selectAll("circle")
      .data(scatterPlotData)
      .enter().append("circle")
      .attr("cx", d => x(d.material) + x.bandwidth() / 2) // Center of the band
      .attr("cy", d => y(d.type) + y.bandwidth() / 2) // Center of the band
      .attr("r", 20) // Adjust size as needed
      .attr("fill", teal)
      .attr("opacity", d => Math.min(1, d.count / 10)); // Control opacity based on count

      console.log("Scatter Plot Data Length:", scatterPlotData.length);
}

------------------- PASTING BELOW CAUSE IT WORKS EVEN BETTER!!!!! ----------------------

function cleanData(data) {
  if (!Array.isArray(data)) {
      console.error('Provided data is not an array:', data);
      return [];
  }

  const cleanedData = [];
  const seenIDs = new Set(); // To keep track of unique IDs

  const typeMapping = {
    'dessert': ['dessert', 'Ice-Cream', 'Cake', 'Sugar'],
    'folding': ['folding', 'Folding'],
    'knife': ['knife', 'Knife', 'Knives'],
    'fork': ['fork', 'Fork', '"Tipsy Tavener"'],
    'spoon': ['spoon', 'Ladle','ladle', 'Spoon'],
    'stick': ['skewer', 'Skewer','Toothpick', 'Chopsticks', 'Chopstick'],
    'utensil': ['Server', 'spreader', 'Spreader','Scoop', 'Sifter', 'Shears', 'corkscrew', 'nutpick', 'Scraper', 'tongs','Tongs', 'Strainer', 'Peeler','peeler', 'pliers']
  };

  //console.log(`Total items in raw data: ${data.length}`);

  data.forEach(item => {
    const typeKey = Object.keys(typeMapping).find(type => {
        return typeMapping[type].some(keyword => item.title.includes(keyword));
    }) || 'other';

    // Skip items with 'other' type
    if (typeKey === 'other') {
      //console.warn(`Item excluded due to type 'other': ${item.title}`);
      return; // Skip this item
  }

    // Initialize a new item structure
    let cleanedItem = {
        id: item.id,
        title: item.title,
        date: item.date.content,
        type: typeKey,
        materials: []
    };

    // Check if description is defined and is an array
    if (Array.isArray(item.description)) {
        item.description.forEach(desc => {
          const materials = extractMaterials(desc.content);
          cleanedItem.materials.push(...materials); // Accumulate materials catergory
      });
    }

    // Remove duplicates
    cleanedItem.materials = [...new Set(cleanedItem.materials)];

    // Assign a default if no materials found
    if (cleanedItem.materials.length === 0) {
        cleanedItem.materials = ['unknown'];
        console.warn(`Item without specific materials assigned: ${item.title}`);
    }

    // Add the item to cleanedData if it hasn't been seen before
    if (!seenIDs.has(item.id)) {
        seenIDs.add(item.id);
        cleanedData.push(cleanedItem);
      } else {
        console.warn(`Duplicate ID skipped: ${item.id}`);
      }
  });

  console.log("Cleaned Data:", cleanedData); // Debugging log
  console.log(`Total cleaned items: ${cleanedData.length}`); // Count of cleaned items
  return cleanedData; // Return the single array
}

const materialMapping = {
  ivory: 'animal',
  wood: 'plant',
  antler: 'animal',
  steel: 'steel',
  silver: 'precious metal',
  brass: 'metal',
  gold: 'precious metal',
  pearl: 'shell',
  bone: 'animal',
  pewter: 'metal',
  porcelain: 'non-metalic',
  stone: 'non-metalic',
  copper: 'metal',
  skin: 'animal',
  hoof: 'animal',
  shell: 'shell',
  tortoise: 'shell',
  plastic: 'non-metalic',
  enamel: 'non-metalic',
  glass: 'non-metalic',
  fiber: 'plant',
  leather: 'animal',
  metal: 'metal',
  horn: 'animal',
};

// Helper function to extract materials from content
function extractMaterials(content) {
  const materials = [];
  const keywords = Object.keys(materialMapping);

  keywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
          materials.push(materialMapping[keyword]); // Push the broader category
      }
  });

  return materials.length > 0 ? [...new Set(materials)] : ['unknown']; // Fallback to 'unknown'
}

//-----------------------------------------------------------------------------

fetch('data/Cutlery2.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json(); // Parse the JSON
  })
  .then(data => {
    console.log(data);
    const cutlery = cleanData(data); // Clean data

    if (cutlery.length > 0) {
      // Group by material and type
      const groupedData = {};
      
      cutlery.forEach(item => {
        item.materials.forEach(material => {
          if (!groupedData[material]) {
            groupedData[material] = {};
          }
          if (!groupedData[material][item.type]) {
            groupedData[material][item.type] = 0; // Initialize count
          }
          groupedData[material][item.type]++; // Increment count
        });
      });

      // Convert to array format
      const scatterPlotData = [];
      for (const material in groupedData) {
        for (const type in groupedData[material]) {
          scatterPlotData.push({
            material,
            type,
            count: groupedData[material][type]
          });
        }
      }

      const filteredScatterPlotData = scatterPlotData.filter(d => d.material !== 'unknown');

      console.log("Scatter Plot Data:", filteredScatterPlotData); // Log for debugging
      createScatterplot(filteredScatterPlotData);
    } else {
        console.error("No valid data to analyze.");
    }
});


//-----------------------------------------------------------------------------

// Function to create the scatterplot
function createScatterplot(scatterPlotData) {
  const svg = d3.select("#scatterplot"),
      margin = {top: 50, right: 80, bottom: 50, left: 80},
      width = 400,
      height = 400;

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left + 200}, ${margin.top + 30}) rotate(-45, ${width / 2}, ${height / 2})`); // Rotate around the center

  const customOrder = ['shell', 'non-metalic','plant', 'animal', 'precious metal', 'steel', 'metal'];
  const x = d3.scaleBand()
      .domain(customOrder) 
      .range([0, width-20])
      .padding(0.1);

  const orderedTypes = ['spoon', 'fork', 'dessert', 'utensil', 'stick', 'knife', 'folding'];
  const y = d3.scaleBand()
      .domain(orderedTypes)
      .range([0,height-20])
      .padding(0.1);

  // Move Y-Axis to the right
const yAxis = g.append("g")
.attr("class", "y-axis")
.attr("transform", `translate(${width }, 0)`) // Move y-axis to the right side
.call(d3.axisRight(y).tickSize(0)); // Use axisRight

yAxis.selectAll("line, path") // Select both lines and path
.style("display", "none"); // Hide them

yAxis.selectAll("text")
.attr("dy", "0.5em") // Adjust vertical position
.attr("dx", "-2.5em") // Adjust horizontal position to out
.attr("text-anchor", "start"); // Adjust text anchor

// Adjust X-Axis to the top
const xAxis = g.append("g")
.attr("class", "x-axis")
.attr("transform", `translate(0,0)`) // Position x-axis at the top
.call(d3.axisTop(x).tickSize(0)); // Use axisTop

xAxis.selectAll("line, path") // Select both lines and path
.style("display", "none"); // Hide them

xAxis.selectAll("text")
.attr("transform", "rotate(90)") // Rotate labels to point inward
.attr("dy", "0.5em") // Adjust vertical position
.attr("dx", "0em") // Adjust horizontal position to out
.attr("text-anchor", "end"); // Adjust text anchor

  // Create a color scale for the types
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create circles for the scatterplot
  const circles = g.selectAll("circle")
    .data(scatterPlotData)
    .enter().append("circle")
    .attr("cx", d => x(d.material) + x.bandwidth() / 2) // Center of the band
    .attr("cy", d => y(d.type) + y.bandwidth() / 2) // Center of the band
    .attr("r", 20) // Adjust size as needed
    .attr("fill", "#") // Use a color scale based on type
    .attr("opacity", d => Math.min(1, d.count / 70)) // Control opacity based on count
    .on("mouseover", function(event, d) {
        d3.select("#tooltip")
            .style("visibility", "visible")
            .text(`Count: ${d.count}`);
    })
    .on("mousemove", function(event) {
        const tooltipWidth = parseInt(d3.select("#tooltip").style("width"));
        const tooltipHeight = parseInt(d3.select("#tooltip").style("height"));

        const tooltipX = event.pageX + 5 + tooltipWidth > window.innerWidth ? event.pageX - tooltipWidth - 5 : event.pageX + 5;
        const tooltipY = event.pageY + 5 + tooltipHeight > window.innerHeight ? event.pageY - tooltipHeight - 5 : event.pageY + 5;

        d3.select("#tooltip")
            .style("top", tooltipY + "px")
            .style("left", tooltipX + "px");
    })
    .on("mouseout", function() {
        d3.select("#tooltip").style("visibility", "hidden");
    });

  // Function to get original materials based on broader material category
function getOriginalMaterials(material) {
  const materialMap = {
      animal:['ivory', 'antler', 'bone', 'skin', 'hoof', 'leather', 'horn'],
      plant:['wood', 'fiber'],
      metal:['metal', 'brass', 'pewter', 'copper'],
      precious:['silver', 'gold'],
      shell:['pearl', 'shell', 'tortoise'],
      steel:['steel'],
      nonMetallic:['porcelain', 'stone', 'plastic', 'enamel', 'glass']
  };

  // Determine the category based on the material
  for (const category in materialMap) {
      if (materialMap[category].includes(material)) {
          return materialMap[category];
      }
  }
  
  return []; // Return empty if no matches found
}
}








*/