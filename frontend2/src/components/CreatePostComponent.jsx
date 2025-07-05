// src/components/CreatePostComponent.jsx
import React, { useState } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const CreatePostComponent = () => {
  const [postText, setPostText] = useState("");
  const [postingLoading, setPostingLoading] = useState(false);
  const [postingError, setPostingError] = useState(null);
  const [postingSuccess, setPostingSuccess] = useState(false);

  const handlePostToLinkedIn = async () => {
    if (!postText) {
      setPostingError("Post text cannot be empty.");
      return;
    }
    setPostingLoading(true);
    setPostingError(null);
    setPostingSuccess(false);
    try {
      await axios.post(`${API_BASE_URL}/api/linkedin/post`, { postText });
      setPostingSuccess(true);
      setPostText("");
    } catch (err) {
      setPostingError(err.response?.data?.error || "Failed to post.");
    } finally {
      setPostingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Create LinkedIn Post
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Share your professional insights and engage with your network
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800/50">
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Create Post</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Share your insights with your network
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <textarea
                  rows={8}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="What's on your professional mind? Share your insights, achievements, or industry thoughts..."
                  className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 text-sm sm:text-base"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
                  {postText.length}/1300
                </div>
              </div>

              <button
                onClick={handlePostToLinkedIn}
                disabled={postingLoading || !postText.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {postingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Publish to LinkedIn</span>
                  </>
                )}
              </button>

              {postingSuccess && (
                <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-xl flex items-center space-x-2 animate-fade-in backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm sm:text-base">
                    Post published successfully! 🎉
                  </p>
                </div>
              )}

              {postingError && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm sm:text-base">{postingError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Boost your professional presence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostComponent;
