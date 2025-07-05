// src/components/LinkedInActions.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

const LinkedInActions: React.FC = () => {
  const [postText, setPostText] = useState<string>('');
  const [postingLoading, setPostingLoading] = useState<boolean>(false);
  const [postingError, setPostingError] = useState<string | null>(null);
  const [postingSuccess, setPostingSuccess] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<any>(null);
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);

  const handlePostToLinkedIn = async () => {
    setPostingLoading(true);
    setPostingError(null);
    setPostingSuccess(false);

    if (!postText) {
      setPostingError('Post text cannot be empty.');
      setPostingLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/linkedin/post`, { postText });
      setPostingSuccess(true);
      setPostText(''); // Clear the text field on success
    } catch (err: any) {
      console.error('Error posting to LinkedIn:', err);
      setPostingError(err.response?.data?.error || 'Failed to post to LinkedIn. Please check your credentials and try again.');
    } finally {
      setPostingLoading(false);
    }
  };

  const handleGetUserInfo = async () => {
    setUserInfoLoading(true);
    setUserInfoError(null);
    setUserInfo(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/linkedin/userinfo`);
      setUserInfo(response.data);
    } catch (err: any) {
      console.error('Error fetching user info:', err);
      setUserInfoError(err.response?.data?.error || 'Failed to fetch user info. Please ensure your LinkedIn Access Token is valid.');
    } finally {
      setUserInfoLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #333', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom color="primary">LinkedIn Actions</Typography>

      {/* Post to LinkedIn Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="secondary">Publish a Post</Typography>
        <TextField
          label="LinkedIn Post Content"
          fullWidth
          multiline
          rows={6}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          variant="outlined"
          margin="normal"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePostToLinkedIn}
          disabled={postingLoading || !postText}
        >
          {postingLoading ? <CircularProgress size={24} /> : 'Post to LinkedIn'}
        </Button>
        {postingSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Post successfully published to LinkedIn!
          </Alert>
        )}
        {postingError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {postingError}
          </Alert>
        )}
      </Box>

      {/* Get User Info Section */}
      <Box>
        <Typography variant="h6" gutterBottom color="secondary">Get My LinkedIn Profile Info</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGetUserInfo}
          disabled={userInfoLoading}
        >
          {userInfoLoading ? <CircularProgress size={24} /> : 'Fetch User Info'}
        </Button>
        {userInfoError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {userInfoError}
          </Alert>
        )}
        {userInfo && (
          <Box sx={{ mt: 2, p: 2, border: '1px dashed #505050', borderRadius: 1, bgcolor: '#2a2a2a' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {JSON.stringify(userInfo, null, 2)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LinkedInActions;