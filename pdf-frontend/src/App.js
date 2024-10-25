import React, { useState } from 'react';
import axios from 'axios';

const PDFExtractor = () => {
  const [file, setFile] = useState(null);
  const [itemNumbers, setItemNumbers] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsSubmitted(false); // Reset previous submission
    setItemNumbers([]); // Clear previous items
    setError(null); // Clear any previous errors
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      // Ensure the request goes to the correct backend endpoint
      const response = await axios.post(
        'https://shady-spooky-corpse-7jrxx7jrgv3wxj4-5000.app.github.dev/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Validate response and handle no items found case
      if (response.data.items && response.data.items.length > 0) {
        setItemNumbers(response.data.items);
        setIsSubmitted(true);
      } else {
        setError("No item numbers found in the PDF.");
      }
    } catch (err) {
      setError("Error uploading the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>🔍 PDF Item Number Extractor and 🛠️ Links Generator</h1>
      
      {/* Show form only if no previous submission */}
      {!isSubmitted && (
        <form onSubmit={handleSubmit}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit">Upload and Extract</button>
        </form>
      )}
      
      {/* Loading message */}
      {isLoading && <p>Loading... Please wait while we process your file.</p>}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display results if available */}
      {isSubmitted && itemNumbers.length > 0 && (
        <div>
          <h2>Extracted Item Numbers and Links</h2>
          <ul>
            {itemNumbers.map(({ item, title, google_link }, index) => (
              <li key={index}>
                <strong>{item}</strong>: <a href={google_link} target="_blank" rel="noopener noreferrer">{title}</a>
              </li>
            ))}
          </ul>
          <button onClick={() => setIsSubmitted(false)}>Upload Another PDF</button>
        </div>
      )}
    </div>
  );
};

export default PDFExtractor;
