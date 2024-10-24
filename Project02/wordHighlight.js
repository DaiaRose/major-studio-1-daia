

let allLinks = [];

for (let key in kwicData) {
    if (kwicData.hasOwnProperty(key)) {
        let links = kwicData[key].text.match(/http[s]?:\/\/[^\s]+/g);
        if (links) {
            allLinks.push(...links);  // Spread operator to add all matched links to the array
        }
    }
}

console.log(allLinks);

//This works super well but just for the keywords and not the variations

  let word, keywords = [
    "accomplished", "successful", "won", "achieved",
    "tragedy", "died", "crashed", "failed"
  ];
  
  let kwicLines = [];
  let displayImage = null; // Variable to store the current image to display
  let displayText = "";    // Variable to store the current text to display
  
  // In this modified version, we're no longer using preload to load text files
  // Instead, we're working directly with kwicData for the KWIC visualization
  
  function setup() {
    createCanvas(windowWidth * .9, windowHeight * .8);
    textFont('Times New Roman', 20);
  
    // RiTa concordance based on kwicData
    const kwicTexts = Object.keys(kwicData).map(k => kwicData[k].text);
    RiTa.concordance(kwicTexts.join('\n')); // create concordance
  
    word = RiTa.random(keywords); // pick a word to start
  
    createButtons();
  }
  
  // Make the canvas resize when the window is resized
  function windowResized() {
    resizeCanvas(windowWidth * .9, windowHeight * .8); 
  }
  
  console.log("KWIC!", kwicData);
  
  function draw() {
    kwicLines = []; // Reset KWIC line boundaries for each draw call
    background(255);
    
    // Set transparency for the background box behind text
    fill(226, 219, 201, 230); // Background box behind text color matched
    noStroke();
    rect(50, 80, width - 100, height - 150); // Draw a box for the text area
  
    // Set text size and line spacing (leading)
    textSize(20); // Adjust the text size as desired
    textFont('Iowan Old Style');
  
    // Get KWIC lines for the word
    let kwic = RiTa.kwic(word, 6);
    let tw = textWidth(word) / 2;
    let num = min(10, kwic.length);
  
    for (let i = 0; i < num; i++) {
      // Get the parts, ensuring the split does not overflow to other entries
      let parts = kwic[i].split(word).map(p => p.replace(/\n/g, ' '));

      let contextBefore = parts[0].split(' ').slice(-6).join(' '); // Limit to 6 words max before keyword
      let contextAfter = parts[1].split(' ').slice(0, 6).join(' '); // Limit to 6 words max after keyword
      
      let x = width / 2, y = i * 28 + 250;
  
      if (y > height - 20) return;
  
      fill(0);
      textAlign(RIGHT); // Context-before-word
      text(contextBefore, x - tw, y);
  
      fill(200, 0, 0);
      textAlign(CENTER);
      text(word, x, y);  // The word itself
  
      // Store KWIC line boundaries
      kwicLines.push({
        kwicLine: contextBefore + word + contextAfter, // Store the entire line for reference
        xStart: x - tw,
        xEnd: x + tw,
        y: y
      });
  
      // Draw context-after-word
      fill(0);
      textAlign(LEFT);
      text(contextAfter, x + tw, y);
    }
    noLoop();
}

  
  function mousePressed() {
    // Check if the mouse is clicked within any of the stored KWIC lines
    for (let kwicLine of kwicLines) {
      if (mouseX > kwicLine.xStart && mouseX < kwicLine.xEnd && mouseY > kwicLine.y - 12 && mouseY < kwicLine.y + 12) {
        // When a KWIC line is clicked, display its associated image and text
        displayKeywordDetails(kwicLine.kwicLine);
        break;
      }
    }
  }
  
  function displayKeywordDetails(kwicLine) {
    // Find the best matching key from kwicData
    const closestMatch = Object.keys(kwicData).find(key => key.includes(kwicLine));

    // If we find a match, display its content
    if (closestMatch) {
        const data = kwicData[closestMatch];

        clear();  // Clear canvas (no KWIC text)
        fill(226, 219, 201, 230);  // Background color for the box
        noStroke();
        rect(50, 80, width - 100, height - 150);  // Keep the background box

        const imageElement = document.getElementById("description-image");
        imageElement.src = data.image;
        imageElement.onerror = function() {
            console.log("Image failed to load:", data.image);
            this.src = '';  // Clear the image if it fails to load
        };

        // Format description text
        let formattedText = data.text;

        // Bold the KWIC line
        formattedText = formattedText.replace(kwicLine, `<strong>${kwicLine}</strong>`);

        // Highlight the keyword in red
        formattedText = formattedText.replace(word, `<span style="color: red;">${word}</span>`);

        // Insert the formatted text into the description box (use innerHTML to preserve formatting)
        document.getElementById("description-text").innerHTML = formattedText;

        // Show the description box
        document.getElementById("description-box").style.display = "block";
    }
}

  
  function clearDescriptionBox() {
    document.getElementById("description-box").style.display = "none";
  }
  
  function createButtons() {
    const buttonContainer = document.getElementById('button-container');
    buttonContainer.innerHTML = '';  // Clear any existing buttons
  
    // Loop through keywords and create buttons
    keywords.forEach(keyword => {
      let button = createButton(keyword);
      console.log(button.elt.textContent);
      button.class("button");
  
      // Highlight the selected word in red
      button.style('color', keyword === word ? 'rgb(200,0,0)' : 'black');
      
      // Append each button to the container
      buttonContainer.appendChild(button.elt);
  
      // Add click handler for each button
      button.mouseClicked(() => {
        word = button.elt.textContent;
  
        // Reset all button colors to black, except the clicked one
        buttonContainer.querySelectorAll('button').forEach(but => but.style.color = 'black');
        button.style('color', 'rgb(200,0,0)');  // Highlight clicked button in red
  
        clearDescriptionBox();  // Clear the description box when a new keyword is selected
        loop();  // Redraw the canvas with the new word
      });
    });
  }
  