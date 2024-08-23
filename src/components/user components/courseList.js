'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState({});
  const router = useRouter();

  // Fetch Wishlist Data
  const fetchWishlist = async (email) => {
    try {
      const response = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      setWishlist(data); // Set wishlist data
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // This useEffect triggers the reload when the page first opens
  useEffect(() => {
    const reloadedToken = localStorage.getItem('reloadedToken');
    
    if (!reloadedToken) {
      localStorage.setItem('reloadedToken', 'true');
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/course');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          alert('Unexpected data format.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // Decode the token to get the user's email and fetch wishlist
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.email) {
        fetchWishlist(decoded.email); // Fetch wishlist using email
      }
    }
  }, []);

  const handleEnroll = async (courseCode) => {
    setEnrollLoading((prev) => ({ ...prev, [courseCode]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/user/enroll?courseCode=${encodeURIComponent(courseCode)}`);
    } catch (error) {
      console.error('Error occurred while redirecting:', error);
    } finally {
      setEnrollLoading((prev) => ({ ...prev, [courseCode]: false }));
    }
  };

  const toggleWishlist = async (course) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('No token found in local storage.');
      return;
    }

    let email;
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.email) {
        email = decoded.email;
      } else {
        alert('Failed to decode token or email not found.');
        return;
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      alert('Failed to decode token.');
      return;
    }

    const courseCode = course.courseCode;

    try {
      // Check if the course is in the wishlist
      if (isCourseInWishlist(courseCode)) {
        // Remove course from wishlist
        const response = await fetch(`/api/wishlist`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, courseCode }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove course from wishlist');
        }

        // Refresh wishlist after removal
        fetchWishlist(email);

      } else {
        // Add course to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            courseCode,
            courseTitle: course.courseTitle,
            instructor: course.instructor,
            description: course.description,
            price: course.price,
            imageUrl: course.imageUrl,
            overview: course.overview,
            requirements: course.requirements,
            whatWeWillLearn: course.whatWeWillLearn,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add course to wishlist');
        }

        // Refresh wishlist after adding
        fetchWishlist(email);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist.');
    }
  };

  const isCourseInWishlist = (courseCode) => {
    return Array.isArray(wishlist) && wishlist.some(course => course.courseCode === courseCode);
  };

  const approvedCourses = courses.filter(course => course.isApproved);
  const newArrivals = courses.filter(course => !course.isApproved);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <div className="mt-28 bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-4">Course List</h1>
        <h2 className="text-2xl font-semibold mb-4">Approved Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : (
            approvedCourses.map((course) => (
              <div key={course._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col relative">
                <div className="relative mb-4">
                  <img
                    src={course.imageUrl || '/image.jpeg'}
                    alt={course.courseTitle}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <button
                    onClick={() => toggleWishlist(course)}
                    className={`absolute top-2 right-2 ${
                      isCourseInWishlist(course.courseCode) ? 'text-red-800' : 'text-red-600 hover:text-red-800'
                    } font-bold text-2xl p-2 rounded border ${
                      isCourseInWishlist(course.courseCode) ? 'border-red-800' : 'border-red-600 hover:border-red-800'
                    }`}
                  >
                    {isCourseInWishlist(course.courseCode) ? '❤️' : '♡'}
                  </button>
                </div>
                <h2 className="text-xl font-semibold mb-2">Course Name: {course.courseTitle}</h2>
                <p className="text-gray-400 mb-2">Course Code: {course.courseCode}</p>
                <p className="text-gray-400 mb-2">Instructor: {course.instructor}</p>
                <p className="text-gray-400 mb-2">Description: {course.description}</p>
                <p className="text-gray-400 mb-2">Price: {course.price}</p>
                <p className="text-gray-400 mb-2">Overview: {course.overview}</p>
                <p className="text-gray-400 mb-2">Requirements: {course.requirements}</p>
                <p className="text-gray-400 mb-4">What You Will Learn: {course.whatWeWillLearn}</p>
                <button
                  onClick={() => handleEnroll(course.courseCode)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300 relative"
                  disabled={enrollLoading[course.courseCode]}
                >
                  {enrollLoading[course.courseCode] ? 'Enrolling...' : 'Enroll'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
