// src/components/ImageGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setLoading(true);
    setError(null);
    setImageUrl('');
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/gemini/generate-image`, { prompt });
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="image-generator" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #333', borderRadius: 8 }}>
      <h3>Generate LinkedIn Image</h3>

      <label>
        Image Prompt
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
        />
      </label>

      <button onClick={handleGenerateImage} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Image'}
      </button>

      {error && <p className="error" style={{ color: 'tomato' }}>{error}</p>}

      {imageUrl && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', borderRadius: 8 }} />
          <div>
            <button onClick={() => navigator.clipboard.writeText(imageUrl)} style={{ marginTop: '0.5rem' }}>
              Copy Image URL
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGenerator;
