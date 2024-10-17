
let txt, word, keywords = [
    "accomplish", "the", "won", "a",
    "accomplishment", "died", "crashed", "failed"
  ];

//   let txt, word, keywords = [
//     "accomplish", "successful", "won", "achieved",
//     "tragedy", "died", "crashed", "fail"
//   ];

let bgImage;
let kwicLines = [];
let displayImage = null; // Variable to store the current image to display
let displayText = "";    // Variable to store the current text to display


function preload() {
    txt = loadStrings('/Project02/Data/practiceText.txt', (data) => {
        console.log("File loaded successfully:", data);
    }, (error) => {
        console.error("Failed to load txt file:", error);
    });
    bgImage = loadImage('/Project02/Data/NASM-NASM-9A14471.jpg');
}
  
function setup() {
    createCanvas(800, 500);
    textFont('Times New Roman', 16);

    RiTa.concordance(txt.join('\n')); // create concordance
    word = RiTa.random(keywords); // pick a word to start

    createButtons();
}

//this part is a test right now and ideally happens dynamically
const kwicData = {
    "many people, to see me accomplish what I had, as a": {
      image: "Data/Images/NASM-A20140235000-NASM2016-02424.jpg",
      text: `"This Geraldine Ferraro campaign button was owned by Dr. Sally K. Ride. Ferraro was Walter Mondale's running mate on the Democratic ticket in the 1984 presidential election, and had she been elected, she would have been America's first woman Vice President. During her acceptance speech at the party convention, Ferraro cited Sally Ride's achievement as the first American woman in space as evidence that "change is in the air." Ride saw Ferraro's nomination as inspirational, and said about the DNC speech, "I was as moved by that as many women had been by my flight into space. For the first time, I understood why it was such an emotional experience for so many people, to see me accomplish what I had, as a woman." Ride was a strong supporter of Ferraro and visited her at her congressional office a few months prior to the election, posing for photos with her and a t-shirt that Ride had given her bearing the vice-presidential insignia."`
    },
    "all five Lunar Orbiters were purposely crashed onto the Moon to prevent their": {
      image: "Data/Images/NASM-A19700318000-NASM2018-00097.jpg",
      text: `"In addition to the near global photographic coverage of the Moon, Lunar Orbiter provided additional information that aided Apollo. Sensors on board indicated that radiation levels near the Moon would pose no danger to the astronauts. Analysis of the spacecraft orbits found evidence of gravity perturbations, which suggested that the Moon was not gravatationally uniform. Instead it appeared as if buried concentrations of mass were under the mare deposits. By discovering and defining these "mascons," Lunar Orbiter made it possible for the Apollo missions to conduct highly accurate landings and precision rendezvous.
      After depleting their film supplies, all five Lunar Orbiters were purposely crashed onto the Moon to prevent their radio transmitters from interfering with future spacecraft."`
    },
  };

function draw() {
    kwicLines = []; // Reset KWIC line boundaries for each draw call

    imageMode(CENTER);
    image(bgImage, width / 2, height / 2, bgImage.width * 0.45, bgImage.height * 0.45); // Adjust 0.75 as needed


    // Set transparency for the background box behind text
    fill(226, 219, 201, 220);//background box behind text color matched
    noStroke();
    //rect(50, 80, width - 100, height - 150); // Draw a box for the text area
    rect(50, 80, width - 100, height - 150)

    // get kwic lines for the word
    let kwic = RiTa.kwic(word, 6);
    let tw = textWidth(word) / 2;
    let num = min(10, kwic.length);

    let boxTop;

    for (let i = 0; i < num; i++) {

        // get the parts, stripping line-breaks
        let parts = kwic[i].split(word)
        .map(p => p.replace(/\n/g,' '));// I don't want this. see "the" button
        
        let x = width / 2, y = i * 24 + 90;
        if (i === 0) { 
            // Capture the Y-position of the first KWIC line
            boxTop = y;
            console.log("KWIC Box Top Y-Position: ", boxTop); // Log the Y-position
        }

        if (y > height - 20) return;
        

        fill(0);
        textAlign(RIGHT); // context-before-word
        text(parts[0], x - tw, y);

        fill(200, 0, 0);
        textAlign(CENTER);
        text(word, x, y);  // the word itself
        // I want to add an underline on the red word

        // Store KWIC line boundaries
        kwicLines.push({
            kwicLine: parts[0] + word + parts[1], // Store the entire line for reference
            xStart: x - tw,
            xEnd: x + tw,
            y: y
        });

        // Draw context-after-word
        fill(0);
        textAlign(LEFT);
        text(parts[1], x + tw, y);
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
    const data = kwicData[kwicLine];
        if (data) {
            const imageElement = document.getElementById("description-image");
            imageElement.src = data.image;
            imageElement.onerror = function() {
                console.log("Image failed to load:", data.image);
                this.src = ''; // Clear the image if it fails to load
            };
            document.getElementById("description-text").textContent = data.text;

            document.getElementById("description-box").style.display = "block"; // Show the description box
        }
}

function clearDescriptionBox() {
    document.getElementById("description-box").style.display = "none";
}


function createButtons() {

    // create array of buttons
    let buttons = [], buttonsW = 0, gap = 10;
    for (let i = 0; i < keywords.length; i++) {
        let button = createButton(keywords[i]);
        console.log(button.elt.textContent);
        button.class("button");
        button.style('color', keywords[i] === word ? 'rgb(200,0,0)' : 'black');
        buttonsW += button.width;
        buttons.push(button);
    }

    // center and position each button
    let totalW = (keywords.length * gap) + buttonsW;
    let sofar = 0, startX = width / 2 - totalW / 2;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].position(startX + sofar, 30);
        sofar += buttons[i].width + gap;
    }

    // add handler function for each
    buttons.forEach((b, i) => b.mouseClicked(() => {
        word = b.elt.textContent;
        buttons.forEach(but => but.style('color', 'black'));
        b.style('color', 'rgb(200,0,0)'); // make clicked button red
        clearDescriptionBox(); // Clear the description box when a new keyword is selected
        loop();
    }));
}