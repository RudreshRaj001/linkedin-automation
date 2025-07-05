// src/components/PostGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

const PostGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [error, setError] = useState(null);
  const [generatedRole, setGeneratedRole] = useState('');
  const [generatedTopic, setGeneratedTopic] = useState('');

  const handleGeneratePost = async () => {
    setLoading(true);
    setError(null);
    setPostContent('');
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/gemini/generate-text`, {});
      setPostContent(data.text);
      setGeneratedRole(data.professionalRole);
      setGeneratedTopic(data.topic);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="post-generator" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #333', borderRadius: 8 }}>
      <h3>Generate LinkedIn Post</h3>
      <button onClick={handleGeneratePost} disabled={loading}>
        {loading ? 'Generating…' : 'Generate New Post'}
      </button>

      {error && <p className="error" style={{ color: 'tomato' }}>{error}</p>}

      {postContent && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Generated Post (Role: {generatedRole}, Topic: {generatedTopic})</strong></p>
          <textarea
            readOnly
            rows={8}
            value={postContent}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <button onClick={() => navigator.clipboard.writeText(postContent)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </section>
  );
};

export default PostGenerator;
