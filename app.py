import pdfplumber
import re

def extract_item_numbers_positional(pdf_path):
    item_numbers = []
    # Define the regex pattern for item numbers: 5-6 digits or 6 digits with an optional letter
    item_pattern = re.compile(r'\b\d{5,6}[A-Z]?\b')

    # Open the PDF file with pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            # Extract words with positional data
            words = page.extract_words()
            
            for word in words:
                # Get the actual text content
                text = word['text']
                # Check if the word matches the item number pattern
                if item_pattern.match(text):
                    item_numbers.append(text)

    # Return the item numbers in the order they were found
    return item_numbers

# Specify the path to your PDF file
pdf_path = 'New-Arrival-No-Name-Sorted BY Location-2024-10-24-19-07-13.pdf'
item_numbers = extract_item_numbers_positional(pdf_path)

# Print the extracted item numbers in the order they were found
print("Extracted Item Numbers (In Order):")
for item_number in item_numbers:
    print(item_number)
