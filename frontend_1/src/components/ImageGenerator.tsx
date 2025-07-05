// src/components/ImageGenerator.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl('');

    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/gemini/generate-image`, { prompt });
      setImageUrl(response.data.imageUrl);
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err.response?.data?.error || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #333', borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">Generate LinkedIn Image</Typography>
      <TextField
        label="Image Prompt"
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        margin="normal"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateImage}
        disabled={loading || !prompt}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Image'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {imageUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>Generated Image:</Typography>
          <img src={imageUrl} alt="Generated from prompt" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigator.clipboard.writeText(imageUrl)}
            sx={{ mt: 2 }}
          >
            Copy Image URL
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ImageGenerator;