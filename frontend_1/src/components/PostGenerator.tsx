// src/components/PostGenerator.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

const PostGenerator: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedRole, setGeneratedRole] = useState<string>('');
  const [generatedTopic, setGeneratedTopic] = useState<string>('');

  const handleGeneratePost = async () => {
    setLoading(true);
    setError(null);
    setPostContent('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/gemini/generate-text`, {}); // No prompt needed as per backend change
      setPostContent(response.data.text);
      setGeneratedRole(response.data.professionalRole);
      setGeneratedTopic(response.data.topic);
    } catch (err: any) {
      console.error('Error generating post:', err);
      setError(err.response?.data?.error || 'Failed to generate post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #333', borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">Generate LinkedIn Post</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGeneratePost}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate New Post'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {postContent && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            **Generated Post (Role: {generatedRole}, Topic: {generatedTopic}):**
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={postContent}
            InputProps={{ readOnly: true }}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigator.clipboard.writeText(postContent)}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostGenerator;