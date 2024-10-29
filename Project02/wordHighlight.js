
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
    createCanvas(windowWidth, windowHeight * 1);
    textFont('Times New Roman', 20);
  
    // RiTa concordance based on kwicData
    const kwicTexts = Object.keys(kwicData).map(k => kwicData[k].text);
    RiTa.concordance(kwicTexts.join('\n')); // create concordance
  
    word = RiTa.random(keywords); // pick a word to start
  
    createButtons();
  }
  
  // Make the canvas resize when the window is resized
  function windowResized() {
    resizeCanvas(windowWidth , windowHeight * 1); 
  }
  
  console.log("KWIC!", kwicData);
  
  function draw() {
    kwicLines = []; // Reset KWIC line boundaries for each draw call
    // background(0)
    background(226, 219, 201);//this is background behind the whole pg 2 canvas
    
    // Set transparency for the background box behind text
    fill(226, 219, 201); // Background box behind kwic text color matched
    // fill(0);
    noStroke();
    rect(50, 80, width - 50, height - 50); // Draw a box for the text area
  
    // Set text size and line spacing (leading)
    textSize(25); // Adjust the text size as desired
    textLeading(10); // Increase the line spacing (leading) to 40 pixels
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
function displayKeywordDetails(kwicLine) {
  const closestMatch = Object.keys(kwicData).find(key => key.includes(kwicLine));

  if (closestMatch) {
      const data = kwicData[closestMatch];

      clear();  // Clear canvas (no KWIC text)
      // background(0)
      background(226, 219, 201);  // Background color for the box
      noStroke();
      // rect(60, 80, width - 100, height - 150);  // Keep the background box
      // fill(0);  // Background color for the box

      const imageElement = document.getElementById("description-image");
      imageElement.src = data.image;
      imageElement.onerror = function() {
          console.log("Image failed to load:", data.image);
          this.src = '';  // Clear the image if it fails to load
      };

      let formattedText = data.text;
      formattedText = formattedText.replace(kwicLine, `<strong>${kwicLine}</strong>`);
      formattedText = formattedText.replace(word, `<span style="color: red;">${word}</span>`);

      document.getElementById("description-text").innerHTML = formattedText;

      const descriptionBox = document.getElementById("description-box");
      descriptionBox.style.display = "block";

      // Add the stopPropagation after the box is visible
      descriptionBox.removeEventListener('click', stopPropagationHandler);  // Clean up previous listeners
      descriptionBox.addEventListener('click', stopPropagationHandler);

      // Remove any previous 'click outside' listener to avoid duplicate handling
      document.removeEventListener('click', ClickOutDesc);

      // Delay adding the click-outside handler to avoid closing the box on the same click that opens it
      setTimeout(() => {
          document.addEventListener('click', ClickOutDesc);
      }, 1000);  // Slight delay to ensure this is not triggered by the initial click
  }
}

function stopPropagationHandler(event) {
  event.stopPropagation();  // Prevent the click from closing the description box
}

function clearDescriptionBox() {
  document.getElementById("description-box").style.display = "none";

  // Remove the event listener for clicking outside the description box
  document.removeEventListener('click', ClickOutDesc);
}

function ClickOutDesc(event) {
  const descriptionBox = document.getElementById("description-box");

  // If clicked outside the description box, close it
  if (!descriptionBox.contains(event.target)) {
      clearDescriptionBox();
      loop();  // Re-draw the canvas with the previous keyword lines
  }
}

function mousePressed() {
  if (document.getElementById("description-box").style.display === "block") {
      // If the description box is open, prevent any interaction with the keywords
      return;
  }

  // Check if the mouse is clicked within any of the stored KWIC lines
  for (let kwicLine of kwicLines) {
      if (mouseX > kwicLine.xStart && mouseX < kwicLine.xEnd && mouseY > kwicLine.y - 12 && mouseY < kwicLine.y + 12) {
          displayKeywordDetails(kwicLine.kwicLine);
          break;
      }
  }
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
  