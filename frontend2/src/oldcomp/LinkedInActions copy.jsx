// src/components/LinkedInActions.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

const LinkedInActions = () => {
  const [postText, setPostText] = useState('');
  const [postingLoading, setPostingLoading] = useState(false);
  const [postingError, setPostingError] = useState(null);
  const [postingSuccess, setPostingSuccess] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfoError, setUserInfoError] = useState(null);

  const handlePostToLinkedIn = async () => {
    if (!postText) {
      setPostingError('Post text cannot be empty.');
      return;
    }
    setPostingLoading(true);
    setPostingError(null);
    setPostingSuccess(false);
    try {
      await axios.post(`${API_BASE_URL}/api/linkedin/post`, { postText });
      setPostingSuccess(true);
      setPostText('');
    } catch (err) {
      setPostingError(err.response?.data?.error || 'Failed to post.');
    } finally {
      setPostingLoading(false);
    }
  };

  const handleGetUserInfo = async () => {
    setUserInfoLoading(true);
    setUserInfoError(null);
    setUserInfo(null);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/linkedin/userinfo`);
      setUserInfo(data);
    } catch (err) {
      setUserInfoError(err.response?.data?.error || 'Failed to fetch user info.');
    } finally {
      setUserInfoLoading(false);
    }
  };

  return (
    <section className="linkedin-actions" style={{ padding: '1rem', border: '1px solid #333', borderRadius: 8 }}>
      <h3>LinkedIn Actions</h3>

      {/* Publish a Post */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>Publish a Post</h4>
        <textarea
          rows={5}
          value={postText}
          onChange={e => setPostText(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button onClick={handlePostToLinkedIn} disabled={postingLoading}>
          {postingLoading ? 'Posting…' : 'Post to LinkedIn'}
        </button>
        {postingSuccess && <p className="success">Post successfully published!</p>}
        {postingError && <p className="error">{postingError}</p>}
      </div>

      {/* Fetch User Info */}
      <div>
        <h4>Get My LinkedIn Profile Info</h4>
        <button onClick={handleGetUserInfo} disabled={userInfoLoading}>
          {userInfoLoading ? 'Fetching…' : 'Fetch User Info'}
        </button>
        {userInfoError && <p className="error">{userInfoError}</p>}
        {userInfo && (
          <pre style={{ background: '#222', color: '#eee', padding: '1rem', borderRadius: 4, marginTop: '0.5rem' }}>
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
};

export default LinkedInActions;
