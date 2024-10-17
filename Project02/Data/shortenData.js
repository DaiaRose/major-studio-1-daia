// Giving up on this for now!!


const fs = require('fs');

const keywords = ["accomplish", "accomplishment", "acomplished","successful","success", "won", "achieved", "tragedy", "died","killed", "crashed", "crash", "fail", "failed", "failure"];

// Read the contents of the JSON file
const jsonContent = fs.readFileSync('Project02/Data/NASM.json', 'utf8');

// Parse the JSON content into an object
const largeJSON = JSON.parse(jsonContent);

// Call the filterJSONByKeywords function and save the result
const filteredJSON = filterJSONByKeywords();

// Write the filtered JSON to a new file
fs.writeFileSync('filteredData.json', JSON.stringify(filteredJSON, null, 2));

console.log('Filtered data saved to filteredData.json');

function filterJSONByKeywords() {
  // This will hold the filtered results
  const filteredJSON = [];

  // Loop through each item in the large JSON
  for (let item of largeJSON) {
    let found = false;

    // Ensure the item has a link
    if (!item.link) {
      continue; // Skip this item if no link exists
    }

    // Check if item.description exists
    if (item.description) {
      // If description is an array, loop through it
      if (Array.isArray(item.description)) {
        for (let desc of item.description) {
          for (let keyword of keywords) {
            if (desc.content && desc.content.toLowerCase().includes(keyword)) {
              found = true;
              break;
            }
          }
          if (found) break;
        }
      } 
      // If description is not an array (could be a string or object), handle it accordingly
      else if (typeof item.description === 'string') {
        for (let keyword of keywords) {
          if (item.description.toLowerCase().includes(keyword)) {
            found = true;
            break;
          }
        }
      } else if (typeof item.description === 'object' && item.description.content) {
        // Handle the case where description is an object with a content property
        for (let keyword of keywords) {
          if (item.description.content.toLowerCase().includes(keyword)) {
            found = true;
            break;
          }
        }
      }
    }

    // If a keyword was found, add the object to the filtered JSON
    if (found) {
      filteredJSON.push({
        id: item.id,
        title: item.title,
        link: item.link,
        description: item.description
      });
    }
  }

  // Output the filtered JSON to the console (optional)
  console.log(JSON.stringify(filteredJSON, null, 2));  // Pretty-print for easy reading

  return filteredJSON;
}




// // Assume `filteredJSON` is the result of the filterJSONByKeywords function
// fs.writeFileSync('filteredData.json', JSON.stringify(filteredJSON, null, 2));
// console.log('Filtered data saved to filteredData.json');

//run in terminal: node Project02/Data/shortenData.js
