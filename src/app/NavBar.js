'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import jwt from 'jsonwebtoken'; // Ensure jwt is installed and imported
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation

const NavBar = () => {
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const dropdownRef = useRef(null); // Ref for dropdown menu

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownHover = (isOpen) => {
    setIsDropdownHovered(isOpen);
  };

  const handleLogout = () => {
    // Remove auth token from local storage
    localStorage.removeItem('authToken');
    // Reset user role state
    setUserRole(null);
    // Redirect to the sign-in page
    router.push('/signin');
  };

  useEffect(() => {
    const fetchUserRole = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwt.decode(token);
          if (decoded && decoded.role) {
            setUserRole(decoded.role);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Button */}
        <Link href="/" className="text-white flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
            L
          </div>
          <span className="ml-2 text-white text-lg font-semibold">Logo</span>
        </Link>

        {/* Right Links */}
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Home
          </Link>
          <Link href="/about" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            About
          </Link>
          <Link href="/contact" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Contact
          </Link>
          <Link href="/courses" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Courses
          </Link>
          {/* Conditional Rendering for Admin */}
          {userRole === 'admin' ? (
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover(true)}
              onMouseLeave={() => handleDropdownHover(false)}
            >
              <button
                onClick={toggleDropdown}
                className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  P
                </div>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown Menu */}
              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg transition-all duration-300 ${dropdownOpen || isDropdownHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
              >
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/my-courses" className="block px-4 py-2 hover:bg-gray-100">
                  My Courses
                </Link>
                <Link href="/account-settings" className="block px-4 py-2 hover:bg-gray-100">
                  Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/signin" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
