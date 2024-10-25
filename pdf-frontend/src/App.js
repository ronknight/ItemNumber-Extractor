import React, { useState } from 'react';
import axios from 'axios';

const PDFExtractor = () => {
  const [file, setFile] = useState(null);
  const [itemNumbers, setItemNumbers] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a PDF file before proceeding.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('https://fearsome-tomb-6xrppvx4x7f57ww-5000.app.github.dev/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
      setItemNumbers(response.data.itemNumbers);
      setIsSubmitted(true);
    } catch (err) {
      setError('Error processing the PDF.');
    }
  };

  // Render the upload form initially
  if (!isSubmitted) {
    return (
      <div>
        <h1>PDF Item Number Extractor</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit">Upload and Extract</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // Render the item numbers after successful submission
  return (
    <div>
      <h1>Extracted Item Numbers with hyperlink</h1>
      {itemNumbers.length > 0 ? (
        <ul>
          {itemNumbers.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No item numbers found in the PDF.</p>
      )}
      <button onClick={() => setIsSubmitted(false)}>Upload Another PDF</button>
    </div>
  );
};

export default PDFExtractor;
