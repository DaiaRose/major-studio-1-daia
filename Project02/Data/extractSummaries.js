const fs = require('fs');

// Load JSON data from a file
fs.readFile('NASM.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const data = JSON.parse(jsonString);

        // Array to hold the extracted summary text
        let summaries = '';

        // Loop through the items in the data
        data.forEach(item => {
            // Check if the description field exists and is an array
            if (Array.isArray(item.description)) {
                // Loop through the description array
                item.description.forEach(desc => {
                    // Check if the label is "Summary"
                    if (desc.label === 'Summary') {
                        summaries += desc.content + '\n';  // Add the summary content to the list
                    }
                });
            } else {
                console.warn(`Warning: "description" is missing or not an array in item with id: ${item.id}`);
            }
        });

        // Write the extracted summary text to a new file
        fs.writeFile('output.txt', summaries, err => {
            if (err) {
                console.error('Error writing to the text file:', err);
                return;
            }
            console.log('Summary text successfully written to output.txt');
        });
    } catch (err) {
        console.error('Error parsing the JSON file:', err);
    }
});



