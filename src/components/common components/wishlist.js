'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';

const Wishlist = () => {
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState({});
  const [removeLoading, setRemoveLoading] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchWishlistCourses = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('No token found in local storage.');
        setLoading(false);
        return;
      }

      let email;

      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.email) {
          email = decoded.email;
        } else {
          alert('Failed to decode token or email not found.');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        alert('Failed to decode token.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/wishlist?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send token for authentication if required
          },
        });

        if (!response.ok) {
          console.log('Failed to fetch wishlist courses:');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setWishlistCourses(data);
        } else {
          alert('Unexpected data format.');
        }
      } catch (error) {
        alert('Failed to fetch wishlist courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCourses();
  }, []);

  const handleEnroll = async (courseCode) => {
    setEnrollLoading((prev) => ({ ...prev, [courseCode]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/user/enroll?courseCode=${encodeURIComponent(courseCode)}`);
    } catch (error) {
      alert('An error occurred while redirecting.');
    } finally {
      setEnrollLoading((prev) => ({ ...prev, [courseCode]: false }));
    }
  };

  const handleRemove = async (courseCode) => {
    if (!window.confirm('Are you sure you want to remove this course from your wishlist?')) {
      return;
    }
  
    const token = localStorage.getItem('authToken');
    const email = jwt.decode(token)?.email;
  
    if (!email) {
      alert('Failed to get user email.');
      return;
    }
  
    setRemoveLoading((prev) => ({ ...prev, [courseCode]: true }));
  
    try {
      const response = await fetch(`/api/wishlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, courseCode }),
      });
  
      console.log(response);
      if (response.ok) {
        setWishlistCourses((prevCourses) => prevCourses.filter(course => course.courseCode !== courseCode));
        // alert('Course removed successfully from your wishlist.');
      } else {
        const errorData = await response.json();
        alert(`Failed to remove course from wishlist: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('An error occurred while removing the course.');
    } finally {
      setRemoveLoading((prev) => ({ ...prev, [courseCode]: false }));
    }
  };

  return (
    <div className="relative w-screen h-screen flex">
      {/* Main Content Area */}
      <div className="flex-1 p-5">
        <main className="relative flex flex-col items-center justify-center w-full h-full p-6">
          <div className="mt-28 bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
            <h1 className="text-3xl font-semibold mb-4">Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : (
                wishlistCourses.map((course) => (
                  <div key={course.courseCode} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col relative">
                    <div className="relative mb-4">
                      <img
                        src={course.imageUrl || '/image.jpeg'} // Use course image or default
                        alt={course.courseTitle}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <button
                        onClick={() => handleRemove(course.courseCode)}
                        className={`absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-500 transition-colors duration-300 ${removeLoading[course.courseCode] ? 'cursor-wait opacity-50' : ''}`}
                        aria-label="Remove from Wishlist"
                        disabled={removeLoading[course.courseCode]}
                      >
                        {removeLoading[course.courseCode] ? '🕒' : '❤️'}
                      </button>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Course Name: {course.courseTitle}</h2>
                    <p className="text-gray-400 mb-2">Course Code: {course.courseCode}</p>
                    <p className="text-gray-400 mb-4">Price: {course.price}</p>
                    <p className="text-gray-400 mb-2">Instructor: {course.instructor}</p>
                    <p className="text-gray-400 mb-4">Description: {course.description}</p>
                    <p className="text-gray-400 mb-4">Overview: {course.overview}</p>
                    <p className="text-gray-400 mb-4">Requirements: {course.requirements}</p>
                    <p className="text-gray-400 mb-4">What we will learn: {course.whatWeWillLearn}</p>
                    <button
                      onClick={() => handleEnroll(course.courseCode)}
                      className={`mt-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400 transition-colors duration-300 ${enrollLoading[course.courseCode] ? 'cursor-wait opacity-50' : ''}`}
                      disabled={enrollLoading[course.courseCode]}
                    >
                      {enrollLoading[course.courseCode] ? 'Enrolling...' : 'Enroll'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Wishlist;
