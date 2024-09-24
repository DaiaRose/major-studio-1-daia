
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
      margin = {top: 50, right: 80, bottom: 50, left: 70},
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

  // Move Y-Axis [TYPE] to the right
const yAxis = g.append("g")
  .attr("class", "y-axis")
  .attr("transform", `translate(${width }, 0)`) // Move y-axis to the right side
  .call(d3.axisRight(y).tickSize(0)); // Use axisRight

yAxis.selectAll("line, path") // Select both lines and path
  .style("display", "none"); // Hide them

yAxis.selectAll("text")
  .attr("dy", "0.5em") // Adjust vertical position
  .attr("dx", "-2.5em") // Adjust horizontal position to out
  .attr("font-family", "Georgia")
  .attr("text-anchor", "start"); // Adjust text anchor
// Add type mapping for types to materials

function getItemsOfType(type) {
  const typeToItems = {
    'dessert': ['ice cream', 'cake', 'sugar'],
    'folding': ['folding knife, folding fork'],
    'knife': ['knife', 'knives'],
    'fork': ['fork', 'tipsy tavener'],
    'spoon': ['ladle', 'spoon'],
    'stick': ['skewer', 'toothpick', 'chopstick'],
    'utensil': ['server', 'spreader', 'scoop', 'sifter', 'shears', 'corkscrew', 'nutpick', 'scraper', 'tongs', 'strainer', 'peeler', 'pliers']
  };

  return typeToItems[type] || []; // Return an empty array if no match found
}

// Y-Axis [TYPE] hover functionality
yAxis.selectAll("text")
  .on("mouseover", function(event, d) {
      const materialTypes = getItemsOfType(d); // Fetch types based on the hovered material
      d3.select("#tooltip")
          .style("visibility", "visible")
          .text(`Item Types: ${materialTypes.join(", ")}`);
  })
  .on("mousemove", function(event) {
      d3.select("#tooltip")
          .style("top", (event.pageY + 5) + "px")
          .style("left", (event.pageX + 5) + "px");
  })
  .on("mouseout", function() {
      d3.select("#tooltip").style("visibility", "hidden");
  });

// Adjust X-Axis [MATERIAL]to the top
const xAxis = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,0)`) // Position x-axis at the top
    .call(d3.axisTop(x).tickSize(0)); // Use axisTop

xAxis.selectAll("line, path") // Select both lines and path
    .style("display", "none"); // Hide them

const labels = xAxis.selectAll("text")
  .attr("transform", "rotate(90)")
  .attr("dy", "0.5em")
  .attr("dx", "0em")
  .attr("text-anchor", "end")
  .attr("font-family", "Georgia")
  .on("mouseover", function(event, d) {
      const materialCategory = getOriginalMaterials(d); // Fetch types based on the hovered material
      d3.select("#tooltip")
          .style("visibility", "visible")
          .text(`Materials: ${materialCategory.join(", ")}`);
  })
  .on("mousemove", function(event) {
      d3.select("#tooltip")
          .style("top", (event.pageY + 5) + "px")
          .style("left", (event.pageX + 5) + "px");
  })
  .on("mouseout", function() {
      d3.select("#tooltip").style("visibility", "hidden");
  });

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
    .attr("opacity", d => {
      const minCount = 1; // Avoid log(0)
      const logCount = Math.log(d.count + minCount); // Apply log transformation
      const maxLog = Math.log(1080 + minCount); // Log of max count for scaling
      return Math.min(1, 0.1 + (logCount / maxLog) * 0.9); // Scale to [0.5, 1]
      })
    .on("mouseover", function(event, d) {
        d3.select("#tooltip")
            .style("visibility", "visible")
            .text(`${d.count}`);
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

// Add title to the left
svg.append("text")
.attr("x", 100) 
.attr("y", 720) // Adjust vertical position
.attr("font-size", "50px") // Set font size
.attr("font-family", "Georgia")
.attr("transform", "rotate(-45," + margin.left + ",100)") // Rotate up 45 degrees
.text("Materials");

// Add title to the right
svg.append("text")
.attr("x", 600) 
.attr("y", 550) // Adjust vertical position
.attr("font-size", "50px") // Set font size
.attr("transform", "rotate(45,600,100)") // Rotate down 45 degrees
.text("Cutlery");

/*
// Add title to the right
svg.append("text")
.attr("x", 500) 
.attr("y", 550) // Adjust vertical position
.attr("font-size", "20px") // Set font size
.attr("transform", "rotate(45,600,100)") // Rotate down 45 degrees
.text("Smithsonian Collection Data");
*/

  // Function to get original materials based on broader material category
  function getOriginalMaterials(material) {
    const materialMap = {
        animal: ['ivory', 'antler', 'bone', 'skin', 'hoof', 'leather', 'horn'],
        plant: ['wood', 'fiber'],
        metal: ['metal', 'brass', 'pewter', 'copper'],
        "precious metal": ['silver', 'gold'],
        shell: ['pearl', 'shell', 'tortoise'],
        steel: ['steel'],
        "non-metalic": ['porcelain', 'stone', 'plastic', 'enamel', 'glass']
    };
  
    // Return types that match the material
    return materialMap[material] || []; // Return an empty array if no match found
  }
}