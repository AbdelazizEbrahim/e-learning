'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`fixed top-16 left-0 z-50 p-2 bg-black text-white rounded-md transition-all duration-300 ${isOpen ? 'hidden' : 'block'}`}
        onClick={toggleSidebar}
        style={{ width: '35px', height: '35px' }}
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-16 bottom-16 left-0 bg-black text-white transition-all duration-300 ${isOpen ? 'w-32' : 'w-0'} overflow-hidden hover:w-25`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center p-4">
            <button
              className={`text-white p-2 ${isOpen ? 'block' : 'hidden'}`}
              onClick={toggleSidebar}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Sidebar Links */}
          <nav className="flex flex-col flex-1">
            <div className={`flex-1 ${isOpen ? 'block' : 'hidden'} p-4`}>
              <Link href="#" className="block py-2 px-2 text-white hover:bg-gray-700 rounded-lg">
                Dashboard
              </Link>
              <Link href="#" className="block py-2 px-2 text-white hover:bg-gray-700 rounded-lg">
                Users
              </Link>
              <Link href="#" className="block py-2 px-2 text-white hover:bg-gray-700 rounded-lg">
                Courses
              </Link>
              <Link href="#" className="block py-2 px-2 text-white hover:bg-gray-700 rounded-lg">
                Reports
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
