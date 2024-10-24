//THIS ONE TAKES BIG JSON AND MAKES IT TO JUST RELEVANT ONES
const fs = require('fs');

// Define your keywords
const keywords = ["accomplish", "accomplishment", "accomplished", "successful", "success", "won", "achieved", "tragedy", "died", "killed", "crashed", "crash", "fail", "failed", "failure"];

// Read the contents of the JSON file
const jsonContent = fs.readFileSync('./Data/NASM.json', 'utf8');

// Parse the JSON content into an object
const largeJSON = JSON.parse(jsonContent);

// Object to track keyword usage
const keywordUsage = {};

// Initialize keywordUsage with all keywords set to 0
for (let keyword of keywords) {
  keywordUsage[keyword] = 0;
}

// Call the function to filter and transform the data
const kwicData = generateKwicData();

// Create the JavaScript file content
let jsContent = 'const kwicData = {\n';

// Add the kwicData in JavaScript format
for (const snippet in kwicData) {
  const escapedSnippet = escapeQuotes(snippet);  // Escape quotes in the snippet
  const escapedText = escapeQuotes(kwicData[snippet].text); // Escape quotes in the text

  jsContent += `  "${escapedSnippet}": {\n`;
  jsContent += `    image: "${kwicData[snippet].image}",\n`;
  jsContent += `    text: \`${escapedText}\`\n`; // Use backticks for multiline text
  jsContent += `  },\n`;
}

// Remove the last comma and close the object
jsContent = jsContent.slice(0, -2);  // Remove last comma
jsContent += '\n};\n';

// Write the generated JavaScript content to a file
fs.writeFileSync('kwicData.js', jsContent);

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
      let possibleSnippets = [];

      // If description is an array, loop through it
      if (Array.isArray(item.description)) {
        for (let desc of item.description) {
          const snippets = extractSnippets(desc.content, keywords);
          if (snippets.length > 0) {
            possibleSnippets = possibleSnippets.concat(snippets);
          }
        }
      } 
      // If description is not an array (could be a string or object), handle it accordingly
      else if (typeof item.description === 'string') {
        const snippets = extractSnippets(item.description, keywords);
        if (snippets.length > 0) {
          possibleSnippets = possibleSnippets.concat(snippets);
        }
      } else if (typeof item.description === 'object' && item.description.content) {
        const snippets = extractSnippets(item.description.content, keywords);
        if (snippets.length > 0) {
          possibleSnippets = possibleSnippets.concat(snippets);
        }
      }

      // Sort by least-used keyword if possible snippets exist
      if (possibleSnippets.length > 0) {
        // Sort snippets based on keyword usage (least-used first)
        possibleSnippets.sort((a, b) => keywordUsage[a.keyword] - keywordUsage[b.keyword]);

        // Select the snippet with the least-used keyword
        const selectedSnippet = possibleSnippets[0];
        kwicData[selectedSnippet.snippet] = {
          image: "", // Placeholder for image
          text: `${selectedSnippet.fullText} View more: ${item.link}`
        };

        // Increment the keyword usage counter
        keywordUsage[selectedSnippet.keyword]++;
        found = true;
      }
    }
  }

  // Return the generated kwicData
  return kwicData;
}

// Function to extract snippets around all keywords (returns multiple snippets)
function extractSnippets(text, keywords) {
  const words = text.split(/\s+/); // Split text into an array of words
  let snippets = [];

  // Search for any of the keywords in the text using a regular expression for whole-word matching
  for (let keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i'); // Word boundary \b ensures whole word match
    const index = words.findIndex(word => regex.test(word));

    if (index !== -1) {
      // Get up to 6 words before and after the keyword
      const start = Math.max(0, index - 6);
      const end = Math.min(words.length, index + 7); // Include the keyword and 6 words after it

      const snippet = words.slice(start, end).join(' '); // Create the snippet
      snippets.push({
        snippet: snippet,
        keyword: keyword,
        fullText: text
      });
    }
  }

  // Return all found snippets (can be multiple)
  return snippets;
}

