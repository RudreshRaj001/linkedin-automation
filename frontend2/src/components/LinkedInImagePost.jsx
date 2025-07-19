import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Send,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  FileImage,
  Trash2,
  User,
  Mail,
  Shield,
  UserCircle,
  Languages,
} from "lucide-react";

// API helper functions
const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
};

const apiGet = async (url) => {
  return { data: await apiRequest(url, { method: 'GET' }) };
};

const apiPost = async (url, data) => {
  const options = {
    method: 'POST',
  };
  
  if (data instanceof FormData) {
    options.body = data;
    // Don't set Content-Type for FormData - let browser set it with boundary
  } else {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(data);
  }
  
  return { data: await apiRequest(url, options) };
};

const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:3001" 
    : "https://your-api-domain.com";

const LinkedInImagePost = () => {
  // Post state
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  // User data state
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [userInfoError, setUserInfoError] = useState(null);

  // Post operation state
  const [postingToLinkedIn, setPostingToLinkedIn] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [postingError, setPostingError] = useState(null);
  const [postingSuccess, setPostingSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await apiGet(`${API_BASE_URL}/api/linkedin/userinfo`);
        setUserInfo(data);
      } catch (err) {
        setUserInfoError(err.message || "Failed to fetch user info.");
      } finally {
        setUserInfoLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 100MB for LinkedIn)
      if (file.size > 100 * 1024 * 1024) {
        setUploadError("Image size must be less than 100MB");
        return;
      }

      setSelectedImage(file);
      setUploadError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageTitle("");
    setImageDescription("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePostWithImage = async () => {
    if (!postText.trim() && !selectedImage) {
      setPostingError("Please add some text or select an image to post.");
      return;
    }

    setPostingToLinkedIn(true);
    setPostingError(null);
    setPostingSuccess(false);

    try {
      const formData = new FormData();
      formData.append("postText", postText);

      if (selectedImage) {
        formData.append("image", selectedImage);
        formData.append("imageTitle", imageTitle);
        formData.append("imageDescription", imageDescription);
      }

      await apiPost(`${API_BASE_URL}/api/linkedin/post-with-image`, formData);

      setPostingSuccess(true);
      setPostText("");
      handleRemoveImage();
    } catch (err) {
      setPostingError(err.message || "Failed to post to LinkedIn.");
    } finally {
      setPostingToLinkedIn(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Image className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LinkedIn Image Publisher
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Share your visual stories with professional images and engaging content
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Profile Card */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-800/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Profile</h3>
            </div>

            {userInfoLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span className="ml-2 text-gray-400">Loading profile...</span>
              </div>
            ) : userInfoError ? (
              <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{userInfoError}</p>
              </div>
            ) : userInfo ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {userInfo.picture ? (
                    <img
                      src={userInfo.picture}
                      alt={userInfo.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">{userInfo.name}</h4>
                  <p className="text-gray-400 text-sm"><b>Email: </b>{userInfo.email}</p>
                  <p className="text-gray-400 text-sm"><b>Id: </b>{userInfo.sub}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {userInfo.email_verified && (
                    <div className="flex items-center space-x-1 bg-green-900/30 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">Verified</span>
                    </div>
                  )}
                  <div className="bg-gray-800/50 px-2 py-1 rounded-full">
                    <span className="text-gray-400 text-xs">
                      {userInfo.locale?.language?.toUpperCase() || "EN"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Post Creation Card */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800/50">
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileImage className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Create Image Post
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Share your professional moments with images
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Post Text */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="What's the story behind your image? Share your thoughts and insights..."
                  className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
                  {postText.length}/1300
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold text-sm sm:text-base">
                    Add Image
                  </h4>
                  {selectedImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {!selectedImage ? (
                  <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-gray-800/30 transition-all duration-200"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 font-medium mb-2">
                      Click to upload an image
                    </p>
                    <p className="text-gray-500 text-sm">
                      Supports JPEG, PNG, GIF up to 100MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative bg-gray-800/50 rounded-xl p-4">
                      <img
                        src={imagePreview}
                        alt="Selected"
                        className="w-full max-h-64 object-contain rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={handleRemoveImage}
                          className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Image Title
                        </label>
                        <input
                          type="text"
                          value={imageTitle}
                          onChange={(e) => setImageTitle(e.target.value)}
                          placeholder="Enter image title"
                          className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Image Description
                        </label>
                        <input
                          type="text"
                          value={imageDescription}
                          onChange={(e) => setImageDescription(e.target.value)}
                          placeholder="Describe your image"
                          className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Upload Error */}
              {uploadError && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{uploadError}</p>
                </div>
              )}

              {/* Publish Button */}
              <button
                onClick={handlePostWithImage}
                disabled={
                  postingToLinkedIn || (!postText.trim() && !selectedImage) || !userInfo
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {postingToLinkedIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing to LinkedIn...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>
                      {selectedImage ? "Publish with Image" : "Publish Post"}
                    </span>
                  </>
                )}
              </button>

              {/* Success Message */}
              {postingSuccess && (
                <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-xl flex items-center space-x-2 animate-fade-in backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm">
                    Post published successfully to LinkedIn! 🎉
                  </p>
                </div>
              )}

              {/* Posting Error */}
              {postingError && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{postingError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            <span>Share your visual professional story</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImagePost;
