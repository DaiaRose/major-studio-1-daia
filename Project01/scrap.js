let cutlery;
let allTitles = [];

// ----------------------------------------------------------------
/*
function cleanData(data) {
  if (!Array.isArray(data)) {
      console.error('Provided data is not an array:', data);
      return {};
  }

  const result = {
      byType: {},
      byMaterial: {}
  };


  data.forEach(item => {
      const typeKey = 
      item.title.includes('dessert') ? 'dessert' 
      :item.title.includes('Dessert','Ice-Cream') ? 'dessert' 
      :item.title.includes('Ice-Cream') ? 'dessert' 
      :item.title.includes('Ice Cream') ? 'dessert' 
      :item.title.includes('Cake') ? 'dessert' 
      :item.title.includes('folding') ? 'folding' 
      :item.title.includes('Folding') ? 'folding' 
      :item.title.includes('knife') ? 'knife' 
      :item.title.includes('Knife') ? 'knife' 
      :item.title.includes('Knives') ? 'knife' 
      :item.title.includes('fork','Fork') ? 'fork'
      :item.title.includes('Fork') ? 'fork'  
      :item.title.includes('"Tipsy Tavener"') ? 'fork'  
      :item.title.includes('spoon') ? 'spoon' 
      :item.title.includes('ladle') ? 'spoon' 
      :item.title.includes('Ladle') ? 'spoon' 
      :item.title.includes('Spoon') ? 'spoon' 
      :item.title.includes('skewer') ? 'sticks' 
      :item.title.includes('Skewer') ? 'sticks' 
      :item.title.includes('toothpick') ? 'sticks' 
      :item.title.includes('Toothpick') ? 'sticks' 
      :item.title.includes('Chopsticks') ? 'sticks' 
      :item.title.includes('chopsticks') ? 'sticks' 
      :item.title.includes('Server') ? 'tool' 
      :item.title.includes('server') ? 'tool' 
      :item.title.includes('spreader') ? 'tool' 
      :item.title.includes('Spreader') ? 'tool' 
      :item.title.includes('Scoop') ? 'tool' 
      :item.title.includes('scoop') ? 'tool' 
      :item.title.includes('Sifter') ? 'tool' 
      :item.title.includes('Shears') ? 'tool'
      :item.title.includes('corkscrew') ? 'tool'
      :item.title.includes('nutpick') ? 'tool'
      :item.title.includes('Nutpick') ? 'tool'
      :item.title.includes('Scraper') ? 'tool'
      :item.title.includes('tongs') ? 'tool'
      :item.title.includes('Tongs') ? 'tool'
      :item.title.includes('Strainer') ? 'tool'
      :item.title.includes('Peeler') ? 'tool'
      :item.title.includes('peeler') ? 'tool'
      :item.title.includes('pliers') ? 'tool'
      : 'other';
      
      if (!result.byType[typeKey]) {
          result.byType[typeKey] = [];
      }
      result.byType[typeKey].push(item);

      // Check if description is defined and is an array
      if (Array.isArray(item.description)) {
        item.description.forEach(desc => {
            if (desc.label === "Physical Description") {
                let materials = [];

                // Check for specific keywords and assign material accordingly
                if (desc.content.includes('ivory')) {
                    materials.push('ivory');
                } 
                if (desc.content.includes('wood')) {
                    materials.push('wood'); 
                } 
                if (desc.content.includes('birtch')) {
                  materials.push('wood'); 
              } 
                if (desc.content.includes('antler')) {
                  materials.push('antler'); 
                } 
                if (desc.content.includes('steel')) {
                  materials.push('steel'); 
                } 
                if (desc.content.includes('steel ')) {
                  materials.push('steel'); 
                } 
                if (desc.content.includes('silver')) {
                  materials.push('silver'); 
                } 
                if (desc.content.includes('brass')) {
                  materials.push('brass'); 
                } 
                if (desc.content.includes('gold')) {
                  materials.push('gold'); 
                } 
                if (desc.content.includes('pearl')) {
                  materials.push('pearl'); 
                } 
                if (desc.content.includes('bone')) {
                  materials.push('bone'); 
                } 
                if (desc.content.includes('pewter')) {
                  materials.push('pewter'); 
                } 
                if (desc.content.includes('porcelain')) {
                  materials.push('porcelain'); 
                } 
                if (desc.content.includes('stone')) {
                  materials.push('stone'); 
                } 
                if (desc.content.includes('copper')) {
                  materials.push('copper'); 
                } 
                if (desc.content.includes('skin')) {
                  materials.push('skin'); 
                } 
                if (desc.content.includes('hoof')) {
                  materials.push('hoof'); 
                } 
                if (desc.content.includes('shell')) {
                  materials.push('shell'); 
                } 
                if (desc.content.includes('tortoise')) {
                  materials.push('tortoise'); 
                } 
                if (desc.content.includes('plastic')) {
                    materials.push('plastic');
                }
                if (desc.content.includes('enamel')) {
                    materials.push('enamel');
                } 
                if (desc.content.includes('pearl')) {
                  materials.push('pearl');
                } 
                if (desc.content.includes('glass')) {
                  materials.push('glass');
                } 
                if (desc.content.includes('fiber')) {
                  materials.push('fiber');
                } 
                if (desc.content.includes('leather')) {
                  materials.push('leather');
                } 
                if (desc.content.includes('metal')) {
                  materials.push('metal');
                } 
                if (desc.content.includes('horn')) {
                  materials.push('horn');
                } 
                if (materials.length === 0){
                    materials.push('unknown'); // Fallback if no keywords are matched
                }
                materials.forEach(material => {
                if (!result.byMaterial[material]) {
                    result.byMaterial[material] = [];
                }

                result.byMaterial[material].push(item);
                });
              return result;
            }
        });
      } 
  });
  console.log("RESULTS",result);
  //return result; //cleaned result
}


// Fetch the JSON data from a file
fetch('data/Cutlery2.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json(); // Parse the JSON
  })
  .then(data => {
      //console.log('Fetched data:', data); // Log the fetched data
      // Clean the data if it's successfully parsed
      cutlery = cleanData(data);
      //console.log(JSON.stringify(cutlery, null, 2));

      if (cutlery && Object.keys(cutlery.byType).length > 0) {
        analyzeData();
        displayData();
      } else {
        console.error("No valid data to analyze.");
      }
  })
  .catch(error => console.error('Error fetching or processing data:', error));

*/
//------------------------------------------------------------------------------