// Function to escape quotes in text for JavaScript
function escapeQuotes(text) {
  return text.replace(/["'\\]/g, '\\$&');  // Escape double quotes, single quotes, and backslashes
}







// //THIS WORKS wellconst fs = require('fs');

// // Define your keywords
// const keywords = ["accomplish", "accomplishment", "accomplished", "successful", "success", "won", "achieved", "tragedy", "died", "killed", "crashed", "crash", "fail", "failed", "failure"];

// // Read the contents of the JSON file
// const jsonContent = fs.readFileSync('./Data/NASM.json', 'utf8');

// // Parse the JSON content into an object
// const largeJSON = JSON.parse(jsonContent);

// // Object to track keyword usage
// const keywordUsage = {};

// // Initialize keywordUsage with all keywords set to 0
// for (let keyword of keywords) {
//   keywordUsage[keyword] = 0;
// }

// // Call the function to filter and transform the data
// const kwicData = generateKwicData();

// // Create the JavaScript file content
// let jsContent = 'const kwicData = {\n';

// // Add the kwicData in JavaScript format
// for (const snippet in kwicData) {
//   const escapedSnippet = escapeQuotes(snippet);  // Escape quotes in the snippet
//   const escapedText = escapeQuotes(kwicData[snippet].text); // Escape quotes in the text

//   jsContent += `  "${escapedSnippet}": {\n`;
//   jsContent += `    image: "${kwicData[snippet].image}",\n`;
//   jsContent += `    text: \`${escapedText}\`\n`; // Use backticks for multiline text
//   jsContent += `  },\n`;
// }

// // Remove the last comma and close the object
// jsContent = jsContent.slice(0, -2);  // Remove last comma
// jsContent += '\n};\n';

// // Write the generated JavaScript content to a file
// fs.writeFileSync('kwicData.js', jsContent);

// // Function to filter and transform JSON data into kwicData format
// function generateKwicData() {
//   const kwicData = {};

//   // Loop through each item in the large JSON
//   for (let item of largeJSON) {
//     let found = false;

//     // Ensure the item has a link
//     if (!item.link) {
//       continue; // Skip this item if no link exists
//     }

//     // Check if item.description exists
//     if (item.description) {
//       let possibleSnippets = [];

//       // If description is an array, loop through it
//       if (Array.isArray(item.description)) {
//         for (let desc of item.description) {
//           const snippets = extractSnippets(desc.content, keywords);
//           if (snippets.length > 0) {
//             possibleSnippets = possibleSnippets.concat(snippets);
//           }
//         }
//       } 
//       // If description is not an array (could be a string or object), handle it accordingly
//       else if (typeof item.description === 'string') {
//         const snippets = extractSnippets(item.description, keywords);
//         if (snippets.length > 0) {
//           possibleSnippets = possibleSnippets.concat(snippets);
//         }
//       } else if (typeof item.description === 'object' && item.description.content) {
//         const snippets = extractSnippets(item.description.content, keywords);
//         if (snippets.length > 0) {
//           possibleSnippets = possibleSnippets.concat(snippets);
//         }
//       }

//       // Sort by least-used keyword if possible snippets exist
//       if (possibleSnippets.length > 0) {
//         // Sort snippets based on keyword usage (least-used first)
//         possibleSnippets.sort((a, b) => keywordUsage[a.keyword] - keywordUsage[b.keyword]);

//         // Select the snippet with the least-used keyword
//         const selectedSnippet = possibleSnippets[0];
//         kwicData[selectedSnippet.snippet] = {
//           image: "", // Placeholder for image
//           text: `${selectedSnippet.fullText} View more: ${item.link}`
//         };

//         // Increment the keyword usage counter
//         keywordUsage[selectedSnippet.keyword]++;
//         found = true;
//       }
//     }
//   }

//   // Return the generated kwicData
//   return kwicData;
// }

// // Function to extract snippets around all keywords (returns multiple snippets)
// function extractSnippets(text, keywords) {
//   const words = text.split(/\s+/); // Split text into an array of words
//   let snippets = [];

//   // Search for any of the keywords in the text using a regular expression for whole-word matching
//   for (let keyword of keywords) {
//     const regex = new RegExp(`\\b${keyword}\\b`, 'i'); // Word boundary \b ensures whole word match
//     const index = words.findIndex(word => regex.test(word));

//     if (index !== -1) {
//       // Get up to 6 words before and after the keyword
//       const start = Math.max(0, index - 6);
//       const end = Math.min(words.length, index + 7); // Include the keyword and 6 words after it

//       const snippet = words.slice(start, end).join(' '); // Create the snippet
//       snippets.push({
//         snippet: snippet,
//         keyword: keyword,
//         fullText: text
//       });
//     }
//   }

//   // Return all found snippets (can be multiple)
//   return snippets;
// }

// // Function to escape quotes in text for JavaScript
// function escapeQuotes(text) {
//   return text.replace(/["'\\]/g, '\\$&');  // Escape double quotes, single quotes, and backslashes
// }
