'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const RightSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed top-16 right-0 bottom-16 bg-black  p-4 transition-all duration-300 ${isOpen ? 'w-48' : 'w-10'} shadow-lg`}>
      {/* Toggle Button */}
      <button
        className={`absolute top-4 -left-3 p-2 bg-blue-500 text-white rounded-full ${isOpen ? 'hidden' : 'block'}`}
        onClick={toggleSidebar}
      >
        <HiChevronRight className="h-6 w-6" />
      </button>
      <button
        className={`absolute top-4 right-0 p-2 bg-blue-500 text-white rounded-full ${isOpen ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
      >
        <HiChevronLeft className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className={`flex flex-col space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Message 1</h3>
          <p className="text-gray-700">This is the first message. Add any details you want here.</p>
          <Link href="/action1">
            <span className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
              Action 1
            </span>
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Message 2</h3>
          <p className="text-gray-700">This is the second message. Include relevant information here.</p>
          <Link href="/action2">
            <span className="mt-2 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer">
              Action 2
            </span>
          </Link>
        </div>

        
      </div>
    </div>
  );
};

export default RightSideBar;
