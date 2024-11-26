
import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin
from PIL import Image
import json


# Directory to save images
image_dir = 'data/images'

# JSON file containing the data
json_file = 'cutleryOrig.json'  # Update with your JSON file path

# Ensure the image directory exists
if not os.path.exists(image_dir):
    os.makedirs(image_dir)

# Function to validate if the file is a valid image
def is_valid_image(file_name):
    try:
        with Image.open(file_name) as img:
            img.verify()  # Verify image integrity
        return True
    except Exception:
        return False

# Function to scrape the image URL from a webpage and download it
def download_image_from_page(page_url, file_name):
    try:
        response = requests.get(page_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the primary <img> tag containing the full-sized image
        img_tag = soup.find('img', {'id': True, 'src': True})
        if not img_tag or not img_tag.get('src'):
            raise ValueError(f"No valid image tag found on page: {page_url}")

        # Extract the full image URL
        img_url = img_tag['src']
        img_url = urljoin(page_url, img_url)  # Handle relative URLs

        # Download the image
        response = requests.get(img_url, timeout=10)
        response.raise_for_status()
        with open(file_name, 'wb') as handler:
            handler.write(response.content)
        print(f"Downloaded image: {file_name}")

        # Validate the downloaded image
        if not is_valid_image(file_name):
            print(f"Invalid image file: {file_name}")
            os.remove(file_name)  # Remove invalid file
            return False

        return True

    except Exception as e:
        print(f"Failed to download image from {page_url}: {e}")
        return False

# Process JSON data to download images
def process_json(json_file):
    try:
        # Load the JSON data
        with open(json_file, 'r') as file:
            data = json.load(file)

        for item in data:
            id = item.get("id")
            link = item.get("link")
            if not id or not link:
                print(f"Skipping entry with missing id or link: {item}")
                continue

            # Define the image file name using the id
            image_file_name = os.path.join(image_dir, f"{id}.jpg")
            
            # Download the image from the page
            download_image_from_page(link, image_file_name)

    except Exception as e:
        print(f"Error processing JSON file: {e}")


# Run the process
process_json(json_file)



