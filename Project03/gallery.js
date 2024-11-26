// References
const imageGallery = document.getElementById('image-gallery');
const card = document.getElementById('card');

// Populate gallery with images
async function populateGallery() {
  try {
    // Fetch JSON data
    const response = await fetch('cleaned_data.json'); // Adjust path if needed
    const imageData = await response.json();

    imageData.forEach(async data => {

      const id = data.ID; // Extract ID field
      if (!id) {
        console.warn("Missing ID for entry:", data);
        return; // Skip entries without an ID
      }

      const imageUrl = `images/${id}.jpg`; // Construct the image path

      // Validate the image exists before displaying
      const isValidImage = await checkImageExists(imageUrl);
      if (!isValidImage) {
        return; // Skip if the image doesn't exist
      }

      const img = document.createElement('img');
      img.classList.add('image');
      img.dataset.id = id; // Attach ID for easy lookup
      img.loading = "lazy"; // Native lazy loading
      img.src = imageUrl; // Set the image source
      img.alt = data.type || "Untitled"; // Use type or fallback text

      // Append image directly to the gallery
      imageGallery.appendChild(img);

      // Add click event for the card
      img.addEventListener('click', () => showCard(data));
    });
  } catch (error) {
    console.error("Error loading gallery data:", error);
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

// Initialize the gallery
populateGallery();

