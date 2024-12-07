// References
const row1 = document.getElementById('row1');
const row2 = document.getElementById('row2');
const row3 = document.getElementById('row3');
const card = document.getElementById('card');

// Populate gallery with images
async function populateGallery() {
  try {
    console.log("Fetching data...");
    const response = await fetch('cleaned_data.json');
    const imageData = await response.json();

    const imageLoadPromises = imageData.map(async (data) => {
      const id = data.ID;
      if (!id) return;

      const imageUrl = `images/${id}.jpg`;
      const isValidImage = await checkImageExists(imageUrl);
      if (!isValidImage) return;

      const img = document.createElement('img');
      img.classList.add('image');
      img.dataset.id = id;
      img.src = imageUrl;
      img.alt = data.type || "Untitled";

      // Add lazy loading
      img.loading = "lazy";

      // Add click event listener for the card
      img.addEventListener('click', () => showCard(data));

      const rows = document.querySelectorAll('.image-row');
      const shortestRow = Array.from(rows).sort((a, b) => a.children.length - b.children.length)[0];
      shortestRow.appendChild(img);

      return new Promise((resolve) => {
        img.onload = resolve;
      });
    });

    await Promise.all(imageLoadPromises);
    console.log("All images loaded, calling adjustGalleryWidth.");
    setTimeout(() => {
      adjustGalleryWidth();
    }, 1000);
  } catch (error) {
    console.error("Error populating gallery:", error);
  }
}



// Function to check if an image exists
async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok; // If response is 200 OK, the image exists
  } catch (error) {
    console.error(`Error checking image URL: ${url}`, error);
    return false;
  }
}



function showCard(data) {
  card.innerHTML = `
    <img src="images/${data.ID}.jpg" alt="${data.type || 'Untitled'}" class="card-image">
    <h2>${data.type || "Untitled"}</h2>
    <p><strong>Subtype:</strong> ${data.subtype || "Unknown"}</p>
    <p><strong>Material:</strong> ${data.submaterial || "Unknown"}</p>
    <p><strong>Year:</strong> ${data.year || "Unknown"}</p>
    <p><strong>Country:</strong> ${data.country || "Unknown"}</p>
    <button onclick="closeCard()" class="close-card-btn">Close</button>
  `;
  card.classList.add('active');
}


function closeCard() {
  const card = document.getElementById('card');
  card.classList.remove('active');
}

function adjustGalleryWidth() {
  const imageGallery = document.getElementById('image-gallery');
  const rows = imageGallery.querySelectorAll('.image-row');

  if (rows.length > 0) {
    console.log("Number of rows:", rows.length);
    let totalWidth = 0;

    rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);

      const rowWidth = Array.from(row.children).reduce((width, img) => {
        const imgWidth = img.getBoundingClientRect().width;
        console.log(`Image width in Row ${index + 1}:`, imgWidth);
        return width + imgWidth + 10; // Include gap
      }, 0);

      console.log(`Row ${index + 1} width:`, rowWidth);
      totalWidth = Math.max(totalWidth, rowWidth);
    });

    console.log("Calculated total width:", totalWidth);
    imageGallery.style.width = `${totalWidth}px`;
  } else {
    console.warn("No rows found in image-gallery.");
  }
}


// Initialize the gallery
populateGallery();




////this was NOT wokring



// // References
// const row1 = document.getElementById('row1');
// const row2 = document.getElementById('row2');
// const row3 = document.getElementById('row3');
// const card = document.getElementById('card');

// // Populate gallery with images
// async function populateGallery(force = false) {
//   try {
//     // Check if View 2 is active, unless forced
//     const view2 = document.querySelector("#view2");
//     if (!view2.classList.contains("active") && !force) {
//       console.log("View 2 is not active. Skipping gallery initialization.");
//       return;
//     }

//     console.log("Fetching data...");
//     const response = await fetch('cleaned_data.json');
//     let imageData = await response.json();

//     // Handle missing or malformed data entries
//     imageData = imageData.filter(d => d && d.ID && d.year); // Ensure valid ID and year
//     console.log("Valid entries found:", imageData.length);

//     // Sort the data by year in ascending order
//     imageData.sort((a, b) => (a.year || 0) - (b.year || 0));

//     const rows = document.querySelectorAll('.image-row');
//     if (rows.length === 0) {
//       console.error("No rows available in the gallery.");
//       return;
//     }

//     // Clear existing images to prevent duplicates on reinitialization
//     rows.forEach(row => (row.innerHTML = ""));

