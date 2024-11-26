// References
const imageGallery = document.getElementById('image-gallery');
const card = document.getElementById('card');

// Populate gallery with images
async function populateGallery() {
  try {
    // Fetch JSON data
    const response = await fetch('cleaned_data.json'); // Adjust path if needed
    const imageData = await response.json();

    console.log("Loaded Image Data:", imageData); // Debugging log

    const numRows = 3;
    const rows = Array.from({ length: numRows }, () => document.createElement('div'));
    rows.forEach(row => {
      row.classList.add('row');
      imageGallery.appendChild(row);
    });

    imageData.forEach((data, index) => {
      console.log("Processing entry:", data); // Debugging log

      const id = data.ID; // Extract ID field
      if (!id) {
        console.warn("Missing ID for entry:", data);
        return; // Skip entries without an ID
      }

      const img = document.createElement('img');
      img.classList.add('image');
      img.dataset.id = id; // Attach ID for easy lookup
      img.loading = "lazy"; // Native lazy loading
      img.src = `images/${id}.jpg`; // Dynamically construct the image path
      img.alt = data.type || "Untitled"; // Use type or fallback text

      // Append to the appropriate row
      rows[index % numRows].appendChild(img);

      // Add click event for the card
      img.addEventListener('click', () => showCard(data));
    });
  } catch (error) {
    console.error("Error loading gallery data:", error);
  }
}

function showCard(data) {
  card.innerHTML = `
    <h2>${data.type || "Untitled"}</h2>
    <p><strong>Subtype:</strong> ${data.subtype || "Unknown"}</p>
    <p><strong>Material:</strong> ${data.material || "Unknown"}</p>
    <p><strong>Year:</strong> ${data.year || "Unknown"}</p>
    <p><strong>Country:</strong> ${data.country || "Unknown"}</p>

  `;
  card.classList.add('active');
}

function closeCard() {
  card.classList.remove('active');
}


// Initialize gallery
populateGallery();
