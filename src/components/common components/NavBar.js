'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileImages, setProfileImages] = useState({
    user: 'https://example.com/user-icon.png',  // Replace with actual URL
    admin: 'https://example.com/admin-icon.png', // Replace with actual URL
    instructor: 'https://example.com/instructor-icon.png' // Replace with actual URL
  });
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [dropdownHovered, setDropdownHovered] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('reloadedToken');
    setUserRole(null);
    router.push('/');
  };

  const fetchCartCount = async (email) => {
    try {
      const response = await fetch(`/api/cart?userEmail=${email}&paymentStatus=Pending`);
      if (!response.ok) {
        setCartCount(0); // Ensure a default value on failure
        return;
      }

      const data = await response.json();
      const count = data.length; // Adjust based on your API response structure
      setCartCount(count || 0);
    } catch (error) {
      console.error('Error fetching cart notification count:', error);
      setCartCount(0); // Ensure a default value on error
    }
  };

  useEffect(() => {
    const fetchProfileImage = async (email, role) => {
      try {
        const response = await fetch(`/api/photo?email=${email}`);
        if (!response.ok) {
          console.error('Error fetching profile image');
          return;
        }
        const data = await response.json();
        // console.log("data: ", data.data)
        if (role === 'admin') {
          setProfileImages(prevState => ({ ...prevState, admin: data.data.imageUrl }));
        } else if (role === 'user') {
          setProfileImages(prevState => ({ ...prevState, user: data.data.imageUrl }));
        } else if (role === 'instructor') {
          setProfileImages(prevState => ({ ...prevState, instructor: data.data.imageUrl }));
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    const fetchUserRole = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwt.decode(token);
          if (decoded && decoded.role) {
            setUserRole(decoded.role);
            if (decoded.role === 'user' || 'instructor' && decoded.email) {
              // Fetch cart notification count
              await fetchCartCount(decoded.email);
              await fetchProfileImage(decoded.email, decoded.role);
            }
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
    };

    fetchUserRole();
  }, [router]);

  useEffect(() => {
    // Close dropdown if clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCartClickUser = () => {
    router.push('/user/payment'); // Redirect to the payment page
  };
  const handleCartClickInstructor = () => {
    router.push('/instructor/payment'); // Redirect to the payment page
  };

  return (
    <nav className="bg-gray-800 p-4 h-16">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Button */}
        <Link href="/" className="text-white flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
            L
          </div>
          <span className="ml-2 text-white text-lg font-semibold">Logo</span>
        </Link>

        {/* Right Links */}
        <div className="flex items-center space-x-4 relative">
          <Link href="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
          <Link href="/about" className="text-white hover:bg-gray-700 px-3 py-2 rounded">About</Link>
          <Link href="/contact" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Contact</Link>
          <Link href="/courses" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Courses</Link>

          {/* Conditional Rendering for Admin */}
          {userRole === 'admin' ? (
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownHovered(true)}
              onMouseLeave={() => setDropdownHovered(false)}
            >
              <button
                onClick={toggleDropdown}
                className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center transition-colors duration-200"
              >
                <img
                  src={profileImages.admin}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {(dropdownOpen || dropdownHovered) && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white text-gray-900 rounded-lg shadow-lg z-50">
                  <Link href="/admin/dashboard" className="block px-3 py-2 hover:bg-gray-100">Dashboard</Link>
                  <Link href="/admin/myCourses" className="block px-3 py-2 hover:bg-gray-100">My Courses</Link>
                  <Link href="/admin/manageUsers" className="block px-3 py-2 hover:bg-gray-100">User Management</Link>
                  <Link href="/admin/accountSetting" className="block px-3 py-2 hover:bg-gray-100">Account Settings</Link>
                  <Link href="/admin/partner" className="block px-3 py-2 hover:bg-gray-100">Partners</Link>
                  <Link href="/admin/testimony" className="block px-3 py-2 hover:bg-gray-100">Testimonies</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-100">Log Out</button>
                </div>
              )}
            </div>
          ) : userRole === 'user' ? (
            <div className="relative flex items-center">
               <button
                onClick={handleCartClickUser}
                className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.344 2M7 13l1.468-7H19a1 1 0 00.993-.883L21 5H7l-.25-1H3m0 0L5 17h14l2-10H7.344M7 20a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            <div
              ref={dropdownRef}
              className="relative flex items-center"
              onMouseEnter={() => setDropdownHovered(true)}
              onMouseLeave={() => setDropdownHovered(false)}
            >
              <button
                onClick={toggleDropdown}
                className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center transition-colors duration-200 ml-4"
              >
                <img
                  src={profileImages.user}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {(dropdownOpen || dropdownHovered) && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white text-gray-900 rounded-lg shadow-lg z-50">
                  <Link href="/user/myLearning" className="block px-3 py-2 hover:bg-gray-100">My Learning</Link>
                  <Link href="/user/myPurchase" className="block px-3 py-2 hover:bg-gray-100">My Purchase</Link>
                  <Link href="/user/wishlist" className="block px-3 py-2 hover:bg-gray-100">Wishlist</Link>
                  <Link href="/user/accountSetting" className="block px-3 py-2 hover:bg-gray-100">Account Settings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-100">Log Out</button>
                </div>
              )}
            </div>
            </div>
          ) : userRole === 'instructor' ? (
            <div className="relative flex items-center">
               <button
                onClick={handleCartClickInstructor}
                className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.344 2M7 13l1.468-7H19a1 1 0 00.993-.883L21 5H7l-.25-1H3m0 0L5 17h14l2-10H7.344M7 20a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
              <div
              ref={dropdownRef}
              className="relative flex items-center"
              onMouseEnter={() => setDropdownHovered(true)}
              onMouseLeave={() => setDropdownHovered(false)}
            >
              <button
                onClick={toggleDropdown}
                className="text-white hover:bg-gray-700 px-3 py-2 rounded flex items-center transition-colors duration-200"
              >
                <img
                  src={profileImages.instructor}
                  alt="Instructor"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {(dropdownOpen || dropdownHovered) && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white text-gray-900 rounded-lg shadow-lg z-50">
                  <Link href="/instructor/myCourses" className="block px-3 py-2 hover:bg-gray-100">My Courses</Link>
                  <Link href="/instructor/myLearning" className="block px-3 py-2 hover:bg-gray-100">My Learning</Link>
                  <Link href="/instructor/wishlist" className="block px-3 py-2 hover:bg-gray-100">Wishlist</Link>
                  <Link href="/instructor/accountSetting" className="block px-3 py-2 hover:bg-gray-100">Account Settings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-100">Log Out</button>
                </div>
              )}
            </div>
            </div>

          ) : (
            <Link href="/signin" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Sign In/Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
