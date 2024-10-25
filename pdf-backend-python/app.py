# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import os
import re
import subprocess
import logging

logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    logging.info("Received file upload request.")
    if 'pdf' not in request.files:
        logging.error("No PDF file found in the request.")
        return jsonify({'error': 'No PDF uploaded'}), 400

    file = request.files['pdf']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        item_numbers = extract_item_numbers(file_path)
        logging.info(f"Extracted item numbers: {item_numbers}")
        os.remove(file_path)

        items_with_links = []
        for item in item_numbers:
            title = fetch_product_title(item)
            google_link = f"https://www.google.com/search?q=wholesale%20{title}"
            items_with_links.append({'item': item, 'title': title, 'google_link': google_link})

        logging.info(f"Returning items with links: {items_with_links}")
        return jsonify({'items': items_with_links})
    except Exception as e:
        logging.error(f"Error processing the PDF: {e}")
        return jsonify({'error': str(e)}), 500

def extract_item_numbers(pdf_path):
    item_numbers = []
    pattern = r'\b\d{5,6}[A-Z]?\b'  # Regex for item numbers (5-6 digits with optional letter)

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                words = page.extract_words()
                for word in words:
                    if re.match(pattern, word['text']):
                        item_numbers.append(word['text'])
    except Exception as e:
        logging.error(f"Error extracting item numbers from PDF: {e}")
        raise e

    return item_numbers

def fetch_product_title(item):
    try:
        # Call the Node.js script to get the product title
        result = subprocess.run(["node", "fetchTitle.js", item], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            logging.error(f"Error in Node.js script for item {item}: {result.stderr}")
            return f"Error fetching title for {item}"
    except Exception as e:
        logging.error(f"Error calling Node.js script: {e}")
        return f"Error fetching title for {item}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