function cleanData(data) {
  if (!Array.isArray(data)) {
      console.error('Provided data is not an array:', data);
      return [];
  }

  const cleanedData = [];
  const seenTitles = new Set(); // To keep track of unique titles

  data.forEach(item => {
      const typeKey = 

      item.title.includes('dessert') ? 'dessert' 
      :item.title.includes('Dessert','Ice-Cream') ? 'dessert' 
      :item.title.includes('Ice-Cream') ? 'dessert' 
      :item.title.includes('Ice Cream') ? 'dessert' 
      :item.title.includes('Cake') ? 'dessert' 
      :item.title.includes('folding') ? 'folding' 
      :item.title.includes('Folding') ? 'folding' 
      :item.title.includes('knife') ? 'knife' 
      :item.title.includes('Knife') ? 'knife' 
      :item.title.includes('Knives') ? 'knife' 
      :item.title.includes('fork','Fork') ? 'fork'
      :item.title.includes('Fork') ? 'fork'  
      :item.title.includes('"Tipsy Tavener"') ? 'fork'  
      :item.title.includes('spoon') ? 'spoon' 
      :item.title.includes('ladle') ? 'spoon' 
      :item.title.includes('Ladle') ? 'spoon' 
      :item.title.includes('Spoon') ? 'spoon' 
      :item.title.includes('skewer') ? 'sticks' 
      :item.title.includes('Skewer') ? 'sticks' 
      :item.title.includes('toothpick') ? 'sticks' 
      :item.title.includes('Toothpick') ? 'sticks' 
      :item.title.includes('Chopsticks') ? 'sticks' 
      :item.title.includes('chopsticks') ? 'sticks' 
      :item.title.includes('Server') ? 'tool' 
      :item.title.includes('server') ? 'tool' 
      :item.title.includes('spreader') ? 'tool' 
      :item.title.includes('Spreader') ? 'tool' 
      :item.title.includes('Scoop') ? 'tool' 
      :item.title.includes('scoop') ? 'tool' 
      :item.title.includes('Sifter') ? 'tool' 
      :item.title.includes('Shears') ? 'tool'
      :item.title.includes('corkscrew') ? 'tool'
      :item.title.includes('nutpick') ? 'tool'
      :item.title.includes('Nutpick') ? 'tool'
      :item.title.includes('Scraper') ? 'tool'
      :item.title.includes('tongs') ? 'tool'
      :item.title.includes('Tongs') ? 'tool'
      :item.title.includes('Strainer') ? 'tool'
      :item.title.includes('Peeler') ? 'tool'
      :item.title.includes('peeler') ? 'tool'
      :item.title.includes('pliers') ? 'tool'
      : 'other';

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
              if (desc.label === "Physical Description") {
                  // Extract materials
                  const materials = extractMaterials(desc.content);
                  cleanedItem.materials = materials;
              }
          });
      }

      // Add the item to the cleanedData array if it hasn't been seen before
      if (!seenTitles.has(item.title)) {
          seenTitles.add(item.title);
          cleanedData.push(cleanedItem);
      }
  });

  console.log("Cleaned Data:", cleanedData); // Debugging log
  return cleanedData; // Return the single array
}

