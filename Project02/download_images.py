

#THIS ALL WORKS BUT OUPUTS JSON AND KWICDATA OBJECT IN HERE IS JSON FORMAT
import requests

from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin

# Directory to save images
image_dir = 'Data/Images'

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

# Example kwicData structure (replace with your actual data)
kwicData = {
  "it was not produced because a successful rival, the Liberty, was lighter and": {
    "image": "",
    "text": "Although this engine eventually developed about 298 kW (400 hp), it was not produced because a successful rival, the Liberty, was lighter and had the same power. Only one V-4 was made. It powered a hydro-plane speed boat, \"Miss Miami,\" which at one time held a world speed record of 106 km/hr (66 mph). View more: http://n2t.net/ark:/65665/nv9749637f9-76ed-48fa-96fb-ae050ea23a83"
  },
  "is the F2 rebuilt after a crash in 1967.": {
    "image": "",
    "text": "This M2-F3 lifting body was the first of the wingless lifting body research craft of the 1960s. It tested the concept of achieving aerodynamic lift from just the shape of wingless craft, a concept used in the Space Shuttle. This F3 is the F2 rebuilt after a crash in 1967. View more: http://n2t.net/ark:/65665/nv94fd95aa5-da43-4976-8c46-2176b13d7b23"
  },
  "is one of general aviation\'s great success stories. This classic airplane first flew": {
    "image": "",
    "text": "The Beechcraft Bonanza is one of general aviation\'s great success stories. This classic airplane first flew in 1947 and is still in continuous production with a conventional tail rather than the distinctive V-tail with which it first flew. In addition to a generous acceptance within the aviation world, where it is regarded as the Cadillac of the single-engine light-plane field, the Bonanza also rated high marks in the industrial design field. In a survey of 100 leading designers, design teachers, and architects, published in Fortune magazine, April 1959, the Bonanza was rated as one of the 100 best designs of mass-produced products. View more: http://n2t.net/ark:/65665/nv9b75a8607-9f81-40d6-86c0-40bf8683678f"
  },
  "unable to do so before he died in 1971. The airplane was willed": {
    "image": "",
    "text": "NC11Y was retired sometime after 1934 and was sold to Frederick B. Lee, who outfitted it with floats for a projected round-the-world flight. The project was not completed, and the veteran Alpha passed through the hands of a succession of owners until purchased by Foster Hannaford, Jr., of Winnetka, Illinois, in May 1946. Hannaford hoped to restore the Alpha to flying condition, but was unable to do so before he died in 1971. The airplane was willed to the Experimental Aircraft Association (EAA) in Hales Corners, Wisconsin. View more: http://n2t.net/ark:/65665/nv99220332c-37aa-4592-840d-857ef42de15f"
  },
  "see his Spitfire reach production; he died of cancer on June 11,1937, at": {
    "image": "",
    "text": "On March 5,1936, Spitfire prototype K5054 took off from Eastleigh Airfield, Southhampton, on its maiden flight. After official trials at Martlesham Heath, a specification covering further development of the Spitfire was drawn up. On June 3,1936, an order for 310 planes was placed by the Air Ministry. R. J. Mitchell did not live to see his Spitfire reach production; he died of cancer on June 11,1937, at the age of forty-two. But the groundwork had now been established, and J. Smith, his chief draftsman, took his place as chief designer. View more: http://n2t.net/ark:/65665/nv9467d375e-5f57-4781-b30b-e6fe4a757763"
  },
  "all five Lunar Orbiters were proposely crashed onto the Moon to prevent their": {
    "image": "",
    "text": "After depleting their film supplies, all five Lunar Orbiters were proposely crashed onto the Moon to prevent their radio transmitters from interfering with future spacecraft. The item on display is an engineering mock-up of the spacecraft built by the Boeing Company obtained by the National Air and Space Museum in 1970. View more: http://n2t.net/ark:/65665/nv9c8bc3ef7-b6af-450d-8d98-df115d8e68ff"
  },
  "was the site of the first successful flight of a powered, heavier-than-air flying": {
    "image": "",
    "text": "In 1935 when the Flea was near the peak of its popularity, an American entrepreneur and the president of the Crosley Radio Corporation, Powel Crosley, Junior, obtained a copy of Mignet\'s book \"Le Sport de l\'Air.\" The airplane immediately appealed to Crosley and he ordered his personal pilot, Edward Nirmaier, to build one. With the help of Dan Boedeker and Herb Junkin, Nirmaier began construction on October 1, 1935. Funded by Crosley, he used materials readily available near the airport at Sharonville, Ohio. He even scrounged an ABC Scorpion engine. Nirmaier made the first test flight exactly one month later on November 1. This became the first HM.14 built in the United States. Nirmaier had adhered closely to Mignet\'s plans in constructing the aircraft, deviating only in the methods used to weld several parts. Powel\'s daughter, Page, christened the plane La Cucaracha (The Cockroach) using a bottle containing water from the Atlantic Ocean near Kitty Hawk, North Carolina. This was the site of the first successful flight of a powered, heavier-than-air flying machine, the 1903 Wright Flyer (see NASM collection). The U. S. Bureau of Air Commerce licensed the airplane as the experimental Crosley Flea. View more: http://n2t.net/ark:/65665/nv938fcd705-2957-4285-ad9f-418708754876"
  },
  "engine powered Travel Air low-wing aircraft won first place in its class at": {
    "image": "",
    "text": "The Chevrolet Brothers Aircraft Company, owned by Swiss immigrants Arthur and Louis Chevrolet, well known designers of automobile engines and drivers of race cars, designed this in-line, inverted four-cylinder aircraft engine. In advertisements, Louis Chevrolet was quoted as saying \"Upside down is right side up.\" For among the advantages of the design were improved pilot visibility and propeller ground clearance. Designated Model D-4, the engine was certificated in December 1929, and became known as the Chevrolair. A D-4 engine powered Travel Air low-wing aircraft won first place in its class at the September 1930 Cleveland National Air Races. View more: http://n2t.net/ark:/65665/nv9b41000fb-14f1-4b96-b746-74e7648b4cf1"
  },
  "In 1925, Continental, a successful manufacturer of automotive engines, purchased the": {
    "image": "",
    "text": "In 1925, Continental, a successful manufacturer of automotive engines, purchased the rights for a Burt-McCollum single-sleeve valve engine design. Believing this technology might replace poppet valves in aircraft engines, Continental announced the R-790 engine in 1927, incorporating single-sleeve valves initially installed on a Wright 9-cylinder engine. It was never fully tested, but followed by the 7-cylinder R-794, for which five engines were ordered by the U.S. Navy in 1934. It was tested, but did not go into production. View more: http://n2t.net/ark:/65665/nv9ccc406fc-2d5d-4e8c-b497-b8722c0bd61c"
  },
  "the Douglas DC-3 became the most successful airliner in the formative years of": {
    "image": "",
    "text": "First flown in 1935, the Douglas DC-3 became the most successful airliner in the formative years of air transportation, and was the first to fly profitably without government subsidy. More than 13,000 DC-3s, both civil and military versions, U.S. and foreign built, were produced. Many are still flying. View more: http://n2t.net/ark:/65665/nv9fbd81657-308f-4658-aa45-0b5f983062a4"
  },
  "by dry cell batteries. Lubrication was achieved by a splash system. The oil": {
    "image": "",
    "text": "Jump spark ignition was used, energized by dry cell batteries. Lubrication was achieved by a splash system. The oil tank was located in front of the seat, holding approximately one liter (one quart) of oil. Fuel capacity was approximately 9.5 liters (2.5 gallons). View more: http://n2t.net/ark:/65665/nv9464f2655-123d-4279-81dd-26905ca397cf"
  },
  "Geographic Society, and was also a successful venture between government, military, and civilian": {
    "image": "",
    "text": "The National Geographic Magazine devoted several articles to the flight, widely disseminating the photographic, scientific, and engineering accomplishments to the general public. The flight was a public relations success for the Army and the National Geographic Society, and was also a successful venture between government, military, and civilian scientific interests. View more: http://n2t.net/ark:/65665/nv962f5bc1e-7582-4a73-9bf1-6c2ffbb87ecf"
  },
  "241.5 km/h (150 mph). With an accomplished pilot at the controls, the Senior": {
    "image": "",
    "text": "Performance calculations revealed a best glide ratio of 23:1 when flying at 64.4 km/h (40 mph). If it became necessary, the pilot of a Senior Albatross could push his mount well over 161 km/h (100 mph) as long as he never exceeded a speed of 241.5 km/h (150 mph). With an accomplished pilot at the controls, the Senior Albatross could fly better than any other American sailplane and they were very pleasing to look at, too. A quotation from the July 1934 issue of \"Aviation,\" a popular aviation periodical of the day, sums up one writer\'s impressions of the Senior Albatross: View more: http://n2t.net/ark:/65665/nv98a89a660-da60-4d0f-bc9a-85b16f3b09b0"
  },
  "proven components were used. The Liberty\'s success was due entirely to the fact": {
    "image": "",
    "text": "To ensure workable engines in the shortest time, only proven components were used. The Liberty\'s success was due entirely to the fact that the best engineers, production experts, and manufacturing facilities were provided to the Government. Leading automotive manufacturers, including Ford, Lincoln, Packard, Marmon, and Buick, built the engines. View more: http://n2t.net/ark:/65665/nv936cb0c07-7818-491f-8adb-419285fd468f"
  },
  "making it one of the most successful reciprocating engines ever built in its": {
    "image": "",
    "text": "The Wasp Jr. R-985 was the third engine type designed by Pratt & Whitney Aircraft, following the Wasp R-1340 and Hornet R-1690, all of which were nine-cylinder engines. Virtually a Wasp of reduced dimensions, the Wasp Jr. followed closely the details of construction throughout. The Wasp Jr., originally rated at 224 kW (300 hp), was first type certificated in January 1930. Designed for light transports, trainers, sport aircraft, and helicopters, number of R-985 models were made, most at 298 kW (400 hp) or more power. The R-985 powered a wide variety and large number of military and commercial aircraft, making it one of the most successful reciprocating engines ever built in its power class. View more: http://n2t.net/ark:/65665/nv9fbb3148f-8592-48c6-ad49-d7ce32430071"
  },
  "The success of the Beech 18 ensured the": {
    "image": "",
    "text": "The success of the Beech 18 ensured the success of Beech Aircraft Corporation throughout the 1940s. Beech introduced the D-18S model in October 1945, with structural modifications for increased payload and new engines and landing gear. Mike Mitchell operated N522B as an air ambulance for fifteen years, flying it a million and one-quarter miles and transporting nearly fifteen thousand patients. View more: http://n2t.net/ark:/65665/nv977d39ad6-3afe-4495-8d26-c81de6747e75"
  },
  "valve failures and a crank shaft failure during the engine and flight tests,": {
    "image": "",
    "text": "The M-18 Mite was designed in 1946 and was first test flown on May 17, 1947 by test pilot Bill Taylor. Performance was acceptable but some high angle of attack buffeting was encountered. This was corrected through wing leading edge modifications and the addition of a trailing edge wing root fillet. However, the most severe problem was the modified 25 hp Crosley automobile engine conversion used to power the airplane. With a series of exhaust valve failures and a crank shaft failure during the engine and flight tests, the finall CAA certification was delayed until July 30, 1948. The Crosley powered M18s were subsequently retrofitted with the 65 hp 0-145 Lyncoming engine. This made a major improvement in the overall performance which included an increase in the top speed from 100 mph to 138 mph. View more: http://n2t.net/ark:/65665/nv9d9ecbb4f-6ee6-44ac-972c-b0d9234ebbaf"
  },
  "on March 17, 1958, the first successful Vanguard satellite was launched as Vanguard": {
    "image": "",
    "text": "Meanwhile, on March 17, 1958, the first successful Vanguard satellite was launched as Vanguard 1 atop a Vanguard TV-3BU rocket. The TV-2BU rocket was thus never used in the program but was essentially a duplicate of the Vanguard 1 vehicle and had the same markings. This TV-2BU was donated to the Smithsonian in 1958 by the Naval Research Lab. View more: http://n2t.net/ark:/65665/nv9e1b8c9cd-b1a1-4274-ba5e-51332392aaee"
  },
  "and piloted by an improved engine, won second place with an average speed": {
    "image": "",
    "text": "On Oct. 26, 1925, U.S. Army Lt. James H. Doolittle flew the Curtiss R3C-2 to victory in the Schneider Trophy Race with an average speed of 374 km/h (232.17 mph). The next day he flew the R3C-2 over a straight course at a world-record speed of 395 km/h (245.7 mph). In the Schneider Trophy Race of Nov. 13, 1926, this same airplane piloted by Lt. Christian F. Schilt, USMC, and piloted by an improved engine, won second place with an average speed of 372 km/h (231.4 mph). View more: http://n2t.net/ark:/65665/nv94b310090-4d87-4794-98fd-61214ee05ddc"
  },
  "so many people, to see me accomplish what I had, as a woman.\"": {
    "image": "",
    "text": "This Geraldine Ferraro campaign button was owned by Dr. Sally K. Ride. Ferraro was Walter Mondale\'s running mate on the Democratic ticket in the 1984 presidential election, and had she been elected, she would have been America\'s first woman Vice President. During her acceptance speech at the party convention, Ferraro cited Sally Ride\'s achievement as the first American woman in space as evidence that \"change is in the air.\" Ride saw Ferraro\'s nomination as inspirational, and said about the DNC speech, \"I was as moved by that as many women had been by my flight into space. For the first time, I understood why it was such an emotional experience for so many people, to see me accomplish what I had, as a woman.\" Ride was a strong supporter of Ferraro and visited her at her congressional office a few months prior to the election, posing for photos with her and a t-shirt that Ride had given her bearing the vice-presidential insignia. View more: http://n2t.net/ark:/65665/nv9062025d5-08a2-4cb7-b813-277dbaee77fc"
  },
  "(see NASM collection), and the near tragedy that followed Gus Grissom\'s splashdown in": {
    "image": "",
    "text": "Australian Bill Bennett helped promote hang gliding in the late 1960s and early 1970s. Bennett\'s first gliders were kites for water skiers, such as the Model 162. He based these designs on a flexible wing that Francis Rogallo evaluated while working for the National Aeronautics and Space Administration (NASA). The space agency hoped to develop a recovery system for Gemini and Apollo capsules (see NASM collection) that allowed astronauts to steer the capsule to a landing as an alternative to unguided parachutes. The difficulties the agency experienced trying to recover the Mercury capsules (see NASM collection), and the near tragedy that followed Gus Grissom\'s splashdown in July 1961, no doubt encouraged NASA to investigate alternative capsule recovery systems. View more: http://n2t.net/ark:/65665/nv9fc3f1d71-9732-4d53-a165-ce0a7097e54d"
  },
  "speed of sound, Mach 2. He accomplished this feat while flying the experimental": {
    "image": "",
    "text": "On the morning of November 20, 1953, A. Scott Crossfield became the first pilot to fly at twice the speed of sound, Mach 2. He accomplished this feat while flying the experimental air-launched rocket-propelled Douglas D-558-2 #2 Skyrocket. This sweptwing research plane attained Mach 2.005 (1,291 mph) while in a shallow dive at an altitude of 62,000 feet. Seconds afterward, the plane\'s XLR-8 rocket engine exhausted its fuel supply and shut down. Crossfield glided earthward to a smooth dead-stick landing on Muroc Dry Lake, at Edwards Air Force Base, California. View more: http://n2t.net/ark:/65665/nv995af0e86-2a73-4094-8c83-d6c31dcc7ecc"
  },
  "themselves, Langley had his first genuine success on May 6, 1896, with his": {
    "image": "",
    "text": "Samuel Pierpont Langley became the third Secretary of the Smithsonian Institution in 1887. In 1891, he began experiments with large, tandem-winged models powered by small steam and gasoline engines he called aerodromes. After several failures with designs that were too fragile and under-powered to sustain themselves, Langley had his first genuine success on May 6, 1896, with his Aerodrome Number 5. It made the world\'s first successful flight of an unpiloted, engine-driven, heavier-than-air craft of substantial size. It was launched from a spring-actuated catapult mounted on top of a houseboat on the Potomac River near Quantico, Virginia. Two flights were made on May 6, one of 1,005 m (3,300 ft) and a second of 700 m (2,300 ft), at a speed of approximately 40 kph (25 mph). On both occasions, the Aerodrome Number 5 landed in the water, as planned, because, in order to save weight, it was not equipped with landing gear. View more: http://n2t.net/ark:/65665/nv938196f32-a24c-4396-b441-2f691f9c5248"
  },
  "masked design flaws that resulted in failed attempts to fly a full-scale piloted": {
    "image": "",
    "text": "Samuel Langley tried to scale up his unpiloted Aerodromes of 1896 to human-carrying proportions. Flights of his quarter-scale Aerodrome (1901-1903) masked design flaws that resulted in failed attempts to fly a full-scale piloted Aerodrome A in 1903. View more: http://n2t.net/ark:/65665/nv91dfdc703-de99-4a01-8a7b-4146ab61a5dc"
  },
  "gear was weak and prone to failure.": {
    "image": "",
    "text": "The Dornier Do 335 was one of the fastest propeller-driven aircraft ever flown. The Germans claimed that a pilot flew a Do 335 at a speed of 846 km/h (474 mph) in level flight at a time when the official world speed record was 755 km/h (469 mph). Two liquid-cooled engines each developing about 1,750 hp powered the Do 335. Dornier mounted one engine in the nose and the other in the tail in a unique low-drag push-pull configuration. This innovative design also featured an ejection seat, a tail fin which the pilot could jettison, and tricycle landing gear. For a fighter airplane, the Do 335 was enormous: tall enough that a person of normal height could walk beneath it and very heavy at 9,600 kg (21,000 lb) loaded. Serious flaws also plagued the design. The rear engine overheated often and the landing gear was weak and prone to failure. View more: http://n2t.net/ark:/65665/nv9a646c464-e9e0-43dc-aa15-5fcd6f6ea9b3"
  },
  "difficult, and globally more missions have failed than have succeeded in accomplishing what": {
    "image": "",
    "text": "But reaching Mars has always been difficult, and globally more missions have failed than have succeeded in accomplishing what they set out to do. Early on, there were spectacular failures, but even in the last fifteen years there have been several failures. Until Curiosity\'s successful landing, out of 40 missions, only 16 have been successful. This means that overall any individual Mars mission has a 1 in 3 chance of success. That is not a bad batting average in major league baseball, but for the limited number of chances we have for reaching Mars with individual missions we have to increase our success rate. View more: http://n2t.net/ark:/65665/nv9715679d6-5fdd-49d2-978b-2f1fcc42e13c"
  },
  "a follow-on component to the first successful aircraft autopilot, demonstrated by Sperry in": {
    "image": "",
    "text": "Elmer Sperry developed the Stallemometer as a follow-on component to the first successful aircraft autopilot, demonstrated by Sperry in 1914. The Stallemometer detected a stall flutter and then function as a switch to drop the nose by twenty degrees through the autopilot until a stall recovery occurred. A light provided a further warning that the stall had occurred and a recovery was underway. Like the autopilot itself, the Stallemometer was not seen by aviators as a desirable innovation due to cost, weight, complexity and its subsuming of pilot control over the flight. Such systems did enjoy a resurgance fifty years later as increasing levels of autopilot autonomy became standard on larger transport aircraft. View more: http://n2t.net/ark:/65665/nv9b9274e0c-8d92-4c2b-82b2-d12ad7629168"
  },
  "Mariner 10 was the seventh successful launch in the Mariner series and": {
    "image": "",
    "text": "Mariner 10 was the seventh successful launch in the Mariner series and the first spacecraft to use the gravitational pull of one planet (Venus) to reach another (Mercury). It was also the first probe to visit two planets. Launched on November 3, 1973, it reached Venus on February 5, 1974. Using a gravity assist from this planet, Mariner 10 first crossed the orbit of Mercury on March 29, 1974 and did so a second time on September 21, 1974. A third and last Mercury encounter took place on March 16, 1975. It measured the environments of both Venus and Mercury. It then undertook experiments in the interplanetary medium. Mariner 10 showed that Venus had at best a weak magnetic field, and the ionosphere interacted with the solar wind to form a bow shock. At Mercury, it confirmed that Mercury had no atmosphere and a cratered, dormant Moon-like surface. View more: http://n2t.net/ark:/65665/nv9ed15a631-e765-48d2-8456-b21bb3ea9fc5"
  },
  "Quickie drew intense public interest and won the Outstanding New Design award. By": {
    "image": "",
    "text": "In 1974, Tom Jewett and Gene Sheehan decided to begin designing an airplane that would provide \"more flying enjoyment for less money\" than other homebuilt aircraft designs popular at that time. Burt Rutan (Rutan VariEze and Voyager, see NASM collection) assisted Jewett and Sheehan in the design work and the first Quickie was finished, tested in flight, and ready for a public introduction by April 1978. In June, the two men formed the Quickie Aircraft Corporation to produce and sell complete kits to build the aircraft. They flew the airplane to the Experimental Aircraft Association\'s annual gathering at Oshkosh, Wisconsin, in June where the Quickie drew intense public interest and won the Outstanding New Design award. By 1980, the firm had sold 350 kits. View more: http://n2t.net/ark:/65665/nv9bc1bc526-ced3-421b-95bb-c578cb7387bb"
  },
  "of this class: two for altitude achieved, two for sustained flight at 51,000": {
    "image": "",
    "text": "Between May 17 and 19, 1976, during the American bicentennial year, Arnold Palmer and James Bir flew a Model 36 from Denver, Colorado, to set a round-the-world speed record. The flight time over a specifically recognized course was 48 hours and 48 minutes for an average speed of 400.23 mph. Flying a Model 28 on February 19-20, 1979, Neil Armstrong set five world records for an aircraft of this class: two for altitude achieved, two for sustained flight at 51,000 feet, and one for high-altitude time-to-climb. View more: http://n2t.net/ark:/65665/nv9fa5596f7-5c1b-4e21-af6c-441c44c6c499"
  },
  "survival hinged on the success or failure of the U-boat service to interdict": {
    "image": "",
    "text": "During World War 2, German naval strategy and Britain\'s survival hinged on the success or failure of the U-boat service to interdict the flow of material from the United States. However, the U-boats depended primarily on visual acquisition of their targets. They rode low in the water and a lookout could not see vessels more than 8 km (5 miles) away, even when surfaced. Small, submarine-launched aircraft offered a novel solution in regions free of enemy patrol aircraft. View more: http://n2t.net/ark:/65665/nv94a2d70c8-bafe-4215-8360-9efb361b5f8e"
  },
  "Ltd of Wolverhampton, England began producing successful automobiles in 1910. Applying the expertise": {
    "image": "",
    "text": "The Sunbeam Motor Car Co., Ltd of Wolverhampton, England began producing successful automobiles in 1910. Applying the expertise of French Chief Engineer Louis Coatalen, its first aircraft engines were designed in 1913. A total of 350 Cossack engines were produced between August 1914 and December 1918. These engines powered the: Handley Page H.P.11 O/100 Type O; Short 310-A4 and Short 310-B North Sea Scout; R36 (Beardmore) Admiralty dirigible airship and R38 (Royal Airship Works) Admiralty dirigible airship. Sunbeam’s engines were the favored supplier to the Royal Navy Air Service until late in World War I. After Coatalen’s return to France in 1923, Sunbeam effectively left the aircraft engine business. View more: http://n2t.net/ark:/65665/nv9f6eddcff-11c3-479f-9c14-f726c1afe5bb"
  },
  "moved to Havana, Cuba where Wesley died in 1955. Betty took the secret": {
    "image": "",
    "text": "Interest in the photograph collection faded with the advent of World War II. Archer held a job for a short time in 1945 as an associate editor for Scientific American. In 1952, the Archer\'s moved to Havana, Cuba where Wesley died in 1955. Betty took the secret of the photographs with her when she died in 1959. The truth about the Archer\'s hoax was discovered in the 1980\'s by Peter Grosz and NASM curatorial assistant Karl Schneide when the museum received the collection from Archer\'s friend, John Charlton. View more: http://n2t.net/ark:/65665/nv9086774a6-cf02-46e4-b612-abeed7c82216"
  },
  "time there, a Predator Hellfire strike killed Qaed Salim Sinan al-Harethi, who had": {
    "image": "",
    "text": "Predator number 3034 flew one hundred sixty-four operational sorties over Afghanistan between September 2001 and January 2003, with some missions lasting over twenty hours and an average of over fourteen hours. Between August and November 2002, during the middle of its operations from Uzbekistan, number 3034 undertook a detached deployment to another operational site where it flew thirty-two missions. This could have been either Operation Southern Focus over Iraq or deployment to Djibouti in the Horn of Africa to support a CIA surveillance program over Yemen. Given this aircraft’s close association with the CIA/Big Safari program, and the timing of initial operations from Djibouti, the latter scenario is more likely. During its probable time there, a Predator Hellfire strike killed Qaed Salim Sinan al-Harethi, who had masterminded the attack on the destroyer USS Cole. The National Air and Space Museum acquired Predator number 3034 in 2004 on the basis of its pivotal role in introducing armed RPAS into combat. View more: http://n2t.net/ark:/65665/nv98883bd76-aa82-4d4d-8a92-76fa5e942cc5"
  },
  "Blériot himself made substantial contributions. Blériot achieved immortality in the Type XI on": {
    "image": "",
    "text": "The Blériot Type XI was designed primarily by Raymond Saulnier, but it was a natural evolution from earlier Blériot aircraft, and one to which Louis Blériot himself made substantial contributions. Blériot achieved immortality in the Type XI on July 25, 1909, when he made the first airplane crossing of the English Channel, covering the 40 km (25 mi) between Calais and Dover in 36 minutes, 30 seconds. View more: http://n2t.net/ark:/65665/nv9732ea6e4-6232-417f-aa57-275b344fefdd"
  },
  "design was light weight, which was achieved through the extensive use of aluminum": {
    "image": "",
    "text": "An important objective of the Roberts Motor Company design was light weight, which was achieved through the extensive use of aluminum and magnesium alloys in the cylinders and crankcase, a hollow crankshaft, and two-stroke cycle operation (to reduce parts count). Between 1911 and 1912, Roberts engines were used by many noted exhibition pilots, and more Roberts engines were said to be built than by Hall-Scott and Curtiss combined. View more: http://n2t.net/ark:/65665/nv95a3d7435-ad53-4819-93d8-0c1f2ded7ce1"
  },
  "brother Charles, thus establishing the highly successful Appareils d\'Aviation Les Frères Voisin. The": {
    "image": "",
    "text": "Gabriel and Charles Voisin were among Europe\'s leading pioneer aviators. Gabriel began his formal aviation career in 1903 when he was engaged by a prominent French aeronautical promoter, Ernest Archdeacon, to build gliders for him. In 1905 he formed the first commercial aircraft manufacturing company in Europe with the soon-to-be famous Louis Blériot. Numerous disputes between the two quickly arose, however, and Voisin bought out Blériot\'s interest in the venture in 1906. He immediately reformed the company with his brother Charles, thus establishing the highly successful Appareils d\'Aviation Les Frères Voisin. The firm\'s first truly successful airplane appeared in 1907. View more: http://n2t.net/ark:/65665/nv9d833c1dd-f7e5-4ac8-a538-fb289101f899"
  },
  "stars and supernova remnants. After this successful mission it was modified to concentrate": {
    "image": "",
    "text": "Original 36-inch reflecting telescope that flew on the Shuttle twice as part of the ASTRO mission. It employs a medium dispersion spectrometer at a modified prime focus. It was designed to observe faint celestial objects in the ultraviolet region of the spectrum. On the first mission in December 1990 the instrument observed over 75 astronomical sources including active galactic nuclei, quasars, variable stars and supernova remnants. After this successful mission it was modified to concentrate on the relatively unknown far-ultraviolet region and flown on Astro-2 in March 1995. Observations from this second flight provided a wealth of data including the first clear detection of the distribution of intergalactic helium left over from the Big Bang. Its calculated distribution in the pre-galaxy formation Universe fits the bubble and void geometry seen in the earliest and present universe. The telescope was manufactured by the Center for Astrophysical Sciences and the Applied Physics Lab of Johns Hopkins University. It was transferred by NASA in 2001. View more: http://n2t.net/ark:/65665/nv90f5230d4-4c99-44da-8729-03fd13062406"
  },
  "plywood panels, exhibited high performance. It won races in 1922 and 1923 and": {
    "image": "",
    "text": "Bellanca visualized the C.F. as a commercial transport aircraft before a market really existed; therefore, only one C.F. was ever built. However, the beautifully crafted monoplane, with its high-lift struts and mahogany plywood panels, exhibited high performance. It won races in 1922 and 1923 and also hosted two aerial marriages. View more: http://n2t.net/ark:/65665/nv91ca36539-ccd2-432a-a5c6-880b36df5df2"
  },
  "earlier A and B models. Chotia died in October 1981, just days before": {
    "image": "",
    "text": "The Weedhopper model C first flew during August 1980. This version was much improved over the earlier A and B models. Chotia died in October 1981, just days before his 35th birthday, while testing another ultralight that he designed called the JC Rocket. Work stopped on the Rocket but continued on the Weedhopper. In 1983, the Weedhopper factory shipped a C model to California and asked graduate aeronautical engineering students at the California State Polytechnic University at Pomona to study the aircraft. After testing a Weedhopper inside the university wind tunnel, the students concluded that the Weedhopper had a very robust airframe that could withstand at least 8 Gs. View more: http://n2t.net/ark:/65665/nv95fba5c54-4c3c-4810-bd64-6d9fefca184c"
  },
  "Far more successful was the in-line-engined winner of the": {
    "image": "",
    "text": "Far more successful was the in-line-engined winner of the Adlershof competition, the Fokker V.11, which became the Fokker D.VII as a production airplane. The V.11 was largely the creation of Fokker\'s chief designer, Reinhold Platz. Platz was the true creative force behind the famous Fokker fighters of the second half of the war. He did most of the fundamental design work on the firm\'s aircraft after 1916. Anthony Fokker\'s talents were greater as a test pilot than as a designer. He had an innate ability to fly an experimental aircraft and know just what improvements needed to be made to turn it into a successful performer. This intuitive sense on the part of Fokker, combined with Platz\'s innovative preliminary designs, made them a formidable team. Fokker\'s ego and dominating personality frequently led him to understate Platz\'s role as the genuine innovator of the designs that bore the Fokker name, and he took undue credit for himself. Nevertheless, there is no denying the important contributions Fokker made to bringing Platz\'s designs to final form. This was especially true in the case of the Fokker D.VII. View more: http://n2t.net/ark:/65665/nv95c46bb85-5617-4c5b-9d97-e74642da69b4"
  },
  "Ocean. On March 20, 1937, Earhart crashed on takeoff at Luke Field, Honolulu,": {
    "image": "",
    "text": "Earhart decided to make a world flight and she planned a route as close to the equator as possible, which meant flying several long overwater legs to islands in the Pacific Ocean. On March 20, 1937, Earhart crashed on takeoff at Luke Field, Honolulu, Hawaii, ending her westbound world flight that had begun at Oakland, California. The Electra was returned to Lockheed Aircraft Company in Burbank, California, for extensive repairs. On June 1, 1937, Earhart began an eastbound around-the-world flight from Oakland, via Miami, Florida, in the Electra with Fred Noonan as her navigator. They reached Lae, New Guinea on June 29, having flown 22,000 miles with 7,000 more to go to Oakland. They then departed Lae on July 2 for the 2,556-mile flight to their next refueling stop, Howland Island, a two-mile long and less-than-a-mile wide dot in the Pacific Ocean. View more: http://n2t.net/ark:/65665/nv908b322a7-9925-4071-b2b2-26a162dc0fce"
  },
  "Among the group were pilots who accomplished significant flights at the controls of": {
    "image": "",
    "text": "Factory records suggest that Bowlus produced parts for about 90 aircraft. Pilot and historian, Jeff Byard, has attempted to trace the histories of each known Baby Albatross serial number. His work has shown that enthusiasts probably built and flew from 50 to 60. Among the group were pilots who accomplished significant flights at the controls of their Baby Albatrosses. Eastern Airlines Captain J. Shelly Charles of Atlanta made a number of impressive flights. He flew 423 km (263 miles) on one occasion and later soared to an altitude of more than 3,040 m (10,000 ft). On 6 June 1939, Woody Brown flew his Baby Albatross, \"Thunder Bird,\" a distance of 451 km (280 miles) from Wichita Falls, Texas, to Wichita, Kansas, a U. S. National record for distance flown to a declared goal. Dick Johnson\'s first win at the U. S. nationals came in 1940 at the controls of a Baby Albatross. According to Bowlus records, Florence \"Pancho Barnes\" Lowe, bought serial number 118 and kit units 1, 2, 3, and 4 were shipped to her by 15 December 1939, but no further information is known. After World War II, a saloon owned by Lowe at Muroc, California, called the Happy Bottom Riding Club, became a favorite meeting place for test pilots such as Scott Crossfield and Chuck Yeager. View more: http://n2t.net/ark:/65665/nv98a46b923-8268-4bd5-a488-a05f5fc2edb4"
  },
  "one roll of the dice and won.": {
    "image": "",
    "text": "In the early 1950s, Boeing had begun to study the possibility of creating a jet-powered military transport and tanker to complement the new generation of Boeing jet bombers entering service with the U.S. Air Force. When the Air Force showed no interest, Boeing invested $16 million of its own capital to build a prototype jet transport in a daring gamble that the airlines and the Air Force would buy it once the aircraft had flown and proven itself. As Boeing had done with the B-17, it risked the company on one roll of the dice and won. View more: http://n2t.net/ark:/65665/nv9648a79cf-05e2-41ff-8706-491f0109da9f"
  },
  "Laird LC-DW Solution racing aircraft which won the 1930 thomson Trophy race in": {
    "image": "",
    "text": "Balsa and metal display model of the Laird LC-DW Solution racing aircraft which won the 1930 thomson Trophy race in black and natural, uncovered structure paint scheme. 1/16 scale. View more: http://n2t.net/ark:/65665/nv9e4a62b71-d6a2-4b30-88a1-6c542406ceba"
  },
  "in which he crashed and was killed in 1912. To make the \"Vin": {
    "image": "",
    "text": "Originally, Wright airplanes flew with one left-handed and one right-handed propeller. However, both of the donated aircraft propellers were left-handed. The museum later received a right-handed propeller from a second Wright airplane owned by Rodgers, in which he crashed and was killed in 1912. To make the \"Vin Fiz\" more accurate, the museum installed that right-handed propeller on the displayed aircraft. This subject artifact is the remaining left-handed propeller from the original \"Vin Fiz\" donation. View more: http://n2t.net/ark:/65665/nv9e6915458-f767-4216-8e28-79f309d2f463"
  },
  "Following success of the smaller A.R.1 (Admiral Rotary": {
    "image": "",
    "text": "Following success of the smaller A.R.1 (Admiral Rotary 1), which was later renamed Model B.R.1 for Bentley Rotary 1, the larger B.R.2 rotary aircraft engine powered a variety of World War I aircraft, including, among others, the: Sopwith F.1 Camel and 7F.1 Snipe; Nieuport B.N.1; and Vickers F.B.26A Vampire II. Humber Ltd., one of five British companies that manufactured this model during World War I, built this Bentley B.R.2 artifact. View more: http://n2t.net/ark:/65665/nv9ea35967f-8803-4d39-ade3-4f9e945cac5e"
  },
  "in 1948, and with it she won the 1949 and \'50 International Feminine": {
    "image": "",
    "text": "Betty Skelton bought this airplane in 1948, and with it she won the 1949 and \'50 International Feminine Aerobatic Championships. Her impressive flying skill and public relations ability heightened awareness of both aerobatics and the Pitts design. Skelton sold Little Stinker in 1951, but she and her husband later reacquired it and donated it to the Smithsonian. A volunteer crew restored it from 1996 to 2001. View more: http://n2t.net/ark:/65665/nv933bb9a08-c5c1-4a03-ae00-7f0ce172b150"
  },
  "a relic of an ambitious but failed attempt to validate a new spaceplane": {
    "image": "",
    "text": "In 1996 NASA selected Lockheed Martin to build and fly the X-33 test vehicle to demonstrate advanced technologies for a new reusable launch vehicle to succeed the Space Shuttle. VentureStar was Lockheed\'s name for this future spaceplane concept. The Lockheed Skunk Works designed a lifting body shape with aerospike rocket engines and a metallic thermal protection system as a single-stage-to-orbit vehicle. The program was a joint NASA-industry effort to develop a new commercial launch vehicle, and the model bears decals of all the participating companies. NASA cancelled the project in 2001 before any test flights were carried out after some technical problems proved too difficult to solve. This model is a relic of an ambitious but failed attempt to validate a new spaceplane concept. View more: http://n2t.net/ark:/65665/nv9b81fe340-59e1-47bd-87b0-aac5fbee4c6f"
  },
  "pilot and designer Jon Sharp, it won nine consecutive Reno Gold National Championships": {
    "image": "",
    "text": "The most successful aircraft in air racing history, Nemesis dominated its competition, winning 47 of its 50 contests from 1991 until its retirement in 1999. Flown by pilot and designer Jon Sharp, it won nine consecutive Reno Gold National Championships and 16 world speed records for its class. View more: http://n2t.net/ark:/65665/nv9617e6bec-6e74-4e31-828a-1dcca07ec967"
  },
  "demonstrations, which were crucial to the success of the Wright brothers and their": {
    "image": "",
    "text": "The Wright vertical four-cylinder engine was designed by Orville Wright in 1906. These engines, of which more were built than any other Wright Brothers\' engine model, were produced until approximately 1912. They were used during the U.S. Army and European demonstrations, which were crucial to the success of the Wright brothers and their airplanes. An engine of this type powered the Vin Fiz, the first U.S. transcontinental aircraft, and Wright Model B aircraft. A Wright B1 was the U.S. Navy’s second aircraft, which was first flown by Orville Wright on July 15, 1911, and later converted to a “hydroaeroplane.” View more: http://n2t.net/ark:/65665/nv9e35a00ca-112e-4d16-9832-08aa6d37805d"
  },
  "of Lemont\" mid-wing racing monoplane which won the 1937 Thompson Trophy race in": {
    "image": "",
    "text": "Balsa wood, metal, and clear acetate display model of the Folkerts Speed King SK-3 \"Jupiter - Pride of Lemont\" mid-wing racing monoplane which won the 1937 Thompson Trophy race in an overall cream and red color scheme. 1/16 Scale. View more: http://n2t.net/ark:/65665/nv9873052d2-0e0a-480c-b803-41b04ff39d1f"
  },
  "pilots, and almost as many were killed in accidents as died in combat.": {
    "image": "",
    "text": "Unlike the earlier Sopwith Pup and Sopwith Triplane, which were docile to fly and well-liked by pilots, the Camel was unstable, requiring constant input from the pilot. The gyroscopic effects of its powerful rotary engine made it dangerous for novice pilots, and almost as many were killed in accidents as died in combat. But its instability also contributed to it being agile and maneuverable, and once its tricky characteristics were mastered, the Camel was a superior fighting airplane. View more: http://n2t.net/ark:/65665/nv998f27ffa-0985-46f3-a041-5cfa8a4cfe56"
  },
  "it is one of the most successful with nearly 2,700 built. After consulting": {
    "image": "",
    "text": "The Grumman G-164 Ag-Cat is the first aircraft specifically designed by a major aircraft company for agricultural aviation, the aerial application of chemical, fertilizer and seed, and it is one of the most successful with nearly 2,700 built. After consulting with agricultural pilots, Grumman introduced the Ag-Cat in 1957. The Ag-Cat handles the rigors of very low altitude, high \"g force\" agricultural application maneuvers with rugged construction, a low stall speed and good visibility. View more: http://n2t.net/ark:/65665/nv906f4e547-80ac-4d0a-8d58-24863101585b"
  },
  "commercial space station. It follows the successful and continuing missions of the unmanned": {
    "image": "",
    "text": "Sundancer, planned for launch early in the next decade, will be the first module built by Bigelow Aerospace capable of manned operation. It would support a crew of up to three for varying mission durations and eventually provide the backbone for the first commercial space station. It follows the successful and continuing missions of the unmanned Genesis I and Genesis II, which continue to test and verify systems for future commercial space habitats. View more: http://n2t.net/ark:/65665/nv9f299e493-8e5f-47da-89d2-2e323eccc96a"
  },
  "land or sea-based operation. The FB-3 crashed during Navy trials. Two more were": {
    "image": "",
    "text": "The other two aircraft in the first order of fourteen were slated to test the design with other engines, and were designated the FB-3 and the FB-4. The FB-3 was powered by a 510-horsepower Packard 1A-1500 water-cooled engine and the FB-4 was fitted with an experimental 450-horsepower Wright P-1 air-cooled radial. Both aircraft had a convertible landing gear, wheels or floats, for either land or sea-based operation. The FB-3 crashed during Navy trials. Two more were ordered for further testing, but they were later converted to standard Curtiss D-12-powered FB-1s. Development of the FB-4\'s Wright P-1 engine was dropped shortly after delivery of the airplane. It was re-designated the FB-6 when the Navy mounted an early Pratt & Whitney Wasp and continued land-based trials with it. View more: http://n2t.net/ark:/65665/nv9f289fe55-0c83-4ac1-a2c2-d6c7b0daf3e2"
  },
  "in the Army Air Service. He won his reserve commission and began serving": {
    "image": "",
    "text": "In 1922, after a year and a half at the University of Wisconsin, Lindbergh left to study aeronautics with the Nebraska Aircraft Corporation. He was a \"barnstormer\" until 1924, when he enrolled as a flying cadet in the Army Air Service. He won his reserve commission and began serving as a civilian airmail pilot, flying the route between St. Louis and Chicago. View more: http://n2t.net/ark:/65665/nv902b19e41-7d71-4e71-999a-957595426799"
  },
  "Cap Gris Nez, France. For this accomplishment, the Albatross team won their second": {
    "image": "",
    "text": "On June 12, 1979, the Gossamer Albatross, with Bryan Allen as pilot, became the first human-powered aircraft to fly across the English Channel. The flight lasted 2 hours and 49 minutes and covered 36.2 kilometers (22.5 miles) between Folkestone, England, and Cap Gris Nez, France. For this accomplishment, the Albatross team won their second Kremer Prize for human-powered aircraft. View more: http://n2t.net/ark:/65665/nv9a5ec19ab-7a46-4bb0-9505-df186df42b04"
  },
  "aircraft during World War II was achieved with the Boeing-Stearman E-75, which served": {
    "image": "",
    "text": "Over 10,000 Stearman trainers were built by Boeing\'s Wichita Division, which had purchased the Stearman Company in the late 1930s. These Kaydets, along with Fairchilds and Ryans, served as the backbone of U.S. Army and Navy primary training in World War II. The original U.S. Army Kaydet was the PT-13 with a 220 Lycoming R-680 engine. The only complete standardization of an Army and Navy production design aircraft during World War II was achieved with the Boeing-Stearman E-75, which served the Army as the PT-13D and the Navy as the N2S-5. View more: http://n2t.net/ark:/65665/nv98c178370-3e38-4990-a6a1-c09256cefea0"
  },
  "the flight, the details of the tragedy came into focus. Station KNOX had": {
    "image": "",
    "text": "On the basis of the instruments found in the basket and a hastily scribbled log that Gray had kept during the flight, the details of the tragedy came into focus. Station KNOX had been playing \"Kashmiri\" at take-off. The ascent was much more leisurely than on either previous flight. In March Gray had reached 28,510 feet in forty minutes. This time he required an hour to reach that point. In May he attained 42,240 feet in one hour and five minutes. He required almost two hours to reach the same ceiling on November 4. View more: http://n2t.net/ark:/65665/nv9088af853-cd3d-48b4-b6ed-8a39f2e66764"
  },
  "aircraft and the design quickly found success. The King Air can fly farther": {
    "image": "",
    "text": "The Beech King Air is the world\'s most popular turboprop aircraft. Beech Aircraft Corporation developed the King Air in 1964 as a compromise between piston-engine and jet aircraft and the design quickly found success. The King Air can fly farther and higher than piston-engine aircraft, and, unlike many jets, it can land on the short runways of most small airports. With the three different models, including the C90B, still in production in 2001, this aircraft remains the primary business aircraft for small to mid-size companies, and it is an integral part of the flight inventories of many larger corporations. View more: http://n2t.net/ark:/65665/nv922f847f3-a0ac-430c-842b-c67b57a108bc"
  },
  "a manned version would, and its success paved the way for the beginning": {
    "image": "",
    "text": "The heavily instrumented \"Big Joe\" was the most massive American spacecraft launched up to that time. It weighed about as much as a manned version would, and its success paved the way for the beginning of manned Mercury launches in 1961. View more: http://n2t.net/ark:/65665/nv9d64e7729-a8b9-4c9f-951b-2c8f4ac1d056"
  },
  "type in which Brooks had earlier crashed. Brooks achieved one of his six": {
    "image": "",
    "text": "The Ray Brooks Spad XIII was built by the Kellner et Ses Fils piano works in August 1918. It was delivered to Colombey-les-Belles in September 1918 and assigned to the 22nd Aero Squadron, U.S. Army Air Service, where it was given the number \"20\" and assigned to Brooks. The aircraft was a replacement for another of the same type in which Brooks had earlier crashed. Brooks achieved one of his six personal aerial victories in Smith IV. Five other victories were scored with Smith IV while flown by other pilots. View more: http://n2t.net/ark:/65665/nv99b3b1335-fbc0-42c6-bfb8-172edc7e8c90"
  },
  "basis for the R engine, which won the Schneider Trophy in 1929 and": {
    "image": "",
    "text": "Following its success as an automobile manufacturer, Rolls-Royce began design and development of aircraft engines at the request of the British Admiralty at the beginning of World War I. In June 1927, Rolls-Royce began designing a scaled-up version of its supercharged Kestrel to power large flying boats. Later known as the Buzzard, the prototype was completed in 1928 and installed experimentally in large aircraft, both flying boats and land planes. Rolls-Royce sold less than 50 production engines, 32 of them to the Japanese. Even though Rolls-Royce abandoned the Buzzard within a few years, the development work on it proved important; serving as the basis for the R engine, which won the Schneider Trophy in 1929 and 1931. View more: http://n2t.net/ark:/65665/nv93dfda62f-e375-4a39-92bd-c518b13c7c5b"
  },
  "Inc (TRW) from original parts that failed to meet flight specifications. It was": {
    "image": "",
    "text": "This is a replica of a Pioneer satellite intended to orbit the moon. Pioneer 1 was launched on October 11, 1958, but the final velocity was insufficient to escape the earth\'s gravity. The resulting trajectory took the satellite to an altitude of 70,700 mi. During the flight, the spacecraft transmitted 43 hours of scientific data. It burned up upon reentry into the earth\'s atmosphere two days later. This replica was assembled in 1963 by the prime contractor, Space Technology Laboratories Inc (TRW) from original parts that failed to meet flight specifications. It was displayed at the Los Angeles Museum of Science until February 1964 and then donated to the Smithsonian Institution by TRW. It was displayed in the NASM Satellites gallery from 1976 to 1983, loaned to the Scottish Museum from May to December 1984, and then was part of a SI Traveling exhibition. It is now in display storage at the Hazy Center. View more: http://n2t.net/ark:/65665/nv914fb1f96-d409-41f5-bf3b-61b431f87ef7"
  },
  "While the engine was successful technically, Pitcairn could not find a": {
    "image": "",
    "text": "While the engine was successful technically, Pitcairn could not find a manufacturer willing to produce it. The Wright Whirlwind J-5 engine was being marketed at the same time, and the Pitcairn-Brewer engine could not compete with it. This is the last remaining engine of three built. View more: http://n2t.net/ark:/65665/nv994284b97-dc56-4ff8-9566-079e508b8605"
  },
  "that promise much in design but fail to deliver. Harold C. Weston generously": {
    "image": "",
    "text": "Schoolteacher John Monnett designed the Moni (mo-nee) during the early 1980s, and then coined the term \'air recreation vehicle\' to describe this airplane. Monnett\'s design almost captured all the merits that so many leisure pilots longed to find in one aircraft. The Moni looked great just sitting on the ramp. It performed well, and someone reasonably handy with average shop tools could construct one in their own garage. The design had much going for it, but like so many homebuilt aircraft before and since, a few key engineering lapses in the design, plus problems with the engine and propeller, relegated the Moni to the category of homebuilt aircraft that promise much in design but fail to deliver. Harold C. Weston generously donated his Moni to the National Air and Space Museum in April 1992. Weston built the airplane himself and flew it more than 40 hours. View more: http://n2t.net/ark:/65665/nv999224667-deb1-4ccd-8b28-3a473d996ac7"
  },
  "1800 rpm. Climbing and gliding were accomplished at 65 knots. The aircraft\'s service": {
    "image": "",
    "text": "Take off in calm winds within 600 feet were normal. A neutral control stick position with full throttle and 2,000 rpm was all that was needed to get the N3N flying. Landings were best-done using the full-stall technique. The N3N was flown over the fence at about 57-60 knots (65-70 mph) and stalled at 44 knots (50 mph) with a full load. Visibility was better from the back seat for landing. Cockpit instrumentation consisted of an altimeter, tachometer, airspeed indicator, compass, turn and bank indicator, and a combination fuel and oil temperature and pressure gauge. The aircraft could climb at 900 feet per minute and cruise at 87 knots (100 mph), at 1800 rpm. Climbing and gliding were accomplished at 65 knots. The aircraft\'s service ceiling was 15,200 feet (4,632 m). The N3N\'s great structural integrity allowed for high G turns and pullouts at close to 174 knots (200 mph). View more: http://n2t.net/ark:/65665/nv9bb54164a-8b61-4fdd-829b-e732eb07def1"
  },
  "Directional control of the airplane was accomplished by turning a steering wheel on": {
    "image": "",
    "text": "Directional control of the airplane was accomplished by turning a steering wheel on the control column left or right, fore and aft movement of the column controlled climb and descent, and roll was achieved by leaning left or right against a shoulder yoke that actuated the ailerons. The airplane was powered by a 25 horsepower, four-cylinder Curtiss engine, driving a single six-foot laminated wooden propeller. View more: http://n2t.net/ark:/65665/nv94ce4503f-6891-4cf4-ac18-1f82dc9ef9a9"
  },
  "severely curtailed by the stock market crash in late 1929. To sell off": {
    "image": "",
    "text": "In April 1929, the Kreider-Reisner Company became a subsidiary of the Fairchild Airplane Company, which then re-designated the C-4C Challenger design as the Fairchild KR-34C. The airplane established a solid reputation as an efficient and reliable performer that flew exceptionally well and had no bad habits. Mrs. Keith Miller, a noted woman pilot of the era, entered one in the 1929 National Air Tour and placed 8th in a heavily competitive field of entries. Another C-4C/KR-34C was used as the official press plane for the Air Tour. The C-4C was popular as an air taxi and as a sport aircraft, too. The recently expanded plant in Hagerstown produced a number of the C-4Cs before sales were severely curtailed by the stock market crash in late 1929. To sell off the existing inventory, the company resorted to various sales ploys and modifications such as seaplane conversions and adding guns for military applications. Approximately 60 examples of this versatile airplane were built. View more: http://n2t.net/ark:/65665/nv900ef72b8-0bdb-40c4-aa2a-26842cd36208"
  },
  "by Louise Thaden and Blanche Noyes, won the 1936 Bendix Trophy Race, marking": {
    "image": "",
    "text": "With the Staggerwing, the Beech Corporation not only had a successful corporate aircraft, but was a winner in racing circles too. NC15835, a Model C17R, piloted by Louise Thaden and Blanche Noyes, won the 1936 Bendix Trophy Race, marking the first time that a woman had won that prestigious race. Other stock Beechcraft Staggerwings won two major air races in Miami in 1936. In 1937, Jacqueline Cochran set a 1,000-kilometer speed record averaging more than 320 kph (200 mph). Staggerwings also did well in the 1937 and 1938 Bendix Races. View more: http://n2t.net/ark:/65665/nv91ba7ddc8-f2b7-43e8-a708-b1a06e77ee3f"
  },
  "Following its success as an automobile manufacturer, Rolls-Royce, Ltd.": {
    "image": "",
    "text": "Following its success as an automobile manufacturer, Rolls-Royce, Ltd. began design and development of aircraft engines at the request of the British Admiralty at the beginning of World War I. The Rolls-Royce Condor was a large and very powerful engine developed at the end of the war in 1918 for use in long-range heavy bombers, principally for bombing Berlin, Germany. Design work was begun at the end of 1917 and retained the same cylinder construction of earlier types. A total of 327 Condors were recorded as having been built. View more: http://n2t.net/ark:/65665/nv9ca9bf886-27c5-411b-aa3d-3483e7e87309"
  },
  "level flight. The aircraft proved so successful that the rules governing its competition": {
    "image": "",
    "text": "Designed and built by Lee Mahoney and his father, S. C. \"Mickey\" Mahoney, the Sorceress was the first sport biplane to exceed 322 kilometers (200 miles) per hour on a closed course, and it reached 394 kilometers (245 miles) per hour in level flight. The aircraft proved so successful that the rules governing its competition qualification were modified to such an extent that the Sorceress was forced into retirement. View more: http://n2t.net/ark:/65665/nv9b988df9a-5e61-4823-85a7-dfa12d4e455e"
  },
  "low speeds. This unique propulsion system won the prestigious Collier Trophy in 2001.": {
    "image": "",
    "text": "The Pratt & Whitney JSF 119-PW-611 turbofan deflects thrust downward for short takeoff/vertical landing capability. The Air Force and Navy versions use a thrust-vectoring exhaust nozzle. The Marine Corps and Royal Air Force/Navy version has a swivel-duct nozzle; an engine-driven fan behind the cockpit and air-reaction control valves in the wings to provide stability at low speeds. This unique propulsion system won the prestigious Collier Trophy in 2001. View more: http://n2t.net/ark:/65665/nv9a96acd7c-d8c6-4970-ad13-f7bdf2c3e774"
  },
  "in the event of an engine failure or loss of control, he was": {
    "image": "",
    "text": "By September 1954, construction had been completed on the Model 1031, which consisted of a fiberglass duct and steel-tube platform. Initial flights were made by Hiller\'s chief test pilot, Philip T. Johnston. Because there was little to protect the pilot in the event of an engine failure or loss of control, he was tethered to a high wire suspended between two towers. The Model 1031 proved relatively stable, and easy to handle when hovering. A natural self-correcting tendency in forward flight was noted. This occurred because the forward lip of the duct would generate more lift than the trailing edge causing an upward pitching moment. Unfortunately, while this made the platform almost impossible to topple, it also limited the forward speed to a mere 26 kph (16 mph), and resulted in erratic handling in windy conditions. View more: http://n2t.net/ark:/65665/nv99901a553-f6a4-454a-aad9-cd47c2a22fd0"
  },
  "\'46 and \'47 championships. Howard was killed in an accident in this airplane": {
    "image": "",
    "text": "Romanian pilot Alex Papana brought this Jungmeister to the United States crated in the airship Hindenburg and flew it at the 1937 Cleveland Air Races. Mike Murphy reregistered the airplane as his own and flew it to win the 1938 and \'40 American Aerobatic Championships. Beverly \"Bevo\" Howard then bought it and won the \'46 and \'47 championships. Howard was killed in an accident in this airplane in 1971, but his estate restored the Jungmeister and donated it to the Smithsonian in 1973. View more: http://n2t.net/ark:/65665/nv9192b95c4-7b73-44b7-8950-160c9cf62421"
  },
  "in 1969. Greenamyer and his team won the Unlimited championship six times between": {
    "image": "",
    "text": "With registration number N1111L and assigned race number 1, the racer was known first as the “Greenamyer Bearcat” between 1964-1965 and 1968, and then Smirnoff after the team’s main sponsor for 1966 and 1967 before being christened Conquest I in 1969. Greenamyer and his team won the Unlimited championship six times between 1965-1969 and 1971 with the Bearcat. View more: http://n2t.net/ark:/65665/nv92d42714d-6a33-4244-b268-76b25331d43d"
  },
  "all five Lunar Orbiters were purposely crashed onto the Moon to prevent their": {
    "image": "",
    "text": "After depleting their film supplies, all five Lunar Orbiters were purposely crashed onto the Moon to prevent their radio transmitters from interfering with future spacecraft. View more: http://n2t.net/ark:/65665/nv9fe656352-b7a7-408f-a2cb-60627bbdb309"
  },
  "Among the most successful early engines marketed in the United": {
    "image": "",
    "text": "Among the most successful early engines marketed in the United States were those designed and built by aviation pioneer and inventor Glenn Curtiss in his factory at Hammondsport, New York. Early Curtiss engines powered motorcycles, and were air cooled. Later, to achieve higher power, Curtiss began to develop liquid-cooled engines. Curtiss built this engine for the U.S. Navy in 1921 for experimental purposes. It incorporated the Ricardo supercharging system, designed to increase engine power at high altitude and decrease fuel consumption. View more: http://n2t.net/ark:/65665/nv9785da749-b7b8-45c2-9770-6dfe610510f9"
  },
  "Vernier engine failed to ignite - southeast of Copernicus": {
    "image": "",
    "text": "Vernier engine failed to ignite - southeast of Copernicus Crater View more: http://n2t.net/ark:/65665/nv99f4a42da-9692-430c-9b13-9bb95ef3f4ca"
  },
  "the Apollo 5 mission, was so successful, a second unmanned LM test mission": {
    "image": "",
    "text": "LM 2 was built for a second unmanned Earth-orbit test flight. Because the test flight of LM 1, performed as part of the Apollo 5 mission, was so successful, a second unmanned LM test mission was deemed unnecessary. LM-2 was used for ground testing prior to the first successful Moon-landing mission. In 1970 the ascent stage of LM-2 spent several months on display at the \"Expo \'70\" in Osaka, Japan. When it returned to the United States, it was reunited with its descent stage, modified to appear like the Apollo 11 Lunar Module \"Eagle,\" and transferred to the Smithsonian for display. View more: http://n2t.net/ark:/65665/nv950f30cee-381e-4341-ad61-757e6416e7ac"
  },
  "the first ever tailhook system. Ely died later on October 19, 1911, after": {
    "image": "",
    "text": "This propeller is from Eugene Ely\'s Curtiss Model D pusher biplane that he flew as part of the U.S. Navy\'s early investigations into the military uses of aviation. On November 14, 1910, Ely made the first take-off from a ship, the cruiser USS Birmingham, in Hampton Roads, Virginia. Three months later, Ely made the first landing on a ship, the battleship USS Pennsylvania in San Francisco Bay, on January 18, 1911, while using the first ever tailhook system. Ely died later on October 19, 1911, after crashing during an exhibition flight in Macon, Georgia. View more: http://n2t.net/ark:/65665/nv905de5e88-f848-4ac7-b950-37186a37da88"
  },
  "objective was light weight, which was achieved through the extensive use of aluminum": {
    "image": "",
    "text": "The Model 4X engine was built by the Roberts Motor Company of Sandusky, Ohio. An important design objective was light weight, which was achieved through the extensive use of aluminum and magnesium alloys in the cylinders and crankcase, and a hollow crankshaft. Also like all Roberts engines it operated on a two-stroke cycle operation to reduce parts count. Between 1911 and 1912, Roberts engines were used by many noted exhibition pilots, and more Roberts engines were said to be built than by Hall-Scott and Curtiss combined during this period. View more: http://n2t.net/ark:/65665/nv9e1d6094e-2c0f-43ac-aaa0-5b6fb51a26ba"
  },
  "and his brother Charles, were both killed in flying accidents before the war.": {
    "image": "",
    "text": "The notable French aircraft manufacturer Société Anonyme des Establissements Nieuport was formed in 1909 and rose to prominence before World War I with a series of elegant monoplane designs. The namesakes of the company, Edouard de Niéport and his brother Charles, were both killed in flying accidents before the war. (The spelling of the company name was a slight variation of the brothers\' surname.) The talented designer Gustave Delage joined the firm in 1914 and was responsible for the highly successful war-time line of sesquiplane V-strut single-seat scouts, the most famous of which were the Nieuport 11 and the Nieuport 17. View more: http://n2t.net/ark:/65665/nv92a7917dd-d2de-4015-829c-5f6b9719b00e"
  },
  "Jr. is one of the most successful reciprocating engines ever built. Pratt &": {
    "image": "",
    "text": "Begun in 1925 by former Wright Aeronautical employees as a spinoff from a machine tool company, Pratt & Whitney became one of the world’s largest manufacturers of aircraft engines, and the Wasp Jr. is one of the most successful reciprocating engines ever built. Pratt & Whitney introduced it as a complement to the highly successful Wasp and Hornet families of engines in 1930. The Wasp Jr. was essentially a Wasp of reduced dimensions. Pratt & Whitney and its licensees manufactured over 39,000 versions of the R-985 until 1953 for a wide variety of military and commercial aircraft, including light transports, trainers, sport aircraft, and helicopters. View more: http://n2t.net/ark:/65665/nv993a1a3c0-8d6d-4e19-b40f-9ce86dcb17b2"
  },
  "testing as design tools. Their seminal accomplishment encompassed not only the breakthrough first": {
    "image": "",
    "text": "The Wrights pioneered many of the basic tenets and techniques of modern aeronautical engineering, such as the use of a wind tunnel and flight testing as design tools. Their seminal accomplishment encompassed not only the breakthrough first flight of an airplane, but also the equally important achievement of establishing the foundation of aeronautical engineering. View more: http://n2t.net/ark:/65665/nv9aa91e7c2-85b2-4904-aff0-d990694b6f1d"
  },
  "V-1 against the United were 6,184 killed in the London area and 17,981": {
    "image": "",
    "text": "The casualties for the V-1 against the United were 6,184 killed in the London area and 17,981 seriously injured. While the effects of the V-1 bombardments was heavy, effective countermeasures were developed by August 1944, anti-aircraft guns, aided by radar, searchlights, and ground spotters from the Royal Observer Corps and other organizations, as well as barrage balloons carrying cables which entangled the missiles, considerably diminished the weapon\'s impact. Some V-1\'s were also shot down by Allied planes and a few were known to have been flipped over before reaching their targets by the wingtips by intercepting fighters. Even V-1s that did get through were not very accurate. View more: http://n2t.net/ark:/65665/nv96c0b4382-bdce-4031-b702-9ab150906396"
  },
  "to win production orders but it failed completely after company politics choked the": {
    "image": "",
    "text": "By 1945, the Model 30 demonstrator could fly and carry enough payload capacity to encourage Bell to proceed with a larger, commercial version called the Model 42. Backed by the Model 30\'s success and flashy styling, the Model 42 seemed destined to win production orders but it failed completely after company politics choked the design process. The senior staff at Bell resented Arthur Young\'s lack of formal training and ignored his inputs. This led to poor engineering decisions and shoddy quality control during production. Larry Bell also misread the market for the Model 42 and aimed the aircraft at private pilots and their families. In reality, it was commercial operators who needed the unique capabilities offered by the helicopter. View more: http://n2t.net/ark:/65665/nv96c156473-c5a6-4ada-9a27-995810de1a8c"
  },
  "operations. Attachment to the aircraft was accomplished by backing the car to the": {
    "image": "",
    "text": "The propeller, rear fuselage, and wings were removed for road operations. Attachment to the aircraft was accomplished by backing the car to the fuselage, leveling the tail and wings, moving three locking levers that inserted and locked large pins into fittings. The spar and tail parts slid into horizontally-inclined U-fittings. After locking into place, the two outrigger wheels that support the wings and the retractable tail wheel were cranked up into storage position. The propeller was removed from its bracket on the side of the fuselage, the prop spinner was removed, the propeller screwed on with a built-in wrench, and the spinner replaced again. The engine would not start if everything was not properly connected. The design is actually composed of seventeen different inventions. View more: http://n2t.net/ark:/65665/nv9a66335e2-bb5b-42ba-bf3a-9b7b1e9979c7"
  },
  "Gordon Taylor was killed in a crash. Gilbert Taylor, who believed that there": {
    "image": "",
    "text": "The story of the J-3 began in the late 1920s with C. Gilbert and Gordon Taylor, partners in the very small Taylor Brothers Aircraft Company of Rochester, New York. One time barnstormers, the brothers designed and were attempting to market a two-seat monoplane called the Chummy, when Gordon Taylor was killed in a crash. Gilbert Taylor, who believed that there would be a growing market for light planes, moved in 1929 to Bradford, Pennsylvania, where community leaders were anxious to promote new local industries. The Bradford Board of Commerce provided $50,000 to capitalize the new Taylor Company, which built five Chummys before the Great Depression put a halt to construction. View more: http://n2t.net/ark:/65665/nv93727de26-1277-4492-917c-e79afe7831bb"
  },
  "skies proved to be a dismal failure. While Young and Kelley were working": {
    "image": "",
    "text": "By war’s end, Bell was ready to begin production of a new design, designated the Model 42. This luxury sedan of the skies proved to be a dismal failure. While Young and Kelley were working on theoretical studies, Bell’s production engineers, whose experience was limited to airplanes, worked on the design of the Model 42. Their inexperience resulted in an unreliable and under-powered aircraft that was priced well beyond the reach of most private citizens. The only hope for Bell’s future in the helicopter industry was to put the Model 30 Ship 3 into production as a military and commercial utility helicopter. This decision resulted in the Model 47, which became the world’s first commercially certified helicopter on March 8, 1946. View more: http://n2t.net/ark:/65665/nv945f0c72c-4599-4edd-9737-deae08e8385b"
  },
  "by Tony LeVier. It was a success, and its handling characteristics were equal": {
    "image": "",
    "text": "The TP-80 first flew on March 22, 1948, and was piloted by Tony LeVier. It was a success, and its handling characteristics were equal to those of the P-80C. Initially, 20 aircraft were ordered by the USAF, and this was soon increased. The designation was changed from TP-80C to TF-80C on June 11, 1948, and finally to T-33A on May 5, 1949. View more: http://n2t.net/ark:/65665/nv9bcb1427e-587c-4b67-8ff4-f0a86e5ce84b"
  },
  "called Mercury-Atlas 10 (MA-10). After the success of MA-9, flown by astronaut Gordon": {
    "image": "",
    "text": "This Mercury capsule, number 15B, is one of two left showing the complete one-man spacecraft in its orbital configuration. It includes the silver and black retrorocket package used to slow the capsule for return to Earth and the nose section containing the parachutes. The first American in space, Alan B. Shepard, Jr., hoped to fly this Mercury capsule on a long-duration orbital mission in late 1963 called Mercury-Atlas 10 (MA-10). After the success of MA-9, flown by astronaut Gordon Cooper in May 1963, NASA decided to cancel MA-10 to concentrate on its next human spaceflight project, Gemini. Reflecting Shepard\'s hope of flying in space again, he had the name Freedom 7 II, in tribute to his historic 1961 capsule, Freedom 7, painted on the spacecraft. View more: http://n2t.net/ark:/65665/nv9941e8d83-78fc-4c1c-8a17-6130d4f274cb"
  },
  "margin. These components are also potential failure points, making helicopters more fragile and": {
    "image": "",
    "text": "All aircraft designers attempt to maximize lifting power and reduce airframe weight. During the late 1940s, helicopter pioneers began to experiment with alternative propulsion methods that did not require heavy components such as tail rotor assemblies, drive shafts, main rotor clutches, transmissions, and engine cooling blowers. Without these items, a helicopter\'s useful load increases by a significant margin. These components are also potential failure points, making helicopters more fragile and more difficult to maintain. Yet another advantage is the substantial reduction in the cost to produce helicopters without this equipment. In 1948, Stanley Hiller began to experiment with ramjets mounted on the tips of the main rotor blade. He hoped to make small, ramjet-powered helicopters practical and affordable, and to eventually design and sell giant aerial cranes propelled by ramjets or jet turbine engines. The Hiller HOE-1 became the first production ramjet helicopter, and the Army and Navy flew a small number of these aircraft for a short time to test and evaluate the technology. View more: http://n2t.net/ark:/65665/nv90eb5a25c-bd9b-4e9d-a038-1fb0d0ec48fb"
  },
  "life in September 1973 in the crash of a powered, aerobatic monoplane he": {
    "image": "",
    "text": "A 1973 press statement issued by Fred Hufnagel quoted this assessment of McCray\'s performances: \"His sailplane becomes a baton in the hands of the maestro conducting a symphony of nature and machine in perfect harmony.\" The United States Air Force Thunderbird Demonstration Team named McCray the \"Master of Unpowered Flight\" and his skill at piloting the 2-22 earned him a rare waiver from the Federal Aviation Administration to perform with no minimum altitude restriction. This certified that McCray could legally operate an airplane just a few feet above the ground in controlled airspace, during high-speed and unusual maneuvers. Born in Front Royal, Virginia, young McCray had begun flying a Curtiss Robing during the 1930s. By 1968, he had amassed more than 10,000 flying hours in many different aircraft. McCray lost his life in September 1973 in the crash of a powered, aerobatic monoplane he was flying at Sao Paulo, Brazil. His widow, Helen J. McCray, donated her husband\'s glider to the National Air and Space Museum on March 13, 1975. View more: http://n2t.net/ark:/65665/nv9c472588e-9f30-4808-8a56-cbf439998538"
  },
  "spaceflight as the oldest and most accomplished orbiter, the champion of the shuttle": {
    "image": "",
    "text": "Discovery was the third Space Shuttle orbiter vehicle to fly in space. It entered service in 1984 and retired from spaceflight as the oldest and most accomplished orbiter, the champion of the shuttle fleet. Discovery flew on 39 Earth-orbital missions, spent a total of 365 days in space, and traveled almost 240 million kilometers (150 million miles)--more than the other orbiters. It shuttled 184 men and women into space and back, many of whom flew more than once, for a record-setting total crew count of 251. View more: http://n2t.net/ark:/65665/nv90f447f4d-55c5-4511-90c3-86bd30bfdbfc"
  },
  "than earlier standard Rogallo designs. This success encouraged Bennett to develop the Phoenix": {
    "image": "",
    "text": "In 1973 and 1974, Bill Bennett and his hang glider designers experimented with several variations of the standard Rogallo wing. He then incorporated the results into a new line of hang gliders called the Phoenix series. On these gliders, Bennett increased the leading-edge convergence angle from 80 to more than 95 degrees. Total wing surface area was slightly less than standard Rogallo models, but the aspect ratio (wingspan to wing chord ratio) increased substantially. The first Phoenix hang gliders flew with a long fantail, a device thought to improve stability. As Bennett continued to develop the Phoenix series, he increased the leading-edge convergence angle even further, and removed the fantail after flight experience showed that it did not increase stability. The docile handling characteristics and good stability of the Phoenix VI made it a popular trainer at hang glider flying schools. More experienced pilots also favored this model type because it flew relatively fast, had good rough air penetration and handling characteristics, and the glider could soar on updrafts far better than earlier standard Rogallo designs. This success encouraged Bennett to develop the Phoenix series further, and variations continued to appear well into the 1980s. View more: http://n2t.net/ark:/65665/nv96ed774d9-5b56-401c-b1e8-b77c10a1a867"
  },
  "continued flying until his death in crash (not in the Wiseman airplane) in": {
    "image": "",
    "text": "Cooke continued flying until his death in crash (not in the Wiseman airplane) in Pueblo, Colorado, on September 16, 1914. His brother, Robert L. Cooke, took possession of the Wiseman aircraft and kept it in storage at his home in Oakland until 1933 when he lent it the Oakland Port of Authority for display at the Oakland Airport. The Maupin-Lanteri Black Diamond was also turned over to the Oakland Airport for public display at this time. View more: http://n2t.net/ark:/65665/nv912487232-af07-46bc-8b3e-fbf9d1488cb9"
  },
  "February 20, 1962, was a sterling success, as he overcame problems with the": {
    "image": "",
    "text": "In this historic capsule, John H. Glenn Jr. became the first American to orbit the Earth. Glenn\'s flight was the third manned mission of Project Mercury, following two suborbital flights by astronauts in 1961. Glenn\'s three-orbit mission on February 20, 1962, was a sterling success, as he overcame problems with the automatic control system that would have ended an unmanned flight. But reentry was tense, as a faulty telemetry signal from the spacecraft indicated that the heat shield might be loose. Mission Control instructed Glenn not to jettison the retrorocket package after firing in order to better hold the heat shield in place. Glenn reentered successfully and splashed down in the Atlantic 4 hours, 55 minutes and 23 seconds after launch. View more: http://n2t.net/ark:/65665/nv97a782c5e-5640-4e03-bc50-881fc0b5262a"
  },
  "on April 4, 1933; the Macon crashed off the California coast on February": {
    "image": "",
    "text": "Eight Sparrowhawks were produced for this purpose. The first arrived at Lakehurst Naval Air Station, New Jersey, in June 1932, and experimental trials with airship-based fighter support were brief. The Akron was lost in a storm on April 4, 1933; the Macon crashed off the California coast on February 12, 1935. Before these accidents, not a single Sparrowhawk was lost. However, with only three remaining, and no dirigible from which to operate, the aircraft were relegated to utility flying. View more: http://n2t.net/ark:/65665/nv98703c81d-fd0c-4102-8180-6e3f5edb06e0"
  },
  "on September 11, but after three failed attempts to cross the Sierras, aborted": {
    "image": "",
    "text": "In September 1911, three competitors were finally in the race. Cal Rodgers was one of them, along with Robert Fowler and James Ward. Fowler took off from San Francisco on September 11, but after three failed attempts to cross the Sierras, aborted his transcontinental flight by the end of the month. Ward took off from the east coast on September 13, but withdrew little more than a week later, not even making it out of New York State. View more: http://n2t.net/ark:/65665/nv95c5db081-9785-4a9d-b7f3-1047e88f62d1"
  },
  "A. J. Smith in 1967, all won the United States National Soaring Championships": {
    "image": "",
    "text": "Leonard Niemi\'s Sisu is one of the most successful American competition sailplane ever flown. John Ryan in 1962, Dean Svec in 1965, and A. J. Smith in 1967, all won the United States National Soaring Championships flying a Sisu (\'see-soo\'). In 1967, Bill Ivans (his Schempp-Hirth Nimbus II in NASM collection) set a national speed record flying a Sisu 1A at El Mirage, California, by skimming across the desert at 135 kph (84 mph) over a 100-kilometer (62-mile) triangular course. View more: http://n2t.net/ark:/65665/nv9c3b78a55-90d7-44f3-b954-023607c126d4"
  },
  "and its twin here--represent the first successful exploration of the Martian surface with": {
    "image": "",
    "text": "The Marie Curie rover was the flight spare for the Sojouner rover. During Sojourner\'s activites on Mars, engineers operated Marie Curie in the same movements in a Mars-like test area at the Jet Propulsion Laboratory (JPL) in California. For a time, NASA planned to send Marie Curie on a 2001 Mars mission, but this did not occur. Today, these two rovers--one still on Mars and its twin here--represent the first successful exploration of the Martian surface with a moving vehicle. View more: http://n2t.net/ark:/65665/nv90614f5b3-a05c-46cd-b817-192ed2f75f10"
  },
  "The first successful rotary engine is generally attributed to": {
    "image": "",
    "text": "The first successful rotary engine is generally attributed to F.O. Farwell in 1896, and was built by the Adams Company of Dubuque, Iowa. A three cylinder version likely powered the first rubber-tired automobile in 1899. View more: http://n2t.net/ark:/65665/nv9f983ac3f-2de9-45f0-9488-f0093b9327a6"
  },
  "suggest that the suicide bombing that killed 241 U. S. Marines in Beirut": {
    "image": "",
    "text": "Israel invested heavily in remotely piloted aircraft technology during the late 1960s after the Egyptians badly surprised Israeli aircrews during the short but intense Six-Day War in early June 1967. When Israel invaded Lebanon in 1982, Israel Aircraft Industries, Ltd., (IAI) was manufacturing the Scout UAV. Successes flying the Scout during the invasion and subsequent flight demonstrations of this UAV\'s capabilities convinced leaders in the U.S. Navy Mediterranean Fleet to acquire their own Scouts. Reports suggest that the suicide bombing that killed 241 U. S. Marines in Beirut in 1983 also spurred Navy officials to investigate reconnaissance UAVs. In 1984, IAI and Tadiran, Ltd., formed a joint subsidiary company called Mazlat Ltd., to develop an improved version of the Scout known as the Pioneer. The following year, Mazlat flew the Pioneer in a UAV competition sponsored by the Navy. Pacific Aerosystem\'s Heron 26 UAV competed against the Pioneer for a lucrative Navy contract. Pioneer won and the Navy selected AAI Corporation in the United States to build this UAV. View more: http://n2t.net/ark:/65665/nv9fea849d3-da50-448b-908d-eca2cd902411"
  },
  "in automobiles. Hisso engines were very successful and featured innovative cast-aluminum cylinder construction": {
    "image": "",
    "text": "Hispano-Suiza engines were developed by Marc Birkigt, of Swiss origin, and first manufactured in Barcelona, Spain for use in automobiles. Hisso engines were very successful and featured innovative cast-aluminum cylinder construction with internal water passages. Increased demand for World War I, in particular, required licensing of Hisso aircraft engine manufacturing in France, England and the U.S. The Wright-Martin Aircraft Corporation, later the Wright Aeronautical Corporation, acquired the American rights and claimed improvements during further development. View more: http://n2t.net/ark:/65665/nv9f1c91b8f-b225-4e4e-a41c-bf756aa16f0a"
  },
  "program. But the Hughes 369 (OH-6) won the contest. However, Bell executives recognized": {
    "image": "",
    "text": "Development of the Model 206 started in 1960 to compete for the US Army\'s light observation helicopter (LOH) program. But the Hughes 369 (OH-6) won the contest. However, Bell executives recognized the potential of the configuration as the next generation replacement for its venerable Model 47 series [see NASM collection. In 1966, Bell introduced a re-engined and substantially reconfigured 206 as a commercial replacement for its successful reciprocating 47J Ranger VIP transport [see NASM collection]. Known as the JetRanger, it attracted much attention, if not sales. Military oders soon overshadowed commercial production as the Army acquired them under the OH-58A designation to overcome production shortfalls and cost over runs in the OH-6s desperately needed in Vietnam. Though not as durable or maneuverable as the OH-6, the OH-58\'s advantages in reliability and maintainability associated with Bell\'s trademark two-bladed teetering main rotor made it a mainstay in the final years of conflict in Southeast Asia and ultimately led to its superseding its earlier competitor in scout and light attack role up to the present day. The US Navy also procured the 206 as the TH-57A Sea Rangers for use as a trainer. View more: http://n2t.net/ark:/65665/nv92c241361-443b-48a3-8287-8933c56ca115"
  },
  "Channel 7 in celebration of the success of the Apollo 11 Moon landing": {
    "image": "",
    "text": "This boomerang, an example of the \"first aerodynamic shape conceived by man,\" was presented in 1969 to NASA astronaut Michael Collins by the Australian Television Network Channel 7 in celebration of the success of the Apollo 11 Moon landing that July. After Apollo 11, Collins, the command module pilot, and his two crewmates, the first moonwalkers Neil Armstrong and Buzz Aldrin, embarked on a 45-day world tour. Commemorative items like this one, prepared by organizations, companies, or nations, provided a tangible demonstration of the enthusiasm for the first Moon landing. View more: http://n2t.net/ark:/65665/nv9bae675ae-d8ee-4ba1-8ec6-af5dfa0c469b"
  },
  "side-by-side, open-cockpit aircraft. Gordon Taylor was killed in a crash and C.G. moved": {
    "image": "",
    "text": "In the late 1920s, C. Gilbert and Gordon Taylor founded the Taylor Brothers Aircraft Company of Rochester, New York, and built the A-2 Chummy, a small parasol-wing, side-by-side, open-cockpit aircraft. Gordon Taylor was killed in a crash and C.G. moved to Bradford, Pennsylvania, encouraged by the promise of financial assistance for his company. William T. Piper and other local oilmen provided capital for Taylor to redesign the high-priced ($3,985) Chummy, into a low-cost, high-wing tandem aircraft with side panels and a door. The 20 hp Brownback Tiger Kitten engine barely powered the aircraft off the ground, but, it motivated Taylor\'s accountant to observe that an airplane with a kitten engine should be known as a cub, and a legend was born. View more: http://n2t.net/ark:/65665/nv9d395f866-d1b5-445f-adf6-78cbd61a951f"
  },
  "detail of the flight. For this accomplishment, he was awarded the Harmon International": {
    "image": "",
    "text": "In the flight that followed, Blair and Excalibur III established their most noted record. Blair had developed a new method of air navigation in polar regions, where the magnetic compass is unreliable, if not useless. By plotting sunlines at predetermined locations and times, a reliable form of navigation was possible, Blair believed. To prove his theory. he left Bardufoss. Norway, with Excalibur Ill on May 29, 1951. heading north over the ice and snow to Fairbanks, Alaska, via the North Pole. There were no intermediate emergency landing points and no communications or radio navigation aids available to him after departing Norway. Exactly as planned, 10 hours and 27 minutes after takeoff on the other side of the world, Excalibur Ill arrived at Fairbanks. Blair financed the project and was solely responsible for every detail of the flight. For this accomplishment, he was awarded the Harmon International Trophy in 1952 by President Harry Truman. Perhaps even more important. this flight of Exca(ibur Ill changed defense planning for the United States; flights across the northern reaches of the globe by attacking forces were now deemed possible, and steps were taken to prevent them. View more: http://n2t.net/ark:/65665/nv98016438a-753a-42be-83d3-de39bda7bddc"
  },
  "at aviation expositions around the country won enthusiastic acceptance during the latter half": {
    "image": "",
    "text": "The first C-2s that Aeronca demonstrated at aviation expositions around the country won enthusiastic acceptance during the latter half of 1930. Squat and bug-eyed, the diminutive Aeronca C-2 was a simple airplane with modest performance and delightful flying characteristics. Its steel-tube fuselage and wooden wings were covered with fabric and braced with wires. The pilot, seated before a stick and rudder bar, had just four instruments: oil temperature, oil pressure, nonsensitive altimeter, and tachometer. The single-seat C-2 was powered by a two-cylinder Aeronca E-107 engine rated at 26-30 hp. In 1929, the Aeronca C-2 sold for $1,495. By mid-1930, the price had dropped to $1,245 as a result of the depression. C-2s were economical at 1 cent a mile for oil and gas, and they could often be rented for just $4.00 an hour. Furthermore, they were simple to fly, easy to maintain, and had no bad characteristics to spring on a novice pilot. By 1931, more than 100 C-2s had been sold and Aeronca introduced the two-seat C-3, with an Aeronca E-1 13 36-40 hp engine. With seating for two side-by-side, the C-3 offered greater utility than the C-2 and quickly became popular as a trainer. \"Airknockers\" or \"Flying Bathtubs, as they were affectionately known, made it possible for the average person to fly. Other light aircraft began to appear but the Aeronca style remained popular and C-3 production ended in 1937 with more than 500 produced built. View more: http://n2t.net/ark:/65665/nv91e2c26ee-0861-4c6d-9e5f-3b5572de46b0"
  },
  "The continued success of the prototypes prompted the Army": {
    "image": "",
    "text": "The continued success of the prototypes prompted the Army to contract for 111 improved production aircraft in January 1933 under the designation P-26A. The initial contract was increased by twenty-five new airplanes, which were B and C models. This brought the total production to 136. View more: http://n2t.net/ark:/65665/nv94aec63dc-0e95-4c50-adc4-ff3a49f45ed8"
  },
  "white, and blue paint scheme. Strayer died in 1981 and, in 1982, Steve": {
    "image": "",
    "text": "In 1973 Alan Pottasch and Jack Strayer of Pepsi began a search for old skywriters and found N434N still with Andy Stinis. They intended to display it at the Pepsi corporate headquarters in Purchase, New York, however, Strayer, a former skywriter, soon persuaded Pepsi to install navigation and communications equipment and tour it once again. In 1977, Strayer hired Peggy Davies as a second pilot and then, in 1980, when Davies became a Pepsi corporate pilot, Strayer hired Suzanne Asbury. Pepsi also gave the aircraft a bright red, white, and blue paint scheme. Strayer died in 1981 and, in 1982, Steve Oliver joined Asbury as a second pilot for the Pepsi aircraft fleet that included N434P, another 1929 Travel Air. In 2000, Suzanne and Steve Oliver suggested that the aircraft should be retired for safety\'s sake, and Pepsi-Cola Company donated it to the National Air and Space Museum. The Pepsi Skywriter is currently displayed at the Steven F. Udvar-Hazy Center at Dulles Airport. View more: http://n2t.net/ark:/65665/nv9ecadc4e9-0b3c-4a7d-9a49-90f28c2c9cd1"
  },
  "Art Scholl was killed in 1985 while filming in a": {
    "image": "",
    "text": "Art Scholl was killed in 1985 while filming in a Pitts Special for the movie Top Gun. Art Scholl\'s estate donated the Pennzoil Special, N13Y, serial number 23, and his staff delivered it to the Garber Facility in Suitland, Maryland on August 18, 1987. It is currently on display at the Museum\'s Stephen F. Udvar-Hazy Center at Washington Dulles International Airport in Chantilly, Virginia. View more: http://n2t.net/ark:/65665/nv99fbf90c4-47d1-4076-afff-b20d015c45e0"
  },
  "roller rocker arms; and grease-tight and fail-proof intake rocker arms and pins. Thirty-eight": {
    "image": "",
    "text": "Pilots found a myriad of ways to improve the performance of their Jennys, which included clipping wings or adding high-lift monoplane wings, using more efficient propellers, and replacing the 90-horsepower Curtiss OX-5 engine with a 150-horsepower Hispano-Suiza, or any one of a number of other widely available surplus engines. Pilots could also enhance the performance of their OX-5 engines by installing conversion kits that included silver-bronze bearings; three-ring, high-compression pistons; perfect circle piston rings; new magnetos; replaceable valve guides and seats; new valves and intake controls; roller rocker arms; and grease-tight and fail-proof intake rocker arms and pins. Thirty-eight hundred of these Miller conversion kits, named after their developer, were sold. View more: http://n2t.net/ark:/65665/nv98c63c1a8-32b7-47b3-aebd-9aefdd979283"
  },
  "being used for the first time, failed in endurance tests. The P-1 was": {
    "image": "",
    "text": "The P-1 was tested extensively in 1924 in a Douglas DT-2 aircraft, and flown successfully in the Navy Douglas DT-6 and Boeing aircraft. However, magnesium alloy castings, being used for the first time, failed in endurance tests. The P-1 was then discontinued in favor of the larger P-2, which added Heron-type cylinders and a supercharger. View more: http://n2t.net/ark:/65665/nv983beb51d-30cf-44e1-a197-92d7ac21a4a7"
  },
  "and Mariner 2 was the first successful spacecraft from Earth to reach the": {
    "image": "",
    "text": "Planetary exploration began, just as lunar exploration had, in a race between the United States and the Soviet Union to see who would be the first to place some sort of spacecraft near Venus, and Mariner 2 was the first successful spacecraft from Earth to reach the planet. Exploration of the inner solar system was not just an opportunity to best a rival in the Cold War; scientists in both the United States and the Soviet Union recognized the attraction of Venus for the furtherance of planetary studies. Regarded as both the evening and the morning star, Venus had long enchanted humans-and all the more so since astronomers had realized that it was shrouded in a mysterious cloak of clouds permanently hiding the surface from view. It was also the closest planet to Earth, and a near twin to this planet in terms of size, mass, and gravitation. View more: http://n2t.net/ark:/65665/nv9cf9b7de0-e617-4ede-8d44-8232c2de777d"
  },
  "engine designer, this was the first successful U.S. inverted air-cooled engine designed for": {
    "image": "",
    "text": "Designed by Harold E. Morehouse, a preeminent light aircraft engine designer, this was the first successful U.S. inverted air-cooled engine designed for that aircraft type. An important advantage of the inverted design is improved pilot visibility. View more: http://n2t.net/ark:/65665/nv978a02bd0-2a36-45e9-b799-48078e148b30"
  },
  "at the National Air Races and won the 1938 and 1939 contests. With": {
    "image": "",
    "text": "Known as the Laird Turner LTR-14 and later the Turner RT-14, the modified racer placed third in the 1937 Thompson Trophy event at the National Air Races and won the 1938 and 1939 contests. With this aircraft, Turner became the only three-time winner of the Thompson Trophy. In 1939 the aircraft was sponsored by Champion Spark Plugs and therefore carried the name \"Miss Champion\" on its fuselage. View more: http://n2t.net/ark:/65665/nv9ca53a788-1445-47cd-ac99-1fade0572f7a"
  },
  "served several private owners, survived a crash, and saw use as a crop-duster.": {
    "image": "",
    "text": "The Mailwing NC-2895 was built in 1927 and was the prototype for a series of Pitcairn mail planes. It combined a square-steel-tube fuselage with wooden wings, both covered by fabric. After it became obsolete as a mail plane, this airplane served several private owners, survived a crash, and saw use as a crop-duster. View more: http://n2t.net/ark:/65665/nv904492598-6d34-4273-be4a-b6c9e3bf755a"
  },
  "the Army Air Corps, following the success of the Navy’s GV-1710-A model. The": {
    "image": "",
    "text": "The Allison XV-1710-1 (V-1710-A2) was the first V-1710 engine built for the Army Air Corps, following the success of the Navy’s GV-1710-A model. The Air Corps ordered an engineering prototype in March 1932, and after initial testing by Allison, it was delivered for experimental tests to the Air Corps at Wright Field in July 1933, with the first production engine delivered in February 1935. In that same period, Allison became a division of General Motors. View more: http://n2t.net/ark:/65665/nv98499e6e5-b488-4ea1-8c86-5c730afee63a"
  },
  "nonstop flight was truly an outstanding accomplishment.": {
    "image": "",
    "text": "The H-1 had two sets of wings, The wings Hughes used to break the land plane speed record were of a low aspect ratio and shorter than those with which it is now fitted. The wings now fitted on the aircraft span 31 feet, 9 inches. have a moderateect -aspratio and were used when Howard Hughes broke the transcontinental speed record in the H-1 on January 19, 1937. Hughes departed Los Angeles before dawn and arrived at Newark Airport, outside New York City, 7 hours, 28 minutes, and 25 seconds later. His average speed over the 2,490-mile course was 332 mph, and this nonstop flight was truly an outstanding accomplishment. View more: http://n2t.net/ark:/65665/nv9e06dc4f1-0d70-4b10-b01d-ef40330f4f3f"
  },
  "While none of the teams had achieved that elusive goal by the end": {
    "image": "",
    "text": "That original project did not result in a launch, but it did establish the goal. Over the next two decades, 18 teams announced their intention to accept the challenge. Seven of those teams launched a total of sixteen balloons in unsuccessful attempts to fly around the world. In the fall of 1997, the Anheuser-Busch Company offered a trophy and a one million dollar prize (one half of which was to be donated to charity) to the first balloonists to achieve what was widely recognized as \"the last great aviation challenge of the century.\" While none of the teams had achieved that elusive goal by the end of 1998, they had captured the public imagination with a series of record-breaking long distances flights and hair\'s breadth escapes from danger. View more: http://n2t.net/ark:/65665/nv902783d99-dab1-4380-a921-3cd4a9c45e54"
  },
  "accident in which a pilot was killed after he put the aircraft into": {
    "image": "",
    "text": "While much of this was true, the Junior had its problems. The Szekely engine was temperamental and had a habit of occasionally throwing a cylinder. This was solved by tying a steel cable around the cylinder heads, which although it could not keep the cylinder from being thrown, kept a thrown cylinder from being blown back into the propeller. Moreover, some accidents occurred on the ground when passengers in the rear cockpit walked into the propeller after deplaning. The Junior was modified as an amphibian and called the Duck, but an accident in which a pilot was killed after he put the aircraft into a shallow, inverted dive seriously damaged the aircraft\'s reputation. View more: http://n2t.net/ark:/65665/nv969d946cc-41d7-4912-a28e-f402c444d249"
  },
  "flight that made Smith famous was accomplished in 1924 for the U.S. Army": {
    "image": "",
    "text": "The 1A Autographic Kodak Junior camera was a folding camera using roll film, introduced in 1914 as part of the Autographic Kodak Junior series, 1914-1927. Using \"Autographic\" film and a stylus, the user could write data on the negatvie via carbon paper fit inbetween the film and the film backing. Colonel Lowell H. Smith, a pioneer in military aviation, took this camera on the Douglas World Cruiser 1924 world flight. Smith was born on October 8, 1892 and graduated from San Fernando College in 1912. Three years later, Smith joined the Aviation Service in the Mexican Army before returning to the United States in 1917 to enlist in the Aviation Section of the Signal Corps. After World War I, Smith began his record setting career when he placed second in the Transcontinental Reliability and Endurance Contest from New York to San Francisco. In 1923, he finished third in the Liberty Engine Builders Race in St. Louis, Missouri. Smith and Lieutenant John Richter set a new world record in August of the same year. With the help of in-flight refueling, they flew non-stop for 37 hours and 11 minutes in a DH-4 over San Diego. For this, he received the Distinguished Flying Cross. The round-the-world flight that made Smith famous was accomplished in 1924 for the U.S. Army Air Service. Five Douglas World Cruisers were specially-built for the project. The aircraft were named Seattle, Chicago, Boston and the New Orleans and also included a prototype for test flights. The flight commander, Major Frederick L. Martin, flew the Seattle. Smith, Lt. Leigh Wade and Lt. Erik H. Nelson piloted the Chicago, the Boston, and the New Orleans, respectively. The crew took off from Seattle on April 6, 1924, but soon ran into trouble when Martin crashed over Alaska. Smith was made flight commander and landed back in Seattle on September 28 after flying 27,553 miles in 371 hours and 11 minutes. He received the Distinguished Service Medal for the historic flight. View more: http://n2t.net/ark:/65665/nv9b103470e-9d03-48c0-b1b9-350668a1a553"
  },
  "in automobiles. Hisso engines were very successful and, to save weight, featured innovative": {
    "image": "",
    "text": "Marc Birkigt, an inventor of Swiss origin, developed Hispano-Suiza (meaning Spanish-Swiss) engines, and first manufactured them in Barcelona for use in automobiles. Hisso engines were very successful and, to save weight, featured innovative cast-aluminum cylinder construction with internal water passages and screwed-in steel sleeves. Particularly to meet demand in World War I required licensing of Hisso aircraft engine manufacturing in France, England and the U.S by Wright-Martin, later the Wright Aeronautical Corporation. View more: http://n2t.net/ark:/65665/nv950140429-40f1-4846-9cca-8ea105d6df7a"
  },
  "houses of Congress in 1972. It failed, however, to be ratified by the": {
    "image": "",
    "text": "This \"ERA is for Everyone\" button was owned by Dr. Sally K. Ride. The Equal Rights Amendment (ERA) was introduced to Congress for the first time in 1923, and passed both houses of Congress in 1972. It failed, however, to be ratified by the necessary number of states by the extended deadline of June 1982. Ride followed the ERA campaign, and would stop patronizing companies if she knew that they did not support the ERA. When Ride became the first American woman in space during the STS-7 mission of 1983, her exemplary performance as a Mission Specialist challenged perceptions of women as the \"weaker sex.\" View more: http://n2t.net/ark:/65665/nv99500f410-5658-481d-9d58-b500e4ee12ce"
  },
  "Air Model R racing aircraft which won the 1929 Thompson Trophy race in": {
    "image": "",
    "text": "Balsa, metal, and acetate display model of the Travel Air Model R racing aircraft which won the 1929 Thompson Trophy race in red and black paint scheme. 1/16 scale. View more: http://n2t.net/ark:/65665/nv958e440e3-babd-48fb-8a42-1a618ba57ca6"
  },
  "after one of the original propellers failed.": {
    "image": "",
    "text": "Voyager was virtually a flying fuel tank. It had eight storage tanks on each side of the airplane and a fuel tank in the center, for a total of 17 tanks. The pilot shifted fuel from tank to tank during the flight to keep the airplane in balance. The 3,181 kilograms (7,011 pounds) of fuel aboard at takeoff amounted to 72.3 percent of its gross takeoff weight. At the end of the flight only 48 kilograms (106 pounds) of fuel remained. Two engines, one at each end of the fuselage, powered the aircraft. The highly efficient 110-hp, liquid-cooled rear engine, a Teledyne Continental IOL-200, ran during the entire flight except for four minutes when a fuel problem caused a temporary shutdown. The 130-hp, air-cooled front engine, a Teledyne Continental 0-240, was used for a total of 70 hours and 8 minutes during the initial, heavyweight stage of the flight, and also while climbing over weather and at other critical times. Voyager was equipped with Hartzell constant-speed, variable-pitch aluminum propellers that proved to be a critical factor in stretching the aircraft\'s range enough to bring it home. These propellers were designed, built, and delivered in only 17 days after one of the original propellers failed. View more: http://n2t.net/ark:/65665/nv90f1ca334-cc99-47bf-b6f4-88ff9e98d0f6"
  },
  "into production. Two of the YF-12As crashed during testing. Only one survives and": {
    "image": "",
    "text": "Lockheed built fifteen A-12s, including a special two-seat trainer version. Two A-12s were modified to carry a special reconnaissance drone, designated D-21. The modified A-12s were redesignated M-21s. These were designed to take off with the D-21 drone, powered by a Marquart ramjet engine mounted on a pylon between the rudders. The M-21 then hauled the drone aloft and launched it at speeds high enough to ignite the drone\'s ramjet motor. Lockheed also built three YF-12As but this type never went into production. Two of the YF-12As crashed during testing. Only one survives and is on display at the USAF Museum in Dayton, Ohio. The aft section of one of the \"written off\" YF-12As which was later used along with an SR-71A static test airframe to manufacture the sole SR-71C trainer. One SR-71 was lent to NASA and designated YF-12C. Including the SR-71C and two SR-71B pilot trainers, Lockheed constructed thirty-two Blackbirds. The first SR-71 flew on December 22, 1964. Because of extreme operational costs, military strategists decided that the more capable USAF SR-71s should replace the CIA\'s A-12s. These were retired in 1968 after only one year of operational missions, mostly over southeast Asia. The Air Force\'s 1st Strategic Reconnaissance Squadron (part of the 9th Strategic Reconnaissance Wing) took over the missions, flying the SR-71 beginning in the spring of 1968. View more: http://n2t.net/ark:/65665/nv9afd733c1-f6b5-45f1-ab28-2d19c801b502"
  },
  "After several days of successful flights, tragedy occurred on September 17, when Orville": {
    "image": "",
    "text": "The 1909 Wright Military Flyer is the world\'s first military airplane. In 1908, the U.S. Army Signal Corps sought competitive bids for a two-seat observation aircraft. Winning designs had to meet a number of specified performance standards. Flight trials with the Wrights\' entry began at Fort Myer, Virginia, on September 3, 1908. After several days of successful flights, tragedy occurred on September 17, when Orville Wright crashed with Lt. Thomas E. Selfridge, the Army\'s observer, as his passenger. Orville survived with severe injuries, but Selfridge was killed, becoming the first fatality in a powered airplane. View more: http://n2t.net/ark:/65665/nv9ba320409-777f-4cde-92c1-fa6b51e1ffcd"
  },
  "created helicopter engine maintenance problems. GE won the 1971 power plant competition for": {
    "image": "",
    "text": "The T700 engine evolved directly from Army experience in the Vietnam War\'s difficult operating conditions that created helicopter engine maintenance problems. GE won the 1971 power plant competition for the proposed Utility Tactical Transport System (UTTAS) helicopter, with specifications for a high performance, low fuel consumption, reduced maintenance, and combat damage resistant engine. This is one of the experimental engines used in the UTTAS rotorcraft competition in 1974. View more: http://n2t.net/ark:/65665/nv9162f0555-eb30-45ff-bfe6-337c4a62426f"
  },
  "The failure to find any evidence of life": {
    "image": "",
    "text": "The failure to find any evidence of life on Mars, past or present, devastated the optimism of scientists involved in the search for extraterrestrial life. Collectively, these missions led to the development of two essential reactions. The first was an abandonment by most scientists that life might exist elsewhere in the Solar System. Planetary scientist and JPL director Bruce Murray complained at the time of Viking about the lander being ballyhooed as a definite means of ascertaining whether or not life existed on Mars. The public expected to find it, and so did many of the other scientists involved in the project. Murray argued that “the extraordinarily hostile environment revealed by the Mariner flybys made life there so unlikely that public expectations should not be raised.” Murray believed that the legacy of failure to detect life, despite the billions spent and a succession of overoptimistic statements, would spark public disappointment and perhaps a public outrage. Murray was right. The immediate result was that NASA did not return to Mars for two decades. The Viking Program’s chief scientist, Gerald A Soffen, commented in 1992: “If somebody back then had given me 100 to 1 odds that we wouldn’t go back to Mars for 17 years, I would’ve said, ‘You’re crazy’.” View more: http://n2t.net/ark:/65665/nv90c37c1bd-bc40-4e71-8ee1-efe4ee46264e"
  },
  "Whitney arrangement possibly contributing to this success. This 18-cylinder, two-row, air cooled aircraft": {
    "image": "",
    "text": "Mitsubishi was the first and largest series producer of Japanese engines during World War II, with a 1937 Pratt & Whitney arrangement possibly contributing to this success. This 18-cylinder, two-row, air cooled aircraft engine incorporated two-speed reduction gearing, a cooling fan, and twin transverse superchargers to achieve two stage supercharging. View more: http://n2t.net/ark:/65665/nv99ec0a9cb-b884-41bc-9446-f5ae4a861b9a"
  },
  "severe thunderstorm near Caldwell, Ohio, and crashed.": {
    "image": "",
    "text": "Installed in \"cars\" attached to the airship, five Model 1A-1551 engines powered the Shenandoah, which made its first flight in October 1923. Mechanics controlled and serviced the engines in flight from these cars. In October 1924, the Shenandoah became the first airship to make a U.S. transcontinental trip. But, in September 1925, the Shenandoah broke up in a severe thunderstorm near Caldwell, Ohio, and crashed. View more: http://n2t.net/ark:/65665/nv9868782a6-fcb4-4dfe-a1be-6192877a75e2"
  },
  "U.S. transcontinental flight in 1923. Two failed attempts at a west-to-east crossing were": {
    "image": "",
    "text": "Under the auspices of the U.S. Army Air Service, the Fokker T-2 made the first nonstop U.S. transcontinental flight in 1923. Two failed attempts at a west-to-east crossing were followed by a successful east-to-west flight when Air Service Lieutenants Oakley Kelly and John Macready took off from Long Island, New York, on May 2 and landed at Rockwell Field, San Diego, California, on May 3, slightly more than 26 hours and 50 minutes later. View more: http://n2t.net/ark:/65665/nv9dd5825e0-0d95-431f-8da4-9a6e3dfc1f32"
  },
  "located in Rochester, NY, when they won a NASA contract to create the": {
    "image": "",
    "text": "This is the backup primary mirror for the Hubble Space Telescope manufactured by the Eastman Kodak Company. The blank for this mirror was fabricated by the Corning Glass Works using their high silicon Ultra Low Expansion Glass (ULE 7971). It consists of two 1-inch glass disks fused to the faces of a thin square eggcrate-like support structure. This support structure creates a mirror that weighs about one-fifth that of a solid piece of the same size but retains required rigidity and stability characteristics. The blank mirror was sent to the Kodak Apparatus Division located in Rochester, NY, when they won a NASA contract to create the back-up optical mirror. Kodak ground the mirror surface into the proper concave shape and then polished it to successively finer tolerances using computer-assisted testing routines. The finished mirror was tested and verified by Kodak to meet the strict optical tolerances prescribed by NASA. It was left un-aluminized mirror and delivered to the Perkin-Elmer Corporation in Danbury Connecticut, the prime contractor for the flight mirror, and was stored there until the end of 2000, at which time NASA determined that its value as a display object was greater than its potential value as a telescope mirror. It was then transferred from NASA to NASM by Raytheon, who absorbed Perkin-Elmer. View more: http://n2t.net/ark:/65665/nv94cde34c1-b6ac-4cbb-9515-7ad10a503c84"
  },
  "National Air and Space Museum collection achieved fame in their own right or": {
    "image": "",
    "text": "Most of the aircraft in the National Air and Space Museum collection achieved fame in their own right or represent an important aircraft type of technical or historical significance. The Ecker Flying Boat adequately meets these criteria, but it deserves a place in the national collection for another equally noteworthy reason. The Ecker represents that vast, largely unknown, wholly uncelebrated population of pioneer aviators who built flying machines in their backyards out of bits and scraps from the local hardware store. Their efforts helped to carry the burgeoning technology of heavier-than-air flight out of infancy. View more: http://n2t.net/ark:/65665/nv980146805-e9d6-4e55-bdcb-04ba5a38ca08"
  },
  "the stops along the route, Fowler crashed on takeoff, but with little injury": {
    "image": "",
    "text": "Fowler picked up the NASM Gage at Griffith Park field in Los Angeles in October 1912. On October 19 and 20, he flew an exhibition at Constan\'s ostrich farm in Pasadena, and on November 7 he left Griffith Park for San Francisco in a race with a Cadillac automobile. At Saugus, one of the stops along the route, Fowler crashed on takeoff, but with little injury to himself or damage to the airplane. In November 12, 1912, Fowler and his Gage airplane began a week-long series of appearances at the Empress Theater in San Francisco, the pilot lecturing with his aircraft behind him on the stage. On November 22 he flew the Gage from San Francisco to Gilray and back and in December flew in a competition at San Francisco\'s Tanforan Park. Early the following year he continued flying in the San Francisco area with passenger and exhibition flights. Some time during this period Fowler replaced the original 60-horsepower Hall-Scott engine with an 80-horsepower Hall-Scott, and fitted the Gage with floats. View more: http://n2t.net/ark:/65665/nv9444d0055-0d84-4bd4-b935-f3968bd246d4"
  },
  "Scottish immigrant, Don Mitchell, designed the successful series of ultralight, all-wing airplanes called": {
    "image": "",
    "text": "Scottish immigrant, Don Mitchell, designed the successful series of ultralight, all-wing airplanes called the B-10 and the U-2 Superwing. He began work on the B-10 in 1975 and the aircraft first flew in 1976. This simple inexpensive, fun flyer became so popular that Mitchell decided to design a new version that he designated the U-2. He made many improvements and first flew the new version in 1979. View more: http://n2t.net/ark:/65665/nv9e0c576d6-835c-460a-8276-ea1b9aa04b10"
  },
  "of a passenger killed in the crash of a Long-EZ (another Rutan canard": {
    "image": "",
    "text": "The VariEze had other important attributes besides performance that appealed to many individuals who wanted to build their own airplanes. The VariEze looked exotic and unusual but aside from the canard configuration, and the composite foam/fiberglass structure, the airplane was mechanically simple and orthodox. A builder with average mechanical skills could construct the aircraft quickly and inexpensively, and the airplane was economical to fly and maintain. Rutan sold more than 3,000 plan sets by the end of 1979 and by 1980, two hundred VariEzes were flying. In 1985, following a protracted lawsuit brought by the relatives of a passenger killed in the crash of a Long-EZ (another Rutan canard design), Rutan decided to stop selling plans for all Rutan airplanes. View more: http://n2t.net/ark:/65665/nv98f49e3d2-0c7f-4b50-829e-3439dc0d3b6f"
  },
  "have struck the pilot. Despite the tragedy, more pilots volunteered to fly and": {
    "image": "",
    "text": "Now a man had to fly and the first test came on February 28. Oberleutnant Lothar Siebert climbed into a Ba 349A, strapped in, and rocketed off the launch tower. At about 500 m (1600 ft), the Natter shed its canopy and headrest and the aircraft veered off and flew into the ground, killing Siebert. No cause was determined but the ground crew may have failed to lock the canopy and it could have struck the pilot. Despite the tragedy, more pilots volunteered to fly and the Bachem team launched three flights in March. View more: http://n2t.net/ark:/65665/nv9559842be-2e74-4af5-8554-a36f367f3d02"
  },
  "airplane mounted on floats) and he won the Trophy again the following year": {
    "image": "",
    "text": "Glenn H. Curtiss is considered the \"Father of the Flying Boat,\" having developed the first practical and highly successful flying boat in 1913. His interest in aircraft that could operate from water was spurred almost as soon as he entered the nascent field of aeronautics. In 1911, Curtiss was awarded the prestigious Collier Trophy for the development of the hydroaeroplane (a land airplane mounted on floats) and he won the Trophy again the following year in recognition of his continued refinement of the design. In 1913, the Smithsonian Institution bestowed its Langley Medal upon Curtiss for these contributions to flight. View more: http://n2t.net/ark:/65665/nv9bf0b1fbc-47ae-4a55-b519-09d539773a3d"
  },
  "those engines powered the aircraft which crashed in 1912 at Macon, Georgia, killing": {
    "image": "",
    "text": "Curtiss was one of the most successful early American aircraft engine manufacturers. The first Curtiss engines were air cooled but, to achieve higher power, Curtiss began to develop liquid-cooled engines. Historical evidence suggests that this Model L artifact was one of two higher-performance engines built by Curtiss for his experimental monoplane that was shown, but not flown, at the 1910 Gordon Bennett Race held at Belmont Park, N.Y. Both engines were later assigned to Eugene Ely, a pilot for Curtiss, who used them in exhibition and demonstration flights. It is likely that one of those engines powered the aircraft which crashed in 1912 at Macon, Georgia, killing Ely. View more: http://n2t.net/ark:/65665/nv9d750a9dd-c8f8-4561-910e-11c6cec122a2"
  },
  "Crashed on Moon 22 September 1966": {
    "image": "",
    "text": "Crashed on Moon 22 September 1966 View more: http://n2t.net/ark:/65665/nv9f8a0a3a4-9777-4b24-8a2c-747cb79ced23"
  },
  "utility helicopter. The first in Sikorsky\'s successful S-55 series, it solved the center-of-gravity": {
    "image": "",
    "text": "The YH-19 was the first practical single-rotor utility helicopter. The first in Sikorsky\'s successful S-55 series, it solved the center-of-gravity problems of earlier models by shifting the engine to the front and the passenger compartment to beneath the rotor hub. Other innovations included offset-flapping hinges and hydraulically boosted irreversible controls. Designed for the Air Force for arctic rescue, the S-55 served all U.S. military branches throughout the 1950s, especially during the Korean War and in most major military conflicts of the early Cold War. Civilian versions pioneered helicopter airline service in the United States and abroad. View more: http://n2t.net/ark:/65665/nv94184b632-e536-457d-bdc5-4b7a7fcb123f"
  },
  "but these were generally not considered successful. After 1945, the company became Fuji,": {
    "image": "",
    "text": "This engine is of the type that powered the World War II Japanese Nakajima B6N Navy Carrier Attack Bomber Tenzan Type 11 (Allied Code Name Jill). Between 1941 and 1944, 200 engines of all Mamoru series were manufactured, but these were generally not considered successful. After 1945, the company became Fuji, building airframes only. View more: http://n2t.net/ark:/65665/nv9708c0332-e2b3-49f1-9950-ad3817332a32"
  },
  "Wiley Post died shortly afterward in the crash of": {
    "image": "",
    "text": "Wiley Post died shortly afterward in the crash of a hybrid Lockheed Orion-Sirius floatplane near Point Barrow, Alaska, on August 15, 1935. His companion, humorist Will Rogers, also perished in the accident. The Smithsonian Institution acquired the Winnie Mae from Mrs. Post in 1936. View more: http://n2t.net/ark:/65665/nv9549c63e5-855a-48f9-b468-9624934669f4"
  },
  "the Rogers Commission after the Challenger tragedy in 1986 as well as the": {
    "image": "",
    "text": "Viewed as a leader in the NASA community, Sally Ride served on the Rogers Commission after the Challenger tragedy in 1986 as well as the Columbia Accident Investigation Board (CAIB) in 2003. She also led the task force that produced a visionary strategic plan in 1987, titled “NASA Leadership and America’s Future in Space,” known popularly as the \"Ride Report.\" After she left NASA in 1987, Dr. Ride taught first at Stanford and later at the University of California, San Diego, where she also served as the director of the California Space Institute. From 2001 until her death in 2012, she was president and CEO of Sally Ride Science, a company she founded to promote science education. View more: http://n2t.net/ark:/65665/nv963289d9e-e23b-455c-8ce7-d254d20abb03"
  },
  "a rugged, dependable transport airplane, which won a permanent place in aviation history.": {
    "image": "",
    "text": "One of the most important events in the selling of aviation to the general public was the entry of Henry Ford into aircraft manufacturing. The Ford automobile was at the time the symbol of reliability, and it followed in the minds of a good many people that a Ford airplane would be safe to fly. And it was. The Ford Tri-motor was a rugged, dependable transport airplane, which won a permanent place in aviation history. View more: http://n2t.net/ark:/65665/nv95318a218-007b-42e5-bfe5-798a0a4d453e"
  },
  "In 1938 Wittman crash-landed the Chief at the Oakland, California,": {
    "image": "",
    "text": "In 1938 Wittman crash-landed the Chief at the Oakland, California, races. The aircraft was not raced again until 1947, when it was revamped, fitted with new wings, and renamed Buster. View more: http://n2t.net/ark:/65665/nv9cee4f994-7ff5-4906-9e73-d40a5fb0deba"
  },
  "Following the success of the first model, the Navy": {
    "image": "",
    "text": "Following the success of the first model, the Navy contracted for forty-six improved versions in June 1930, with deliveries beginning in January of the next year. The F4B-2 differed in having a redesigned ring cowling, improved split-axle landing gear, and Frise ailerons. Maximum speed was increased to 298 kph (186 mph), and the airplane could carry four 56.2-kg (116-lb) bombs. View more: http://n2t.net/ark:/65665/nv99bf65ac8-2245-46ef-8cde-333505e39380"
  },
  "lower wing being susceptible to frequent failure in prolonged dives. The Albatros D.V": {
    "image": "",
    "text": "In 1916, Albatros Werke produced the remarkably advanced Albatros D.I. It featured a streamlined semi-monocoque fuselage, with an almost fully-enclosed 160-horsepower in-line Mercedes engine, and the propeller spinner neatly contoured into the nose of the fuselage. A sesquiplane version with narrow-chord lower wings, designated the D-III, was introduced early in 1917, and served with great success, despite the narrow lower wing being susceptible to frequent failure in prolonged dives. The Albatros D.V model was fitted with a more powerful 180-horsepower engine, but was plagued by a rash of upper-wing failures. The wings were strengthened, resulting in a re-designation, the D.Va. Unfortunately, the necessary strengthening increased the weight and negated the performance advantage of the new engine. The D.V and D.Va also continued to experience the same lower wing failure problems in a dive similar to the earlier D.III. A small auxiliary strut was added at the bottom of the outer wing struts to address the issue, but was not entirely successful. View more: http://n2t.net/ark:/65665/nv9b7ad2dc8-ab0d-44c4-aa66-2cdf7a99e81b"
  },
  "developed into the 1922 D-12, a successful engine for both racing and fighter": {
    "image": "",
    "text": "Unable to overcome these difficulties, Kirkham left Curtiss in 1919. However, development continued under Arthur Nutt, and a derated CD-12, without the reduction gearing of the K-12, resulted in 1921. This further developed into the 1922 D-12, a successful engine for both racing and fighter aircraft. View more: http://n2t.net/ark:/65665/nv9976093b2-414e-4954-89c9-51c3430590c1"
  },
  "of a suitable engine. The ultimate failure of concept should not obscure the": {
    "image": "",
    "text": "Designer Jim Bede announced that his BD-5 would deliver tremendous performance at a minimal cost, particulary to those who purchased and built the kit designed for amateur construction. Tremendous enthusiasm for the airplane could not overcome a significant weakness in the design: the lack of a suitable engine. The ultimate failure of concept should not obscure the many original and innovative aspects of the design. View more: http://n2t.net/ark:/65665/nv9e2d093a9-5984-4555-9c00-b2e7f944b2e4"
  },
  "in third place. The race was won by an English de Havilland DH": {
    "image": "",
    "text": "The museum’s aircraft made its first flight on September 5. 1934. It was leased from United by Turner and modified with extra fuel tanks to provide a range of more than 2,500 miles for the 1934 MacRobertson Race. Turner, Pangborn, and Reeder Nichols took off from Mildenhall, England on October 20, 1934, and landed 92 hours, 55 minutes, and 30 seconds later at Melbourne, Australia, finishing in third place. The race was won by an English de Havilland DH 88 Comet: second place went to a KLM-operated Douglas DC-2. View more: http://n2t.net/ark:/65665/nv9551f7679-9b6e-4b4f-8b71-086014a2ab7f"
  },
  "to several fatal accidents. Among those killed in P-80s were Lockheed test pilot": {
    "image": "",
    "text": "The first service-test models of Lockheed\'s jet fighter flew on September 12, 1944. The AAF designated them YP-80As and sent two each to England and Italy as Me 262 pilots began to take their toll of Allied bomber crews. A fast and reliable foil to the deadly Messerschmitt was sorely needed. However, not enough production P-80 fighters, or crews trained to fly them, were available to equip a front line squadron. An AAF order raising the production priority to the highest level, equaling priority for Boeing B-29 Superfortress bombers (see NASM collection), could not speed quantity manufacturing. The rush to field the brand new fighter may have lead to several fatal accidents. Among those killed in P-80s were Lockheed test pilot Milo Burcham and America\'s top ace and Medal of Honor winner, Major Richard I. Bong. After World War II, the P-80 \"Shooting Star\" became a fine, reliable frontline fighter. A highlight of the type\'s service record occurred came on November 8, 1950, when Lt. Russ Brown, flying an F-80C of the 16th Fighter Interceptor Squadron, shot down a North Korean MiG-15 in the first all-jet air-to-air combat. View more: http://n2t.net/ark:/65665/nv974c37014-7915-445e-b56b-7146fc4b8074"
  },
  "and 5 May 1926 was not successful, as it did not have enough": {
    "image": "",
    "text": "This device is the oldest surviving liquid-propellant rocket in the world. It was designed and built by U.S. rocket experimenter Robert H. Goddard in Worcester, Massachusetts. It was Goddard\'s first in which the motor was placed at the base, instead of in the nose. He had used the latter configuration on the world’s first liquid-propellant rocket to fly, which he launched on 16 March 1926. The May rocket likely includes the nozzle from that historic vehicle. His attempt to launch his new rocket on 4 and 5 May 1926 was not successful, as it did not have enough thrust to lift itself. View more: http://n2t.net/ark:/65665/nv9c41fe215-917c-469e-8786-2371a867e44e"
  },
  "that the friction of the tires accomplished while the aircraft remained on the": {
    "image": "",
    "text": "The development of the PCA-1 proceeded steadily, but slowly, as the challenge of scaling-up the C.8W was much more significant than a mere increase in the dimensions. One innovation was the use of a steel spar instead of the wooden one employed on the C.8W. Pitcairn\'s continuing frustration over the rotor spin-up problem led to his incorporation of an important autogiro development - a clutch that allowed the engine to bring the rotor rpm up before flight. This was not possible in flight because there would have been no means of counteracting torque - something that the friction of the tires accomplished while the aircraft remained on the ground. However, this important development did set the stage for the jump-takeoff autogiros that appeared in the late 1930s. View more: http://n2t.net/ark:/65665/nv9f13b1e58-02bb-49e0-93bb-7b97501b52ea"
  },
  "to be eliminated. Direction control was accomplished through cyclic pitch control as on": {
    "image": "",
    "text": "The XH-44 differed dramatically in appearance from other helicopters developed during this period, because it employed two rotors, one stacked above the other on a single mast, and turning in opposite directions. Hiller had selected this unusual coaxial configuration for several reasons. The design was already proven in what can be regarded as the first practical helicopter, the Bréguet-Dorand Laboratory Gyroplane, which first flew in 1935. While the mechanism that allowed the rotors to turn in opposite directions was somewhat complex, it allows other weight-consuming components to be eliminated. Direction control was accomplished through cyclic pitch control as on most other helicopters. View more: http://n2t.net/ark:/65665/nv9f93b9a5b-92e7-4089-96e4-68385520dd30"
  },
  "airplane over on landings. Foyle was killed in another airplane accident and John": {
    "image": "",
    "text": "In 1946 and 1947 at the Miami Air Manuevers, Edmondson placed second in the aerobatics competition to Bevo Howard in his Bucker Jungmeister, which is also in the NASM collection, but he won in 1948 when the first International Aerobatics Championships were held. Sponsored by Gulf Oil Corporation, he continued to use N36Y on the air-show circuit throughout the east and midwest until 1951. Edmondson sold the airplane to Johnny Foyle, an air show pilot of South Boston, Virginia, on August 22, 1960, who twice flipped the airplane over on landings. Foyle was killed in another airplane accident and John McCulloch, an Eastern Airlines captain from Naples, Florida, bought N36Y on June 18, 1965. McCulloch shipped it to Florida to be rebuilt by Monocoupe specialist C.V. Stewart and then test-flew the rebuilt airplane on March 8, 1966. View more: http://n2t.net/ark:/65665/nv9e47ffb56-7443-4efc-b337-0f53ababc525"
  },
  "Aerobatic Teams of 1970 and 1972 won the world team championships flying the": {
    "image": "",
    "text": "The Pitts S-1S Special biplane reigned as the ultimate competition aerobatic aircraft in the early 1970s. The U.S. Aerobatic Teams of 1970 and 1972 won the world team championships flying the Pitts S-1S almost exclusively. It remains one of the world\'s most popular aircraft for basic to advanced category competition, aerobatic training, and sport flying. View more: http://n2t.net/ark:/65665/nv9ce83f5c3-f1ce-475c-bafe-7db742da0ad5"
  },
  "always recognized her importance to their success and called her \"the crew,\" a": {
    "image": "",
    "text": "Anne Morrow Lindbergh wore these radio headphones as she flew with her husband Charles to the Orient in 1931 and on survey flights across the North and South Atlantic in 1933. Anne, who served as co-pilot, operated all of the radio equipment during the Lindberghs\' two trans-global flights, performing an impressive daily workload, and set a telegraph transmission distance record. She worked hard to learn Morse code and earn her radio operator\'s license, thus felt slightly insulted when women reporters seemed most interested in her clothes or where she packed the lunch boxes on the airplane. Charles, however, always recognized her importance to their success and called her \"the crew,\" a term that made her proud. View more: http://n2t.net/ark:/65665/nv9609bcf10-a503-4b7e-8df9-7fb841d0a7ae"
  },
  "killed. During this mission, 18 men died, four aircraft were destroyed, and four": {
    "image": "",
    "text": "The 22nd Bombardment Group (BG) at Langley Field, Virginia, received the first Marauders in February 1941. Many nosewheel strut failures delayed the transition to full operational status but the first airplanes flew combat missions in the Pacific not long after the American entry into World War II. On June 4, 1942, four Army Air Corps Marauders defending Midway island attacked Japanese aircraft carriers with torpedoes but failed to score hits. It was soon obvious that the B-25 Mitchell required less runway for takeoff and had greater range than the B-26 so U. S. Army Air Force (AAF) planners shifted all Marauders to Africa and the European Theater of Operations. The Mitchell became the preferred type in the Pacific. The 319th BG became the first Marauder outfit sent to England. During a familiarization flight, one ex-Tokyo raider crashed and the Group CO (commanding officer) and a Squadron CO became lost over France and were shot down and killed. During this mission, 18 men died, four aircraft were destroyed, and four damaged. The Army Air Forces sent Marauders on to North Africa after the Allies invaded that continent in November 1942. By the 21st of that month, the last 319th B-26 had arrived in Algeria. Out of 57 bombers that left the U. S., only 17 made it to Africa. On December 4, the new 319th Bombardment Group CO flew his first mission with the acting CO. The B-26 was hit by heavy anti-aircraft fire over the target and crashed. All survived and became POWs (prisoners of war). On December 15, the 12th Bomber Command CO, Col. Charles Phillips flew as guest pilot aboard a B-26 flown by a Squadron CO. This bomber was downed by anti-aircraft fire and all aboard perished. Such tragic missions were common during these initial stages of B-26 operations. View more: http://n2t.net/ark:/65665/nv9814126aa-8326-49a1-9550-7189ec058706"
  },
  "parachute jumps from the balloon. His successful daring quickly led to a world": {
    "image": "",
    "text": "Thomas Scott Baldwin was one of the more significant aviation figures of the pioneer era, even though his name is relatively unknown today. He was born in 1854, and after a stint as a brakeman on the Illinois railroad as a youth, he joined the circus as an acrobat. One of the circus attractions was a balloon with which Baldwin ascended seated on a trapeze suspended beneath. He made his first trip aloft in 1875. Soon he enhanced the act by performing acrobatics on the trapeze at several hundred feet, which, by 1885, led to parachute jumps from the balloon. His successful daring quickly led to a world tour, including a special performance before the Prince of Wales in London. Baldwin\'s manager for the tour billed him as \"Captain\" Baldwin, a nickname by which he would be known from then on. View more: http://n2t.net/ark:/65665/nv979c27f57-77f0-4e4d-a605-1fa49238a591"
  },
  "the first time light personal aircraft accomplished such a feat. Evans flew the": {
    "image": "",
    "text": "From August 9 to December 10, 1947, Clifford Evans and George Truman circled the globe in their Piper Super Cruisers, covering 35,897 kilometers (22,436 miles), the first time light personal aircraft accomplished such a feat. Evans flew the City of Washington while Truman flew the City of The Angels, now at the Piper Aviation Museum in Lock Haven, Pennsylvania. View more: http://n2t.net/ark:/65665/nv9db01c8a1-88c4-4be9-8588-12e04cf6f1ff"
  },
  "cargo glider, the XCG-1, suffered structural failure at only 63% of its design": {
    "image": "",
    "text": "Before submitting his bid, Stan Corcoran had produced gliders for the civilian market at his Frankfort Sailplane Company factory. He was well known among competition glider pilots, and in the late 1930s, he had started small-scale construction of his Cinema I single-place glider in Frankfort, Michigan. Civilian interest in gliding was growing at a steady pace and Corcoran\'s company soon relocated to larger facilities in Joilet, Illinois. When the request for military gliders came out, Corcoran responded with a two-place training glider design, essentially a Cinema I with provision for another pilot. Corcoran also attempted to win contracts for production of the 8- and 15-man cargo gliders. However, during tests, Corcoran\'s prototype, 8-seat cargo glider, the XCG-1, suffered structural failure at only 63% of its design load strength, and Corcoran was advised to stick to designing light training gliders. View more: http://n2t.net/ark:/65665/nv93c324516-c26d-4add-94ef-09e78a0e3f0f"
  },
  "on the ground. Once this was accomplished, Hitler could launch Operation Sealion, the": {
    "image": "",
    "text": "For Hitler\'s Luftwaffe, the primary goal of the great contest about to unfold was to engage and destroy all RAF fighter aircraft in the air or on the ground. Once this was accomplished, Hitler could launch Operation Sealion, the amphibious invasion of Great Britain, unopposed by the RAF. The Luftwaffe would then revert to its earlier role as the air component of Blitzkrieg, or Lightning War. German fighters, in conjunction with level bombers such as the Heinkel 111, and the Junkers Ju 87 dive bomber, would work in direct support of the German Army\'s tank and infantry forces by attacking British troops, tanks, and fortifications. View more: http://n2t.net/ark:/65665/nv95757ca0b-c36a-4fea-b2a2-5ab16997ffa3"
  },
  "In December 1959, after the failure of the first lunar probes, NASA\'s": {
    "image": "",
    "text": "In December 1959, after the failure of the first lunar probes, NASA\'s Jet Propulsion Laboratory (JPL) started the Ranger project, partly as a way to get out of the public relations mess the earlier failures had created. On 30 August 1961, NASA launched the first Ranger, but the launch vehicle placed it in the wrong orbit. Two more attempts in 1961 failed, as did two more attempts in 1962. NASA then reorganized the Ranger project and did not try to launch again until 1964. By this time its engineers had eliminated all the scientific instruments except a television camera. Ranger\'s sole remaining objective was to go out in a blaze of glory as it crashed into the Moon while taking high-resolution pictures. Finally, on 31 July 1964, the seventh Ranger worked and transmitted 4,316 beautiful, high-resolution pictures of the lunar Sea of Clouds. The eighth and ninth Rangers also worked well. View more: http://n2t.net/ark:/65665/nv93eaf8d93-f48e-413a-93f8-8ebdd01244c0"
  },
  "at Remagen during mid-March 1945, but failed to drop the Ludendorff railway bridge": {
    "image": "",
    "text": "Only one Luftwaffe unit, KG 76 (Kampfgeschwader or Bomber Wing 76), was equipped with Ar 234 bombers before Germany\'s surrender. As the production of the Ar 234 B-2 increased in tempo during fall 1944, the unit received its first aircraft and began training at Burg bei Magdeburg. The unit flew its first operations during December 1944 in support of the Ardennes Offensive. Typical missions consisted of pinprick attacks conducted by less than 20 aircraft, each carrying a single 500 kg (1,100 lb.) bomb. The unit participated in the desperate attacks against the Allied bridgehead over the Rhine at Remagen during mid-March 1945, but failed to drop the Ludendorff railway bridge and suffered a number of losses to anti-aircraft fire. The deteriorating war situation, coupled with shortages of fuel and spare parts, prevented KG 76 from flying more than a handful of sorties from late March to the end of the war. The unit conducted its last missions against Soviet forces encircling Berlin during the final days of April. During the first week of May the unit\'s few surviving aircraft were either dispersed to airfields still in German hands or destroyed to prevent their capture. View more: http://n2t.net/ark:/65665/nv90c1d339f-3156-4751-87cb-1304014d8f37"
  },
  "the D-12, which became a highly successful racing and military power plant in": {
    "image": "",
    "text": "In 1916 Curtiss engineer Charles Kirkham began designing an engine to compete with the Wright Corporation\'s Hispano-Suiza. By late 1917, the prototype K-12 (K for Kirkham) was bench tested. While it met its design objectives of high power, low frontal area, compact size, and low weight, the engine encountered technical difficulties during development. Kirkham left Curtiss in 1919, and Arthur Nutt took over the project, eventually producing the D-12, which became a highly successful racing and military power plant in the 1920s. View more: http://n2t.net/ark:/65665/nv97125d33a-36f3-4573-8bf8-f3485f415cbe"
  },
  "lost his life when the airplane crashed. The compass was recovered during the": {
    "image": "",
    "text": "In 1935 Wiley Post scavenged this aperiodic compass from the older Winnie Mae for use on his new plane, a Lockheed Orion. Post lost his life when the airplane crashed. The compass was recovered during the investigation. View more: http://n2t.net/ark:/65665/nv9df2fbbbb-345b-4f0f-b131-2de9a3e36d05"
  },
  "the Junkers Ju 52/3m was a successful European airliner. Designed for Deutsche Luft": {
    "image": "",
    "text": "Nicknamed Tante Ju, or \"Auntie Ju,\" the Junkers Ju 52/3m was a successful European airliner. Designed for Deutsche Luft Hansa in 1932, the Ju 52/3m was a tri-motor version of the single-engine Ju-52. It could carry 17 passengers or 3 tons of freight and had good short-field performance. By the mid-1930s, airlines throughout Europe and Latin America were flying them. In World War II, they were the Luftwaffe\'s primary transports, and some served as bombers. View more: http://n2t.net/ark:/65665/nv9d5ab2f98-002e-45d5-9e88-048691fbba6d"
  },
  "\'109 pilots exhausted their fuel and crashed into the icy waters of the": {
    "image": "",
    "text": "Supermarine\'s Spitfire was the first aircraft to seriously challenge the Luftwaffe fighter. The Spitfire was slightly faster and definitely more maneuverable, but its performance at altitude was inferior. There was little difference in piloting skill between the Luftwaffe and the Royal Air Force but in 1940 during the Battle of Britain, the RAF usually fought over friendly territory. The Bf 109s limited fuel capacity reduced fighting time over Britain to about twenty minutes. Many \'109 pilots exhausted their fuel and crashed into the icy waters of the English Channel. View more: http://n2t.net/ark:/65665/nv98e4a8c74-be9b-4373-bedd-f11de7d813b1"
  },
  "liquid-fuel sounding rocket, the U.S.\'s first successful sounding rocket. Developed from 1944 at": {
    "image": "",
    "text": "This is the WAC-Corporal liquid-fuel sounding rocket, the U.S.\'s first successful sounding rocket. Developed from 1944 at the Jet Propulsion Laboratory, it could lift 25 pounds of instruments to 20 miles. The motor used nitric acid and aniline and produced 1,500 pounds of thrust. The first rocket was launched in 1945. View more: http://n2t.net/ark:/65665/nv900f0497b-261b-403b-8e83-25e872ecd506"
  },
  "Flying this Talon 150, Lehmann also won the open class at the 2002": {
    "image": "",
    "text": "Flying this Talon 150, Lehmann also won the open class at the 2002 Region Nine Regional Contest, while other pilots flying Talons placed 3rd and 11th out of a field of 24 pilots. Lehmann flew the Talon a total of about 140 hours and covered 3,381 km (2,100 miles) before selling it to Virginia pilot, John Harper, toward the end of 2002. He reacquired the record-setting Talon 150 in 2005 and generously donated it to the Smithsonian National Air and Space Museum in 2006. View more: http://n2t.net/ark:/65665/nv9d5723df8-da88-4393-89fa-a7e17445bdd9"
  },
  "was truly one of the most successful intelligence- gathering aircraft ever produced. The": {
    "image": "",
    "text": "Still shrouded in secrecy over 35 years after its creation, the Lockheed U-2 was originally designed as a strategic reconnaissance aircraft, playing a crucial role during the tense years of the Cold War. Built by the famous ‘Skunk Works\" by Lockheed under the direction of Clarence L. \"Kelly\" Johnson, the U-2 was truly one of the most successful intelligence- gathering aircraft ever produced. The U-2 on display at NASM flew the first operational mission over the USSR on 4 July 1956, piloted by Hervey Stockman. View more: http://n2t.net/ark:/65665/nv996910d1e-7f59-4210-a38a-6ea8ca63cd62"
  },
  "1935, Ellsworth and Balchen made a successful flight to Graham Land, but clouds": {
    "image": "",
    "text": "The expedition then tried Snow Hill Island on Antarctica’s east coast. On January 3, 1935, Ellsworth and Balchen made a successful flight to Graham Land, but clouds and snow forced them to return to Snow Hill Island after several hours. View more: http://n2t.net/ark:/65665/nv97e01f1c7-9d57-4b07-b010-da60f0f9bb11"
  },
  "the radial concept, being the first successful large aircraft engines of this type.": {
    "image": "",
    "text": "Salmson aircraft engines, produced in France starting in 1913 by the Societe des Moteurs Salmson in Billancourt, Sein, were originally designed and patented by Canton and Unne, and also constructed in Great Britain by the Dudbridge Iron Works, Ltd. of Strand, Gloucester. Development work began in 1908, making it one of the earliest companies to produce radial power plants. Except for being water-cooled, the Salmson engines demonstrated the advantages of the radial concept, being the first successful large aircraft engines of this type. View more: http://n2t.net/ark:/65665/nv9d2acffcc-7d4a-4f48-baef-7ba0d29fd175"
  },
  "on pusher aircraft. Lateral control was accomplished with wing warping. The type B": {
    "image": "",
    "text": "Gaston and René Caudron were among the earliest aircraft manufacturers in France. After building and testing a few original designs in 1909 and early in 1910, the brothers established a flight training school at Crotoy and an aircraft factory at Rue in 1910. The first factory-produced Caudron was the type A4, a 35-horsepower Anzani-powered tractor biplane in which the pilot sat completely exposed behind the rear spar of the lower wing. The next major Caudron design, the type B, was the first to feature the abbreviated fuselage/pilot nacelle, characteristic of many later Caudron aircraft. It was powered by a 70-horsepower Gnôme or 60-horsepower Anzani engine mounted in the front of the nacelle with the pilot immediately behind. Although a tractor, the tail unit of the type B was supported by booms extending from the trailing edge of the wings, an arrangement more commonly featured on pusher aircraft. Lateral control was accomplished with wing warping. The type B established the basic configuration of Caudron designs through the G.4 model. View more: http://n2t.net/ark:/65665/nv9602e2d17-f34c-48fd-b8b0-862ae88fa95d"
  },
  "forth for modifying the aircraft to accomplish new and even more radical tasks.": {
    "image": "",
    "text": "The X-15 flew faster and higher than any other airplane. A peak altitude of 354,200 feet (67± miles) was reached by the X-15, and the X-15A-2 attained a speed of Mach 6.72 (4,534 mph) while testing a new ablative thermal protection material and a proposed design for a hypersonic ramjet. Various proposals were set forth for modifying the aircraft to accomplish new and even more radical tasks. At one point, NASA scientists planned to test a hydrogen-fueled supersonic combustion ramjet engine mounted on the X-15s lower vertical fin. A mock-up of this proposed installation was flight-tested on the X-15A-2. Other ideas included modifying the X-15 with a slender delta wing and using the aircraft as a booster for small satellite launch vehicles. None of these ideas, however, came to fruition. View more: http://n2t.net/ark:/65665/nv9d2c52e77-2f46-4a14-b2d0-6317b55f63f5"
  },
  "hours was set. The Model DR-980 won the 1931 Collier Trophy.": {
    "image": "",
    "text": "Approved Type Certificate No. 43 was issued by the Department of Commerce on March 3, 1930, and the engine was publicly shown for the first time during the Detroit Aircraft Show in April 1930. Between May 25 through 28, 1931 at Jacksonville, Florida, a world\'s non-refueled duration flight record of 84 1/2 hours was set. The Model DR-980 won the 1931 Collier Trophy. View more: http://n2t.net/ark:/65665/nv958681df4-e865-4ee6-ad42-1b56ae59d621"
  },
  "almost 914 hours, before the airplane crashed in January 1930. It was then": {
    "image": "",
    "text": "This M-2 was flown by Western Air Express, predecessor of Western Airlines, which inaugurated air mail service between Los Angeles and Salt Lake City via Las Vegas in April 1926. It was delivered to the Post Office Department in 1926 as an M-4, which had a longer wing than the M-2 and cost $15,000. It was later reconfigured as an M 2. Western Air Express acquired the airplane in June 1927 and flew it for almost 914 hours, before the airplane crashed in January 1930. It was then resold several times and was reacquired by Western Airlines in 1940 for display. View more: http://n2t.net/ark:/65665/nv92d9aaf5b-0653-4c90-b4f5-42316670d5ac"
  },
  "in Anaheim, California. After Paul Mantz died while filming a flying sequence for": {
    "image": "",
    "text": "Frank Tallman test flew the restored Gulfhawk in 1962 and used it in airshows for many years. Interestingly, the FAA inspector who signed off on a repair in July 1962 was another famous movie pilot, Art Scholl. When not flying, the plane was exhibited in the Tallmantz Movieland of the Air Museum in Anaheim, California. After Paul Mantz died while filming a flying sequence for the movie Flight of the Phoenix, the Gulfhawk was sold to the Rosen-Novak Auto Company of Omaha, Nebraska in 1966. View more: http://n2t.net/ark:/65665/nv9fee9d5d5-76be-41b9-bc2a-9cc1edff02dd"
  },
  "Seven Dauntlesses were shot down or crash-landed. Two Japanese aircraft were claimed shot": {
    "image": "",
    "text": "The initial two models of the Dauntless would see the first combat in the Pacific on 7 December 1941, during the attack on Pearl Harbor. Marine Air Group (MAG) 11 - equipped with the SBD-1 - was caught on the ground and all aircraft were either damaged or destroyed by the Japanese. At the same time, 18 Navy SBD-2s, launched from the Enterprise, which was returning to Hawaii from Wake Island, arrived just as the Japanese were attacking. Seven Dauntlesses were shot down or crash-landed. Two Japanese aircraft were claimed shot down by the Dauntlesses. Three days later the SBD gained the distinction of destroying the first Japanese warship of World War II when Lt Dickinson of VS-6 sank the Imperial Japanese submarine I-70 off of Hawaii. View more: http://n2t.net/ark:/65665/nv9e4e59693-acd8-4170-be24-c7854642b85b"
  },
  "radial, air-cooled engine. The Curtiss-Wright Corporation won a production contract for 210 P-36": {
    "image": "",
    "text": "Design engineer Dr. Donovan R. Berlin layed the foundation for the P-40 in 1935 when he designed the agile, but lightly-armed, P-36 fighter equipped with a radial, air-cooled engine. The Curtiss-Wright Corporation won a production contract for 210 P-36 airplanes in 1937-the largest Army airplane contract awarded since World War I. Worldwide, fighter aircraft designs matured rapidly during the late 1930s and it was soon obvious that the P-36 was no match for newer European designs. High altitude performance in particular became a priceless commodity. Berlin attempted to improve the P-36 by redesigning it in to accommodate a turbo-supercharged Allison V-1710-11 inline, liquid-cooled engine. The new aircraft was designated the XP-37 but proved unpopular with pilots. The turbo-supercharger was not reliable and Berlin had placed the cockpit too far back on the fuselage, restricting the view to the front of the fighter. Nonetheless, when the engine was not giving trouble, the more-streamlined XP-37 was much faster than the P-36. View more: http://n2t.net/ark:/65665/nv9d0a3216e-18d2-4214-a588-b38916eec3ab"
  },
  "of the flight. A monumental logistical accomplishment, it was an important step toward": {
    "image": "",
    "text": "Only the New Orleans and the Chicago completed the arduous 44,085 km (27,553 mi) flight. It took 175 days, with a flying time of 371 hours 11 minutes. Throughout the journey the crews prevailed against an endless series of forced landings, repairs, bad weather, and other mishaps that continually threatened the success of the flight. A monumental logistical accomplishment, it was an important step toward world-wide air transport. View more: http://n2t.net/ark:/65665/nv95c04038d-e0c6-45d0-a5e7-35b3e7645899"
  },
  "but it was hazardous in a crash. The much-touted Liberty engine was also": {
    "image": "",
    "text": "American-built DH-4s had some initial problems. The pilot and observer found themselves separated by the 254-liter (67-gallon) main fuel tank. This dangerous feature not only made communication between the crew members difficult, but it was hazardous in a crash. The much-touted Liberty engine was also at first a cause for concern. The prototype was designed and built in only six weeks. Not surprisingly, they too had technical problems. Once resolved, however, with a maximum speed of 198 kph (124 mph), the Liberty-powered DH-4 was able to match or even surpass the speed of most of the fighters of the time. View more: http://n2t.net/ark:/65665/nv960e3bb80-cabf-451d-be78-2818d81f59e5"
  }
}


