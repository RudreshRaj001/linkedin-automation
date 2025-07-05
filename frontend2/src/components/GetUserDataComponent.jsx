// src/components/GetUserDataComponent.jsx
import React, { useState } from "react";
import {
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  Mail,
  Shield,
  UserCircle,
  Languages,
  Image,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const GetUserDataComponent = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfoError, setUserInfoError] = useState(null);

  const handleGetUserInfo = async () => {
    setUserInfoLoading(true);
    setUserInfoError(null);
    setUserInfo(null);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/linkedin/userinfo`);
      setUserInfo(data);
    } catch (err) {
      setUserInfoError(
        err.response?.data?.error || "Failed to fetch user info."
      );
    } finally {
      setUserInfoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LinkedIn Profile Data
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            View and manage your LinkedIn profile information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800/50">
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Profile Data</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  View your LinkedIn profile information
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={handleGetUserInfo}
                disabled={userInfoLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {userInfoLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Fetching profile...</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Get Profile Data</span>
                  </>
                )}
              </button>

              {userInfoError && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm sm:text-base">{userInfoError}</p>
                </div>
              )}

              {userInfo && (
                <div className="p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl animate-fade-in backdrop-blur-sm">
                  <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        {userInfo.picture ? (
                          <img
                            src={userInfo.picture}
                            alt={userInfo.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-500/50 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white font-semibold text-base sm:text-lg">
                          {userInfo.name}
                        </h5>
                        <p className="text-gray-400 text-sm">
                          {userInfo.given_name} {userInfo.family_name}
                        </p>
                      </div>
                    </div>
                    
                    {/* Profile Details Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {/* Email */}
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">Email</span>
                        </div>
                        <p className="text-white font-medium text-sm break-all">
                          {userInfo.email}
                        </p>
                      </div>

                      {/* User ID */}
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <UserCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">User ID</span>
                        </div>
                        <p className="text-white font-medium text-sm font-mono">
                          {userInfo.sub}
                        </p>
                      </div>

                      {/* Locale */}
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Languages className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">Locale</span>
                        </div>
                        <p className="text-white font-medium text-sm">
                          {userInfo.locale?.language?.toUpperCase() || 'N/A'} - {userInfo.locale?.country || 'N/A'}
                        </p>
                      </div>

                      {/* Email Verification */}
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">Email Verification</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {userInfo.email_verified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm font-medium">Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm font-medium">Not Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Picture Link */}
                    {userInfo.picture && (
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Image className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">Profile Picture</span>
                        </div>
                        <a
                          href={userInfo.picture}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline break-all transition-colors"
                        >
                          View Full Size
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Manage your professional presence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetUserDataComponent;
