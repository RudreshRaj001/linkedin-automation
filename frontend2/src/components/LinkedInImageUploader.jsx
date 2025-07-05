import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

const LinkedInImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !accessToken || !authorId) {
      setError('Please fill in all required fields and select an image.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Register upload with LinkedIn
      const registerResponse = await fetch(`${API_BASE_URL}/api/linkedin/register-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type
        })
      });

      if (!registerResponse.ok) {
        throw new Error('Failed to register upload');
      }

      const { uploadUrl, asset } = await registerResponse.json();

      // Step 2: Upload binary data
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type
        },
        body: selectedFile
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      // Step 3: Create LinkedIn post with image
      const postResponse = await fetch(`${API_BASE_URL}/api/linkedin/create-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: authorId,
          text: caption || 'Shared via LinkedIn API',
          media: [{
            status: 'READY',
            media: asset
          }]
        })
      });

      if (!postResponse.ok) {
        throw new Error('Failed to create LinkedIn post');
      }

      setSuccess('Image uploaded and posted to LinkedIn successfully!');
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setCaption('');
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image to LinkedIn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
            LinkedIn Image Uploader
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Upload and share your images directly to LinkedIn with custom captions
          </p>
        </div>

        {/* Main Content */}
        <div className="group relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Main card */}
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-800/50">
            {/* Configuration section */}
            <div className="space-y-6 sm:space-y-8">
              {/* Access Token */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span>Access Token *</span>
                    </span>
                  </label>
                  <input
                    type="password"
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="Enter your LinkedIn access token"
                    className="w-full p-4 sm:p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  />
                </div>

                {/* Author ID */}
                <div className="relative">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Author ID *</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={authorId}
                    onChange={e => setAuthorId(e.target.value)}
                    placeholder="urn:li:person:YOUR_ID"
                    className="w-full p-4 sm:p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="relative">
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Select Image *</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-gray-600 border-dashed rounded-2xl cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
                  >
                    {selectedFile ? (
                      <div className="flex items-center space-x-3 text-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm sm:text-base font-medium">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm sm:text-base text-gray-400">Click to select an image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div className="relative">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Preview</span>
                    </span>
                  </label>
                  <div className="relative overflow-hidden rounded-2xl bg-gray-800/30 border border-gray-700/50 max-w-md mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto" 
                    />
                  </div>
                </div>
              )}

              {/* Caption */}
              <div className="relative">
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Caption (Optional)</span>
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Write a caption for your LinkedIn post..."
                    rows={3}
                    className="w-full p-4 sm:p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {caption.length}/1300
                  </div>
                </div>
              </div>

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile || !accessToken || !authorId}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-700 hover:via-cyan-700 hover:to-indigo-700 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="relative">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span>Uploading to LinkedIn...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Upload to LinkedIn</span>
                  </>
                )}
              </button>

              {/* Error message */}
              {error && (
                <div className="p-4 sm:p-5 bg-red-900/30 border border-red-800/50 rounded-2xl flex items-start space-x-3 animate-fade-in">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-red-300 text-sm sm:text-base font-medium">Error</p>
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="p-4 sm:p-5 bg-green-900/30 border border-green-800/50 rounded-2xl flex items-start space-x-3 animate-fade-in">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-green-300 text-sm sm:text-base font-medium">Success</p>
                    <p className="text-green-400 text-xs sm:text-sm mt-1">{success}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Setup Instructions</span>
          </h3>
          <div className="space-y-3 text-gray-300 text-sm sm:text-base">
            <p><strong className="text-blue-400">1. Access Token:</strong> Get your LinkedIn access token from the LinkedIn Developer Console</p>
            <p><strong className="text-cyan-400">2. Author ID:</strong> Your LinkedIn person URN (format: urn:li:person:YOUR_ID)</p>
            <p><strong className="text-indigo-400">3. Permissions:</strong> Ensure your app has w_member_social permissions</p>
            <p><strong className="text-purple-400">4. Backend:</strong> Make sure your backend handles the LinkedIn API endpoints</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-500 text-xs sm:text-sm">
            Powered by LinkedIn API • Share your moments • Connect with professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImageUploader;
