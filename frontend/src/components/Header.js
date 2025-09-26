// Enhanced Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkload } from '../context/WorkloadContext';

const Header = () => {
  const { workload, setUserType } = useWorkload();
  
  return (
    <header className="bg-gray-850 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xl font-bold">Clouditect</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {/* User Type Toggle */}
          <div className="flex items-center bg-gray-700 rounded-full p-1">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                workload.userType === 'business' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setUserType('business')}
            >
              Business
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                workload.userType === 'developer' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setUserType('developer')}
            >
              Developer
            </button>
          </div>
          
          <nav className="flex space-x-6">
            <Link to="/" className="hover:text-blue-300 transition duration-150 ease-in-out">
              Dashboard
            </Link>
            <Link to="/workload/simple" className="hover:text-blue-300 transition duration-150 ease-in-out">
              Business Cloud Strategy
            </Link>
            <Link to="/workload/detailed" className="hover:text-blue-300 transition duration-150 ease-in-out">
              Technical Cloud Architecture
            </Link>
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;