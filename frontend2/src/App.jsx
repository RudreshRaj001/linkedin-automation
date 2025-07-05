import React, { useState } from "react";
import Header from './components/Header';
import PostGenerator from './components/PostGenerator';
import ImageGenerator from './components/ImageGenerator';
import LinkedInImageUploader from './components/LinkedInImageUploader';
import GetUserDataComponent from './components/GetUserDataComponent';
import CreatePostComponent from './components/CreatePostComponent';
import LinkedInImagePost from './components/LinkedInImagePost';

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "posts":
        return <PostGenerator />;
      case "images":
        return <ImageGenerator />;
      case "upload":
        return <LinkedInImageUploader />;
      case "post":
        return <CreatePostComponent />;
      case "user":
        return <GetUserDataComponent />;
      case "imagePost":
        return <LinkedInImagePost />;
      default:
        return <PostGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {renderPage()}

        <footer className="mt-16 py-8 text-center border-t border-gray-800">
          <p className="text-gray-400">
            © {new Date().getFullYear()} LinkedIn Automation. All rights
            reserved.
          </p>
        </footer>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
