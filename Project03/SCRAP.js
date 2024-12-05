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
