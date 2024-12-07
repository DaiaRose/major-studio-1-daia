import json
import pandas as pd
import re

# Mappings
type_mapping = {
    'dessert': ['dessert', 'Ice-Cream', 'Cake', 'Sugar'],
    'folding': ['folding', 'Folding'],
    'knife': ['knife', 'Knife', 'Knives'],
    'fork': ['fork', 'Fork', '"Tipsy Tavener"'],
    'spoon': ['spoon', 'Ladle', 'ladle', 'Spoon'],
    'stick': ['skewer', 'Skewer', 'Toothpick', 'nutpick', 'Chopsticks', 'Chopstick', 'chopstick', 'chopsticks'],
    'utensil': ['Server', 'spreader', 'Spreader', 'Scoop', 'Sifter', 'Shears', 'corkscrew', 'Scraper', 'tongs', 'Tongs', 'Strainer', 'Peeler', 'peeler', 'pliers']
}

material_mapping = {
    'animal': ['ivory', 'antler', 'bone', 'skin', 'sharkskin', 'hoof', 'leather', 'horn'],
    'plant': ['wood', 'fiber', 'paper'],
    'metal': ['steel', 'silver', 'brass', 'gold', 'pewter', 'copper', 'metal'],
    'shell': ['pearl', 'shell', 'tortoise'],
    'other': ['lacquer', 'porcelain', 'stone', 'plastic', 'enamel', 'glass'],
}

from fractions import Fraction

# Helper function to convert dimensions to float
def convert_to_float(value):
    try:
        # Handle mixed fractions like "7 1/2"
        if " " in value:
            whole, fraction = value.split()
            return float(whole) + float(Fraction(fraction))
        # Handle simple fractions like "1/2"
        elif "/" in value:
            return float(Fraction(value))
        # Handle whole numbers
        else:
            return float(value)
    except ValueError:
        return None


# Function to map type
def map_type(title, type_mapping):
    title_lower = title.lower()
    for type_category, keywords in type_mapping.items():
        for keyword in keywords:
            if keyword.lower() in title_lower:
                return type_category, keyword.lower()
    return None, None

# Function to map material
def map_material(materials, mapping):
    for mat in materials:
        for category, keywords in mapping.items():
            if mat in keywords:
                return category
    return "unknown"

# Function to process dates into a single year
def process_date(date_content):
    date_content = date_content.lower().strip()  # Normalize the string

    # Match a single year (e.g., "1926")
    if re.match(r"^\d{4}$", date_content):
        return int(date_content)

    # Match a year range (e.g., "1809–19" or "1809–1819") and take the first year
    if re.match(r"^\d{4}\s*[-–]\s*\d{2,4}$", date_content):
        years = re.split(r"[-–]", date_content)  # Use re.split for regex
        start_year = int(years[0].strip())
        return start_year

    # Match approximate single year (e.g., "ca. 1893")
    if date_content.startswith(("ca ", "ca.", "c. ")):
        approx_year = re.sub(r"(ca |ca\.|c\. )", "", date_content).strip()
        if approx_year.isdigit():
            return int(approx_year)

    # Match centuries (e.g., "19th century", "mid-19th century")
    century_match = re.match(r"^(early|mid|late)?\s*(\d{1,2})(st|nd|rd|th)? century$", date_content)
    if century_match:
        period, century, _ = century_match.groups()
        base_year = (int(century) - 1) * 100
        if period == "early":
            return base_year + 25
        elif period == "mid":
            return base_year + 50
        elif period == "late":
            return base_year + 75
        return base_year

    # Match centuries with multiple periods (e.g., "early–mid-19th century")
    multi_period_century_match = re.match(r"^(early|mid|late)[-–](early|mid|late)?\s*(\d{1,2})(st|nd|rd|th)? century$", date_content)
    if multi_period_century_match:
        first_period, _, century, _ = multi_period_century_match.groups()
        base_year = (int(century) - 1) * 100

        # Use the first period's year as the representative year
        period_years = {
            "early": base_year + 25,
            "mid": base_year + 50,
            "late": base_year + 75,
        }
        return period_years.get(first_period, base_year)

    # Match decades (e.g., "2010s")
    decade_match = re.match(r"^(\d{4})s$", date_content)
    if decade_match:
        return int(decade_match.group(1))

    # Default fallback for unrecognized formats
    return None

# Function to extract countries
def extract_countries(place_content):
    if not place_content:
        return ["Unknown"]
    place_content = re.sub(r"^(probably|possibly|likely)\s+", "", place_content.strip().lower())
    return [place_content.title()]

# Processing function
def process_json(input_path, output_path):
    with open(input_path, 'r') as infile:
        raw_data = json.load(infile)
    
    cleaned_data = []
    for entry in raw_data:
        ID = entry.get("id", "Unknown")
        title = entry.get("title", "Unknown")
        link = entry.get("link", "")
        image = entry.get("image", "")
        dept = entry.get("dept", "Unknown")

        # Map type and subtype
        type_, subtype = map_type(title, type_mapping)

        # Extract and classify materials
        materials = []
        length, width = None, None  # Only length and width are needed
        for desc in entry.get("description", []):
            if desc.get("label", "").lower() in ["physical description", "medium"]:
                raw_materials = re.split(r",\s*| and ", desc.get("content", ""))
                materials.extend([re.sub(r"\s*\(.*?\)", "", mat).strip().lower() for mat in raw_materials])
            if desc.get("label", "").lower() == "dimensions":
                dimensions_match = re.search(r"\(([^)]+)\)", desc.get("content", ""))
                if dimensions_match:
                    dimensions = dimensions_match.group(1)
                    # Extract length and width, ignoring depth
                    dims = re.findall(r"[\d\s./]+", dimensions)  # Match numbers, spaces, and fractions
                    if len(dims) >= 1:
                        length = convert_to_float(dims[0])  # First value is length
                    if len(dims) >= 2:
                        width = convert_to_float(dims[1])  # Second value is width


        material = map_material(materials, material_mapping)
        submaterials = ", ".join(materials)

        # Process dates
        date_data = entry.get("date", [])
        year = None
        for date in date_data:
            if date.get("label", "").lower() in ["date made", "date"]:
                year = process_date(date.get("content", ""))
                if year:
                    break

        # Extract places
        places = [place.get("content", "") for place in entry.get("place", [])]

        # Process all places and handle multiple countries
        countries = []
        for place in places:
            countries.extend(extract_countries(place))
        countries = list(set(countries))  # Deduplicate the list
        
        small_image = f"{image}&max=300" if image else None

        # Append cleaned entry
        cleaned_data.append({
            "ID": ID,
            "title": title,
            "type": type_,
            "subtype": subtype,
            "material": material,
            "submaterial": submaterials,
            "length": length,  # Add length
            "width": width,    # Add width
            "year": year,
            "country": countries,
            "link": link,
            "dept": dept,
            "image": image,
            "small_image": small_image
        })
    
    # Write the cleaned data to a new JSON file
    with open(output_path, 'w') as outfile:
        json.dump(cleaned_data, outfile, indent=4)

# Paths to the JSON files
input_json_path = 'data_img.json'
output_json_path = 'cleaned_new_data.json'

# Process the data
process_json(input_json_path, output_json_path)

print(f"Data has been cleaned and saved to {output_json_path}.")

