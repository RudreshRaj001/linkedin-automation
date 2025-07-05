import React, { useState } from 'react';

// Header Component with Enhanced Design
const Header = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
 const navItems = [
  { id: 'posts',      label: 'Post Generator',             icon: '✍️'  },
  { id: 'images',     label: 'Image Generator',            icon: '🖼️' },
  { id: 'post',       label: 'Create Post',                icon: '💬'  },
  { id: 'upload',     label: 'Image Upload',               icon: '📤' },
  { id: 'imagePost',  label: 'Create Post With Image',     icon: '🖋️'  },
  { id: 'user',       label: 'User Data',                  icon: '👤'  },
];

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-4 left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-8 left-1/3 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">in</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                LinkedIn Automation Dashboard
              </h1>
              <p className="text-blue-200/80 text-sm md:text-base font-medium">
                Power your professional presence with AI
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`group relative px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white hover:shadow-lg'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
                {currentPage === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
      
      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
    </header>
  );
};

export default Header;
