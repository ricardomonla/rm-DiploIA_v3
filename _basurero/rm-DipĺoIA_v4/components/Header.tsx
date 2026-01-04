
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          DiploIA Studio <span className="text-xs font-mono text-blue-500/80 align-top ml-1">v3</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Library</a>
          <a href="#" className="hover:text-white transition-colors">Workspace</a>
          <a href="#" className="hover:text-white transition-colors">Community</a>
        </nav>
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
          <img src="https://picsum.photos/32/32" alt="Avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
