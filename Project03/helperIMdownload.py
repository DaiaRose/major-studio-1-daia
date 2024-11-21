
import requests

from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin

# Directory to save images
image_dir = 'data/images'

# Ensure the image directory exists
if not os.path.exists(image_dir):
    os.makedirs(image_dir)

# Function to scrape the image URL from a webpage, including custom tags
def scrape_image_url(page_url):
    try:
        response = requests.get(page_url)
        response.raise_for_status()  # Raise error for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')

        # Look for <outline-image> tag with the image-href attribute
        img_tag = soup.find('outline-image', {'image-href': True})

        if img_tag and 'image-href' in img_tag.attrs:
            # Extract the image URL from the image-href attribute
            img_url = img_tag['image-href']
            return img_url
        else:
            print(f"No image found on page: {page_url}")
            return None
    except requests.RequestException as e:
        print(f"Error fetching page {page_url}: {e}")
        return None

# Function to download an image from a URL
def download_image(img_url, file_name):
    try:
        img_data = requests.get(img_url).content
        # Check if the image data is valid (non-empty)
        if len(img_data) == 0:
            raise ValueError(f"Downloaded file is empty for URL: {img_url}")

        with open(file_name, 'wb') as handler:
            handler.write(img_data)
        print(f"Downloaded image: {file_name}")
    except Exception as e:
        print(f"Failed to download image from {img_url}: {e}")

# Update kwicData with scraped images
def update_kwic_data_with_images(kwic_data):
    for key, value in kwic_data.items():
        if 'View more:' in value['text']:
            page_url = value['text'].split('View more: ')[-1]
            image_url = scrape_image_url(page_url)
            if image_url:
                # Define the image file name based on the key
                image_file_name = os.path.join(image_dir, f"{key[:50].replace(' ', '_').replace('/', '_')}.jpg")
                # Download the image
                download_image(image_url, image_file_name)
                # Update the kwicData image field
                kwic_data[key]['image'] = image_file_name

    print("All images downloaded and kwicData updated!")
    return kwic_data

import json

# Directory to save images
image_dir = 'data/images'

# Ensure the image directory exists
if not os.path.exists(image_dir):
    os.makedirs(image_dir)

# Function to scrape the image URL from a webpage, including custom tags
def scrape_image_url(page_url):
    try:
        response = requests.get(page_url)
        response.raise_for_status()  # Raise error for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')

        # Look for <outline-image> tag with the image-href attribute
        img_tag = soup.find('outline-image', {'image-href': True})

        if img_tag and 'image-href' in img_tag.attrs:
            # Extract the image URL from the image-href attribute
            img_url = img_tag['image-href']
            return img_url
        else:
            print(f"No image found on page: {page_url}")
            return None
    except requests.RequestException as e:
        print(f"Error fetching page {page_url}: {e}")
        return None

# Function to download an image from a URL
def download_image(img_url, file_name):
    try:
        img_data = requests.get(img_url).content
        if len(img_data) == 0:
            raise ValueError(f"Downloaded file is empty for URL: {img_url}")

        with open(file_name, 'wb') as handler:
            handler.write(img_data)
        print(f"Downloaded image: {file_name}")
    except Exception as e:
        print(f"Failed to download image from {img_url}: {e}")




