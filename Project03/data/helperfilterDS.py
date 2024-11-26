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
    'stick': ['skewer', 'Skewer', 'Toothpick', 'nutpick','Chopsticks', 'Chopstick','chopstick', 'chopsticks'],
    'utensil': ['Server', 'spreader', 'Spreader', 'Scoop', 'Sifter', 'Shears', 'corkscrew', 'Scraper', 'tongs', 'Tongs', 'Strainer', 'Peeler', 'peeler', 'pliers']
}

material_mapping = {
    'animal': ['ivory', 'antler', 'bone', 'skin', 'sharkskin', 'hoof', 'leather', 'horn'],
    'plant': ['wood', 'fiber'],
    'metal': ['steel', 'silver', 'brass', 'gold', 'pewter', 'copper', 'metal'],
    'shell': ['pearl', 'shell', 'tortoise'],
    'other': ['lacquer', 'porcelain', 'stone', 'plastic', 'enamel', 'glass'],
}

# Function to map type
def map_type(title, type_mapping):
    title_lower = title.lower()  # Normalize the title to lowercase
    matched_types = []
    matched_subtypes = []

    for type_category, keywords in type_mapping.items():
        for keyword in keywords:
            if keyword.lower() in title_lower:  # Check if the keyword exists in the title
                matched_types.append(type_category)
                matched_subtypes.append(keyword.lower())
                break  # Stop after finding a match for the current category

    if matched_types:
        # Return the first matched type and the associated subtype
        return matched_types[0], matched_subtypes[0] if matched_subtypes else None
    return None, None


# Function to map material
def map_material(materials, mapping):
    mapped = [mapping.get(material.split(' ')[0].lower(), material) for material in materials]
    return mapped[0] if mapped else None, mapped[1] if len(mapped) > 1 else None


def extract_countries(place_content):
    if not place_content:
        return ["Unknown"]

    # Debugging: log raw input
    print(f"Raw Place Content: {place_content}")

    # Normalize the input
    place_content = place_content.strip().lower()

    # Remove prefixes like "probably", "possibly", or "likely"
    place_content = re.sub(r"^(probably|possibly|likely)\s+", "", place_content)

    # Handle cases like "United States: California"
    if ":" in place_content:
        place_content = place_content.split(":")[0].strip()  # Keep only the part before the colon

    # Split the content into multiple places using delimiters: "/", ",", or "and"
    parts = re.split(r"[\/,]| and ", place_content)  # Split on "/", "," or "and"
    parts = [part.strip() for part in parts if part.strip()]  # Remove extra spaces and empty entries

    # Special cases mapping
    special_cases = {
        "usa": "United States",
        "united states": "United States",
        "california": "United States",
        "los angeles": "United States",
        "new york, usa": "United States",
        "england": "UK",
        "united kingdom": "UK",
        "world": "Global",
        "europe": "Europe",
        "eurasia": "Eurasia",
        "africa": "Africa",
        "austria-hungary": "Austria-Hungary",
    }

    # Normalize each part and handle special cases
    cleaned_parts = []
    for part in parts:
        # Map special cases or default to title case
        cleaned_part = special_cases.get(part, part.title())
        if cleaned_part not in cleaned_parts:
            cleaned_parts.append(cleaned_part)

    # Handle redundancy: If a broader category (e.g., "United States") exists, remove specifics
    broader_categories = {"France", "UK", "United States", "Germany", "Netherlands", "Italy"}
    filtered_parts = [
        part for part in cleaned_parts 
        if part not in broader_categories or not any(cat in cleaned_parts for cat in broader_categories)
    ]

    # Debugging: log cleaned results
    print(f"Processed Places for '{place_content}': {filtered_parts}")

    # Return all valid cleaned parts, or "Unknown" if empty
    return filtered_parts if filtered_parts else ["Unknown"]






