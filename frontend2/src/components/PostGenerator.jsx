import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const PostGenerator = () => {
  // Post Generation State
  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [generatedRole, setGeneratedRole] = useState("");
  const [generatedTopic, setGeneratedTopic] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState("post");

  // Post Generation Functions
  const handleGeneratePost = async () => {
    if (!selectedRole || !selectedTopic) {
      setError("Please select both a professional role and topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setPostContent("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/gemini/generate-text`,
        {
          professionalRole: selectedRole,
          topic: selectedTopic,
        }
      );
      setPostContent(data.text);
      setGeneratedRole(data.professionalRole);
      setGeneratedTopic(data.topic);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate post.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text");
    }
  };

  // Image Generation Functions
  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      setImageError("Please enter a prompt.");
      return;
    }
    setImageLoading(true);
    setImageError(null);
    setImageUrl("");
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/gemini/generate-image`,
        { prompt: imagePrompt }
      );
      setImageUrl(data.imageUrl);
    } catch (err) {
      setImageError(err.response?.data?.error || "Failed to generate image.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleCopyImageUrl = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
    } catch (err) {
      console.error("Failed to copy image URL");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Content Generator Suite
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Create engaging LinkedIn posts and stunning AI-generated images for
            your professional network
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 bg-gray-900/50 p-2 rounded-2xl backdrop-blur-sm border border-gray-800">
          <button
            onClick={() => setActiveTab("post")}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === "post"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Post Generator</span>
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === "image"
                ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Image Generator</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="group relative mb-8">
          <div
            className={`absolute -inset-1 ${
              activeTab === "post"
                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                : "bg-gradient-to-r from-cyan-600 to-purple-600"
            } rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}
          ></div>

          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-800">
            {/* Post Generator Tab */}
            {activeTab === "post" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Generate LinkedIn Post
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Create engaging LinkedIn content instantly
                    </p>
                  </div>
                </div>

                {/* Input Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                      Professional Role
                    </label>
                    <input
                      type="text"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      placeholder="e.g., MBA Graduate, Software Engineer..."
                      className="w-full p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      placeholder="e.g., Business Analytics, Technology Trends..."
                      className="w-full p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGeneratePost}
                  disabled={loading || !selectedRole || !selectedTopic}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Generate New Post</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-900/50 border border-red-800 rounded-xl flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-300 text-sm sm:text-base">{error}</p>
                  </div>
                )}

                {/* Generated Content */}
                {postContent && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                      <span className="px-3 py-1 bg-purple-900/50 rounded-full">
                        Role: {generatedRole}
                      </span>
                      <span className="px-3 py-1 bg-pink-900/50 rounded-full">
                        Topic: {generatedTopic}
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        readOnly
                        rows={window.innerWidth < 640 ? 12 : 10}
                        value={postContent}
                        className="w-full p-4 sm:p-5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm sm:text-base leading-relaxed"
                      />
                      <button
                        onClick={handleCopy}
                        className={`absolute top-3 right-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                          copySuccess
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        {copySuccess ? (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Copy Success Message */}
                    {copySuccess && (
                      <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Copied to clipboard!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Image Generator Tab */}
            {activeTab === "image" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Generate AI Image
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Transform your ideas into stunning visuals
                    </p>
                  </div>
                </div>

                {/* Input section */}
                <div className="relative">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
                    <span className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span>Describe Your Vision</span>
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Enter your creative prompt here... (e.g., 'A futuristic cityscape at sunset with flying cars and neon lights')"
                      rows={4}
                      className="w-full p-4 sm:p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {imagePrompt.length}/500
                    </div>
                  </div>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerateImage}
                  disabled={imageLoading || !imagePrompt.trim()}
                  className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 hover:from-cyan-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 text-sm sm:text-base"
                >
                  {imageLoading ? (
                    <>
                      <div className="relative">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      <span>Creating Magic...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Generate Image</span>
                    </>
                  )}
                </button>

                {/* Error message */}
                {imageError && (
                  <div className="p-4 sm:p-5 bg-red-900/30 border border-red-800/50 rounded-2xl flex items-start space-x-3 animate-fade-in">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-red-300 text-sm sm:text-base font-medium">
                        Error
                      </p>
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {imageError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Generated image */}
                {imageUrl && (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Generated Image</span>
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCopyImageUrl}
                          className="p-2 sm:p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-200 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50"
                          title="Copy image URL"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <a
                          href={imageUrl}
                          download="generated-image.png"
                          className="p-2 sm:p-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-xl transition-all duration-200 backdrop-blur-sm"
                          title="Download image"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl bg-gray-800/30 border border-gray-700/50 group/image">
                      <img
                        src={imageUrl}
                        alt="Generated"
                        className="w-full h-auto transition-transform duration-700 group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-400 text-xs sm:text-sm">
                        💡 Tip: Right-click to save or share your generated
                        image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800">
          <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">
            {activeTab === "post"
              ? "💡 Tips for Great LinkedIn Posts"
              : "🎨 Tips for AI Image Generation"}
          </h4>

          {activeTab === "post" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Use engaging hooks to grab attention
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Include relevant hashtags for reach
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Ask questions to encourage engagement
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Share personal insights and experiences
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Keep it concise and scannable
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Post consistently for best results
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Be specific and detailed in descriptions
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Include lighting and composition details
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Specify art style and medium preferences
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Use negative prompts to avoid unwanted elements
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Experiment with different aspect ratios
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">
                  Iterate and refine based on results
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;
