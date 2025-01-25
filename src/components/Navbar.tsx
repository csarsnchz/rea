import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Compass, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around py-3">
          <NavLink to="/" className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }>
            <Compass size={24} />
            <span className="text-xs mt-1">Explore</span>
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }>
            <Search size={24} />
            <span className="text-xs mt-1">Search</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }>
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}