//     const imageLoadPromises = imageData.map(async (data, index) => {
//       const id = data.ID;
//       const imageUrl = `images/${id}.jpg`;

//       // Validate image existence
//       const isValidImage = await checkImageExists(imageUrl);
//       if (!isValidImage) {
//         console.warn(`Image not found for ID: ${id}`);
//         return;
//       }

//       const img = document.createElement('img');
//       img.classList.add('image');
//       img.dataset.id = id;
//       img.src = imageUrl;
//       img.alt = data.type || "Untitled";

//       // Add lazy loading
//       img.loading = "lazy";

//       // Add click event listener for the card
//       img.addEventListener('click', () => showCard(data));

//       // Distribute images across rows in chronological order
//       const targetRow = rows[index % rows.length];
//       targetRow.appendChild(img);

//       return new Promise((resolve) => {
//         img.onload = resolve;
//       });
//     });

//     await Promise.all(imageLoadPromises);
//     console.log("All images loaded. Adjusting gallery width.");
//     adjustGalleryWidth();
//   } catch (error) {
//     console.error("Error populating gallery:", error);
//   }
// }



// // Function to check if an image exists
// async function checkImageExists(url) {
//   try {
//     const response = await fetch(url, { method: 'HEAD' });
//     return response.ok; // If response is 200 OK, the image exists
//   } catch (error) {
//     console.error(`Error checking image URL: ${url}`, error);
//     return false;
//   }
// }



// function showCard(data) {
//   card.innerHTML = `
//     <img src="images/${data.ID}.jpg" alt="${data.type || 'Untitled'}" class="card-image">
//     <h2>${data.type || "Untitled"}</h2>
//     <p><strong>Subtype:</strong> ${data.subtype || "Unknown"}</p>
//     <p><strong>Material:</strong> ${data.submaterial || "Unknown"}</p>
//     <p><strong>Year:</strong> ${data.year || "Unknown"}</p>
//     <p><strong>Country:</strong> ${data.country || "Unknown"}</p>
//     <button onclick="closeCard()" class="close-card-btn">Close</button>
//   `;
//   card.classList.add('active');
// }


// function closeCard() {
//   const card = document.getElementById('card');
//   card.classList.remove('active');
// }

// function adjustGalleryWidth() {
//   const imageGallery = document.getElementById('image-gallery');
//   const rows = imageGallery.querySelectorAll('.image-row');

//   if (rows.length > 0) {
//     console.log("Number of rows:", rows.length);
//     let totalWidth = 0;

//     rows.forEach((row, index) => {
//       console.log(`Row ${index + 1}:`, row);

//       const rowWidth = Array.from(row.children).reduce((width, img) => {
//         const imgWidth = img.getBoundingClientRect().width;
//         console.log(`Image width in Row ${index + 1}:`, imgWidth);
//         return width + imgWidth + 10; // Include gap
//       }, 0);

//       console.log(`Row ${index + 1} width:`, rowWidth);
//       totalWidth = Math.max(totalWidth, rowWidth);
//     });

//     console.log("Calculated total width:", totalWidth);
//     imageGallery.style.width = `${totalWidth}px`;
//   } else {
//     console.warn("No rows found in image-gallery.");
//   }
// }


// // Initialize the gallery
// populateGallery();



//backup image scroll



// /* General styling for navigation and views */
// body {
//   font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//   margin: 0;
//   overflow-x: hidden; /* Prevent body overflow issues */
// }

// #nav-buttons {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   color: white;
//   display: flex;
//   justify-content: flex-start; /* Align button to the left */
//   padding: 10px;
//   z-index: 1;
// }

// #nav-buttons button {
//   color: white;
//   background-color: #555;
//   border: none;
//   padding: 10px 20px;
//   cursor: pointer;
// }

// #nav-buttons button:hover {
//   background-color: #777;
// }

// .view {
//   display: none; /* All views are hidden by default */
//   width: 100%;
//   height: 100%;
//   position: absolute; /* Position views on top of each other */
//   top: 0; /* Align at the top */
//   left: 0; /* Align at the left */
// }


// #view1.active {
//   display: flex; /* Keep view1 as flex for its layout */
// }

// .right-menu {
//   position: relative; /* Adjust as needed (e.g., absolute, fixed) */
//   z-index: 10; /* Higher than .nav-buttons */
// }


