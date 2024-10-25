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
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    setError(null); // Clear any previous errors
    setItemNumbers([]); // Reset previous results

    if (!file) {
      setError("Please upload a PDF file.");
      setIsLoading(false); // Stop loading
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('https://shady-spooky-corpse-7jrxx7jrgv3wxj4-5000.app.github.dev/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Check if items were received and set state accordingly
      if (response.data.items && response.data.items.length > 0) {
        setItemNumbers(response.data.items);
        setIsSubmitted(true);
      } else {
        setError("No item numbers found in the PDF.");
      }
    } catch (err) {
      setError('Error uploading the file.');
    } finally {
      setIsLoading(false); // Stop loading after request completion
    }
  };

  return (
    <div>
      <h1>🔍 PDF Item Number Extractor and 🛠️ Links Generator</h1>
      
      {!isSubmitted && (
        <form onSubmit={handleSubmit}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit">Upload and Extract</button>
        </form>
      )}
      
      {isLoading && <p>Loading... Please wait while we process your file.</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display results if submitted and item numbers are available */}
      {isSubmitted && itemNumbers.length > 0 && (
        <div>
          <h2>Extracted Item Numbers and Google Links:</h2>
          <ul>
            {itemNumbers.map(({ item, title, google_link }, index) => (
              <li key={index}>
                {item} - <a href={google_link} target="_blank" rel="noopener noreferrer">{title}</a>
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