# Helper function to process dates into a single year
def process_date(date_content):
    date_content = date_content.lower().strip()  # Normalize the string

    # Match a single year (e.g., "1926")
    if re.match(r"^\d{4}$", date_content):
        return int(date_content)

    # Match a year range (e.g., "1595–1700") and take the first year
    if re.match(r"^\d{4}–\d{4}$", date_content):
        start_year = int(date_content.split("–")[0])
        return start_year

    # Match approximate ranges (e.g., "ca. 1595–1700")
    if date_content.startswith(("ca ", "ca.", "c. ")):
        cleaned_content = re.sub(r"(ca\. |ca |c\. )", "", date_content).strip()  # Remove approximation
        if "–" in cleaned_content:  # Handle range in approximated dates
            start_year = int(cleaned_content.split("–")[0])
            return start_year
        if cleaned_content.isdigit():  # Handle single approximated year
            return int(cleaned_content)

    # Match approximate single year (e.g., "ca 1893", "c. 1893")
    if date_content.startswith(("ca ", "c. ")):
        approx_year = re.sub(r"(ca |c\. )", "", date_content).strip()
        if approx_year.isdigit():
            return int(approx_year)

    # Match centuries (e.g., "19th century")
    century_match = re.match(r"^(\d{1,2})(st|nd|rd|th) century$", date_content)
    if century_match:
        century = int(century_match.group(1))
        year = (century - 1) * 100
        return year

    # Match decades (e.g., "2010s")
    decade_match = re.match(r"^(\d{4})s$", date_content)
    if decade_match:
        decade_start_year = int(decade_match.group(1))
        return decade_start_year

    # Default fallback for unrecognized formats
    return None











# Process the JSON file
# Updated processing logic for dates
def process_json(input_path, output_path):
    with open(input_path, 'r') as infile:
        raw_data = json.load(infile)
    
    cleaned_data = []
    for entry in raw_data:
        ID = entry["id"]
        title = entry["title"]
        
        # Map type and subtype
        type_, subtype = map_type(title, type_mapping)

        


        # Extract and classify materials
        materials = []
        for desc in entry.get("description", []):
            if desc.get("label", "").lower() in ["physical description", "medium"]:
                # Split materials by commas or "and"
                raw_materials = re.split(r",\s*| and ", desc["content"])
                # Remove annotations in parentheses and clean up whitespace
                materials.extend([re.sub(r"\s*\(.*?\)", "", mat).strip().lower() for mat in raw_materials])

        # Classify materials using the material_mapping
        classified_materials = []
        for mat in materials:
            found_category = None
            for category, keywords in material_mapping.items():
                if mat in keywords:
                    found_category = category
                    break
            classified_materials.append(found_category if found_category else "unknown")

        # Assign the first classified material as the primary material
        material = classified_materials[0] if classified_materials else "unknown"
        submaterial = ", ".join(materials) if materials else ""


        
        # Process dates
        date_data = entry.get("date", [])
        year = None
        for date in date_data:
            if date.get("label", "").lower() in ["date made", "date"]:  # Check for multiple labels
                year = process_date(date.get("content", ""))
                if year:
                    break

        
        # Extract country
        # Extract and clean countries
        # Extract places
        places = [
            place.get("content", "") 
            for place in entry.get("place", []) 
            if any(keyword in place.get("label", "").lower() for keyword in ["place", "place made", "made in"])

        ]
        countries = extract_countries(places[-1]) if places else ["Unknown"]








        
        # Append cleaned entry
        cleaned_data.append({
            "ID": ID,
            "type": type_,
            "subtype": subtype,
            "material": material,
            "submaterial": submaterial,
            "year": year,
            "country": countries if isinstance(countries, list) else [countries]
        })
    
    # Write the cleaned data to a new JSON file
    with open(output_path, 'w') as outfile:
        json.dump(cleaned_data, outfile, indent=4)


# Paths to the JSON files
input_json_path = 'cutleryOrig.json'  # Update this with the path to your input file
output_json_path = 'cleaned_data1.json'  # Update this with the desired output file path (1 had country better)

# Process the data
process_json(input_json_path, output_json_path)

print(f"Data has been cleaned and saved to {output_json_path}.")