// #view2.active {
//   display: block;
//   position: relative; /* Ensure normal document flow */
//   width: 100%;
//   height: 100%; /* Occupy full height of the viewport */
//   overflow-x: auto;
//   overflow-y: auto; /* Allow vertical scrolling for tall content */
// }
// /* Title Section Styling */
// #title-section {
//   text-align: center; /* Center align the title and description */
//   background-color: #f9f9f9; /* Optional background color for contrast */
//   padding: 20px; /* Add padding around the content */
//   border-bottom: 1px solid #ddd; /* Optional border below the section */
//   width: 100%; /* Span the full width of the container */
//   box-sizing: border-box; /* Include padding in width calculation */
//   margin-bottom: 10px; /* Space between title and gallery */
// }

// /* Title Styling */
// #title-section h1 {
//   font-size: 2rem; /* Larger font for the title */
//   margin: 0; /* Remove default margin */
// }

// /* Parent container for the image gallery */
// .image-gallery {
//   display: flex;
//   flex-direction: column; /* Stack rows vertically */
//   width: max-content; /* Ensure container expands to fit content */
//   height: auto;
//   overflow-x: auto; /* Allow horizontal scrolling */
//   overflow-y: hidden; /* Prevent vertical overflow */
// }

// /* Style for each row */
// .image-row {
//   display: flex; /* Arrange images in a row */
//   flex-wrap: nowrap; /* Prevent wrapping to a new row */
//   gap: 10px; /* Space between images */
//   height: 200px; /* Fixed height for each row */
//   padding: 5px; /* Add padding for aesthetics */
// }

// /* Style for images */
// .image-row img {
//   height: 100%; /* Constrain image height to row height */
//   object-fit: cover; /* Maintain aspect ratio */
//   border-radius: 5px; /* Optional rounded corners */
//   display: block;
//   cursor: pointer;
//   background-color: #e3e3b5; /* Placeholder color */
// }

// #image-gallery img:hover {
//   transform: scale(1.05); /* Optional: Slight zoom on hover */
//   transition: transform 0.2s ease-in-out; /* Smooth hover effect */
// }

// #slider-container {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-top: 20px;
// }

// #year-slider {
//   width: 80%;
//   margin-left: 10px;
// }

// #year-label {
//   font-weight: bold;
//   margin-left: 10px;
// }

// /* Card/modal styling */
// .card {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   display: flex; /* Use flexbox for image and text alignment */
//   flex-direction: row; /* Align image and text side-by-side */
//   background: white;
//   border: 1px solid #ccc;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//   padding: 20px;
//   display: none;
//   z-index: 1001;
//   width: 80%; 
//   height: 80%; 
//   max-width: 600px; 
//   max-height: 500px; 
//   border-radius: 10px; 
//   overflow: hidden; /* Ensure contents stay inside the card */
//   box-sizing: border-box; /* Include padding in total dimensions */
// }

// .card.active {
//   display: flex;
// }

// .card img.card-image {
//   width: 50%;
//   height: 90%;
//   object-fit: cover; /* Ensure the image fills its container without distortion */
//   border-radius: 5px 0 0 5px; /* Rounded corners for the left side only */
// }

// .card-content {
//   display: flex;
//   flex-direction: row; /* Arrange image and text side-by-side */
//   gap: 20px; /* Space between image and text */
//   align-items: flex-start; /* Align content at the top */
//   width: 100%; /* Ensure content spans full card width */
// }

// .card h2 {
//   font-size: 1.6rem; /* Adjust heading size */
//   margin: 0 0 10px 0; /* Add spacing below heading */
// }

// .card p {
//   margin: 10px 0; /* Add consistent spacing */
//   line-height: 1.5; /* Improve readability */
//   border-top: 1px solid #ddd; /* Add a line above each paragraph */
//   padding-top: 10px; /* Space text away from the line */
// }

// .card p:first-child {
//   border-top: none; /* Remove the top line for the first paragraph */
//   padding-top: 0; /* Remove padding for the first paragraph */
// }

// /* Close button as an "X" in the top-left corner */
// .close-card-btn {
//   position: absolute;
//   top: 10px; /* Offset from the top */
//   left: 10px; /* Offset from the left */
//   width: 30px; /* Fixed size for the button */
//   height: 30px; /* Fixed size for the button */
//   background: #555;
//   color: white;
//   border: none;
//   border-radius: 50%; /* Circular button */
//   font-size: 1rem;
//   font-weight: bold;
//   line-height: 30px; /* Center text vertically */
//   text-align: center; /* Center text horizontally */
//   cursor: pointer;
// }


// .close-card-btn:hover {
//   background-color: #777;
// }
