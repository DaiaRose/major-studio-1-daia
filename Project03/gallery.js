// References
const row1 = document.getElementById('row1');
const row2 = document.getElementById('row2');
const row3 = document.getElementById('row3');
const card = document.getElementById('card');

// Populate gallery with images
async function populateGallery() {
  try {
    console.log("Fetching data...");
    const response = await fetch('cleaned_imgdata.json');
    const imageData = await response.json();

    console.log(`Gallery Loaded ${imageData.length} valid items.`);

    // Sort the data by year (ascending)
    const sortedData = imageData.sort((a, b) => {
      const yearA = a.year || Number.MAX_SAFE_INTEGER;
      const yearB = b.year || Number.MAX_SAFE_INTEGER;
      return yearA - yearB;
    });

    // Distribute images across rows
    const rows = [row1, row2, row3];
    let rowIndex = 0;

    sortedData.forEach((data, index) => {
      const id = data.ID;
      if (!id) return;

      const img = document.createElement('img');
      img.classList.add('image');
      img.dataset.id = id;
      img.dataset.year = data.year || "Unknown"; // Add year as a data attribute
      img.src = `${data.small_image}`;
      img.alt = data.type || "Untitled";

      img.loading = "lazy";
      img.addEventListener('click', () => showCard(data));

      rows[rowIndex].appendChild(img);
      rowIndex = (rowIndex + 1) % rows.length; // Cycle through rows
    });

    console.log("Images loaded, initializing slider.");

    initializeSlider(sortedData);
  } catch (error) {
    console.error("Error populating gallery:", error);
  }
}

const parentContainer = document.getElementById('view2'); // The scrollable parent
const slider = document.getElementById('year-slider');
const yearLabel = document.getElementById('year-label');

// State to track active interaction
let isSliderActive = false;

// Initialize slider based on the gallery content
async function initializeSlider(imageData) {
  // Set the slider range based on the number of images
  slider.min = 0;
  slider.max = imageData.length - 1;

  // Sync gallery and slider when the slider is moved
  slider.addEventListener('input', () => {
    isSliderActive = true; // Mark slider as active
    const index = parseInt(slider.value, 10);

    const targetImage = document.querySelector(`.image[data-id="${imageData[index].ID}"]`);
    if (targetImage) {
      // Scroll the gallery directly to the target image
      const galleryOffset = parentContainer.scrollLeft;
      const targetOffset = targetImage.offsetLeft - galleryOffset;
      parentContainer.scrollLeft += targetOffset;

      // Update the displayed year
      yearLabel.textContent = imageData[index].year || "Unknown";
    }
  });

  // Re-enable scroll updates after slider interaction
  slider.addEventListener('change', () => {
    isSliderActive = false; // Slider interaction is complete
  });

  // Sync slider and year when the gallery is scrolled
  parentContainer.addEventListener('scroll', () => {
    if (isSliderActive) return; // Block scroll updates during slider interaction

    const images = document.querySelectorAll('.image');
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageLeft = image.getBoundingClientRect().left;
      const parentLeft = parentContainer.getBoundingClientRect().left;

      if (imageLeft >= parentLeft) {
        // Update slider and year
        slider.value = i;
        yearLabel.textContent = imageData[i].year || "Unknown";
        break;
      }
    }
  });

  // Set initial year
  yearLabel.textContent = imageData[0].year || "Unknown";
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
  // Department mapping
  const deptMapping = {
    CHNDM: "Cooper-Hewitt, National Design Museum",
    NMAH: "Smithsonian National Museum of American History",
  };

  const tempImg = new Image();
  tempImg.src = data.image;

  tempImg.onload = () => {
    const isWide = tempImg.width >= 1.5 * tempImg.height;

    card.innerHTML = `
      <div class="card-content ${isWide ? 'wide-layout' : 'normal-layout'}">
        <!-- Custom Arrow Icon Link -->
        <a href="${data.link}" target="_blank" class="card-link">
          <img src="arrow-up.svg" alt="External Link" class="custom-arrow">
        </a>
        <img src="${data.image}" alt="${data.title || 'Untitled'}" class="card-image">
        <div class="card-text">
          <h2>${data.title || "Untitled"}</h2>
          <p>${data.year || "Unknown Year"} <strong>○</strong> ${data.country || "Unknown Country"}</p>
          <p><strong>Material:</strong> ${data.submaterial || "Unknown"}</p>
          <p><strong>Museum:</strong> ${
            deptMapping[data.dept] || "Unknown Department"
          }</p>
          <p><strong>Length:</strong> ${data.length ? `${data.length} in` : "Unknown"}</p>
        </div>
      </div>
      <button onclick="closeCard()" class="close-card-btn">×</button>
    `;

    card.classList.add('active');
  };
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