// Helper function to extract materials from content
function extractMaterials(content) {
  const materials = [];
  const keywords = ['ivory', 'wood', 'antler', 'steel', 'silver', 'brass', 'gold', 
                   'pearl', 'bone', 'pewter', 'porcelain', 'stone', 'copper', 
                   'skin', 'hoof', 'shell', 'tortoise', 'plastic', 'enamel', 
                   'glass', 'fiber', 'leather', 'metal', 'horn'];

  keywords.forEach(keyword => {
      if (content.includes(keyword)) {
          materials.push(keyword);
      }
  });

  return materials.length > 0 ? materials : ['unknown']; // Fallback to 'unknown'
}

fetch('data/Cutlery2.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json(); // Parse the JSON
  })
  .then(data => {
    cutlery = cleanData(data); // Now this will be a single array

    if (cutlery.length > 0) {
        analyzeData(cutlery); // Pass the cleaned array directly
        displayData();
    } else {
        console.error("No valid data to analyze.");
    }
});




















/*

//------------------------------------------------------------------------------
// load the data is moved up in fetch


// analyze the data
function analyzeData(){

  // go through the list of cutlery
  cutlery.byType.forEach(n => {
    const title = n.title;
    let match = false;

    // see if their location already exists the allplaces array
    allTitles.forEach(p => {
      if(p.name == title){
        p.count++;
        match = true;
      }
    });
    // if not create a new entry for that place name
      if(!match){
        allTitles.push({
          name: title,
          count: 1
        });
      }
  });

  // sort by amount of items in the list
  allTitles.sort((a, b) => (a.count < b.count) ? 1 : -1);
  console.log(allTitles)
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
    .domain([0, d3.max(allTitles, d => d.count)+1])
    .range([height - margin.bottom, margin.top]); 

  // xScale corresponds with country names
  const xScale = d3.scaleBand()
    .domain(allTitles.map(d => d.name))
    .range([margin.left, width - margin.right]);

  // interpolate colors
  const sequentialScale = d3.scaleSequential()
    .domain([0, d3.max(allTitles, d => d.count)])
    .interpolator(d3.interpolateRgb("orange", "purple"));

  // create an svg container from scratch
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // attach a graphic element, and append rectangles to it
  svg.append('g')
    .selectAll('rect')
    .data(allTitles)
    .join('rect')
    .attr('x', d => {return xScale(d.name) })
    .attr('y', d => {return yScale(d.count) })
    .attr('height', d => {return yScale(0)-yScale(d.count) })
    .attr('width', d => {return xScale.bandwidth() - 2 })
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
*/