# Run the update function
update_kwic_data_with_images(kwicData)


print("Updated kwicData:")
for key, value in kwicData.items():
    print(f"Entry: {key}")
    print(f"Image Path: {value['image']}")
    print(f"Text: {value['text']}\n")




import json

# Directory to save images
image_dir = 'Data/Images'

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

# Update kwicData with scraped images
def update_kwic_data_with_images(kwic_data):
    for key, value in kwic_data.items():
        if 'View more:' in value['text']:
            page_url = value['text'].split('View more: ')[-1]
            image_url = scrape_image_url(page_url)
            if image_url:
                image_file_name = os.path.join(image_dir, f"{key[:50].replace(' ', '_').replace('/', '_')}.jpg")
                download_image(image_url, image_file_name)
                kwic_data[key]['image'] = image_file_name

    print("All images downloaded and kwicData updated!")
    return kwic_data

# Write updated kwicData to kwicData.js as a JavaScript file
def write_kwicdata_to_js(kwic_data):
    # Prepare the content for the JavaScript file
    js_content = f"const kwicData = {json.dumps(kwic_data, indent=2)};\n\nexport default kwicData;"

    # Write the content to kwicData.js
    with open('kwicData.js', 'w') as js_file:
        js_file.write(js_content)

    print("kwicData.js file created successfully!")

# Run the update function and write the new file
updated_kwicData = update_kwic_data_with_images(kwicData)
write_kwicdata_to_js(updated_kwicData)



