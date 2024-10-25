// App.js
import React, { useState } from 'react';
import axios from 'axios';

const PDFExtractor = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }
  
    setError(null);
    const formData = new FormData();
    formData.append('pdf', file);
  
    try {
      const response = await axios.post('https://shady-spooky-corpse-7jrxx7jrgv3wxj4-5000.app.github.dev/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setItems(response.data.items);
    } catch (err) {
      console.error("Error uploading the file:", err);
      setError('Error uploading the file.');
    }
  };

  return (
    <div>
      <h1>PDF Item Number Extractor</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload and Extract</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {items.length > 0 && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>{item.item}</strong> - {item.title} <br />
              <a href={`https://www.4sgm.com/lsearch.jhtm?cid=&keywords=${item.item}`} target="_blank" rel="noopener noreferrer">Product Link</a>{' '}
              | <a href={item.google_link} target="_blank" rel="noopener noreferrer">Google Search Link</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PDFExtractor;
