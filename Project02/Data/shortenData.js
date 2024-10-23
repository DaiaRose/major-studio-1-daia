//THIS ONE TAKES BIG JSON AND MAKES IT TO JUST RELEVANT ONES

const fs = require('fs');

// Define your keywords
const keywords = ["accomplish", "accomplishment", "accomplished","successful","success", "won", "achieved", "tragedy", "died","killed", "crashed", "crash", "fail", "failed", "failure"];

// Read the contents of the JSON file
const jsonContent = fs.readFileSync('./Data/NASM.json', 'utf8');

// Parse the JSON content into an object
const largeJSON = JSON.parse(jsonContent);

// Call the function to filter and transform the data
const kwicData = generateKwicData();

// Output the generated kwicData to the console for verification
console.log(JSON.stringify(kwicData, null, 2));  // Pretty-print for easy reading

// Function to filter and transform JSON data into kwicData format
function generateKwicData() {
  const kwicData = {};

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
          const snippet = extractSnippet(desc.content, keywords);
          if (snippet) {
            // Use the snippet as the key in kwicData
            kwicData[snippet] = {
              image: "",  // Placeholder for image
              text: `${desc.content} View more: ${item.link}`
            };
            found = true;
            break;
          }
        }
      } 
      // If description is not an array (could be a string or object), handle it accordingly
      else if (typeof item.description === 'string') {
        const snippet = extractSnippet(item.description, keywords);
        if (snippet) {
          kwicData[snippet] = {
            image: "",  // Placeholder for image
            text: `${item.description} View more: ${item.link}`
          };
          found = true;
        }
      } else if (typeof item.description === 'object' && item.description.content) {
        const snippet = extractSnippet(item.description.content, keywords);
        if (snippet) {
          kwicData[snippet] = {
            image: "",  // Placeholder for image
            text: `${item.description.content} View more: ${item.link}`
          };
          found = true;
        }
      }
    }
  }

  // Return the generated kwicData
  return kwicData;
}

// Function to extract a snippet around the keyword (13 words total, matching whole words only)
function extractSnippet(text, keywords) {
  const words = text.split(/\s+/);  // Split text into an array of words

  // Search for any of the keywords in the text using a regular expression for whole-word matching
  for (let keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');  // Word boundary \b ensures whole word match
    const index = words.findIndex(word => regex.test(word));
    
    if (index !== -1) {
      // Get up to 6 words before and after the keyword
      const start = Math.max(0, index - 6);
      const end = Math.min(words.length, index + 7);  // Include the keyword and 6 words after it
      
      const snippet = words.slice(start, end).join(' ');  // Create the snippet
      return snippet;
    }
  }

  // If no keyword was found, return null
  return null;
}
