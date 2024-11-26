// References
const imageGallery = document.getElementById('image-gallery');
const card = document.getElementById('card');

// Populate gallery with images
async function populateGallery() {
  try {
      // Fetch JSON data
      const response = await fetch('cleaned_data.json');
      const imageData = await response.json();

      const imageGallery = document.getElementById('image-gallery');

      imageData.forEach(data => {
          const id = data.ID;
          if (!id) {
              console.warn("Missing ID for entry:", data);
              return; // Skip entries without an ID
          }

          const img = document.createElement('img');
          img.src = `images/${id}.jpg`; // Construct image path
          img.alt = data.type || "Image"; // Use type or fallback text
          img.title = data.type || "Image"; // Tooltip for the image
          img.addEventListener('click', () => showCard(data)); // Show card on click

          imageGallery.appendChild(img); // Add image to the gallery
      });
  } catch (error) {
      console.error("Error loading gallery data:", error);
  }
}

function showCard(data) {
  const card = document.getElementById('card');
  card.innerHTML = `
      <h2>${data.type || "Untitled"}</h2>
      <p><strong>Subtype:</strong> ${data.subtype || "Unknown"}</p>
      <p><strong>Material:</strong> ${data.material || "Unknown"}</p>
      <p><strong>Year:</strong> ${data.year || "Unknown"}</p>
      <p><strong>Country:</strong> ${data.country || "Unknown"}</p>
      <button onclick="closeCard()">Close</button>
  `;
  card.classList.add('active');
}

function closeCard() {
  const card = document.getElementById('card');
  card.classList.remove('active');
}

// Initialize the gallery
populateGallery();

