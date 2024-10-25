from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import os
import re  # <- Add this line to import the 're' module

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Directory to temporarily store uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Define the route for uploading PDFs
@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF uploaded'}), 400

    file = request.files['pdf']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Extract item numbers from the PDF
        item_numbers = extract_item_numbers(file_path)
        os.remove(file_path)  # Remove the uploaded file after processing
        return jsonify({'itemNumbers': item_numbers})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Function to extract item numbers using pdfplumber
def extract_item_numbers(pdf_path):
    item_numbers = []
    pattern = r'\b\d{5,6}[A-Z]?\b'  # Regex pattern for 5-6 digit numbers with optional letter

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                words = page.extract_words()
                for word in words:
                    if re.match(pattern, word['text']):
                        item_numbers.append(word['text'])
    except Exception as e:
        print(f"Error processing the PDF: {e}")  # Print the error message
        raise e

    return item_numbers

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

