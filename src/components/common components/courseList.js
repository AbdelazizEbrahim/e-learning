'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

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
    const fetchEnrollmentAndCourses = async () => {
      setLoading(true);
      try {
        // Fetch enrollment data
        const token = localStorage.getItem('authToken');
        let email = '';
        if (token) {
          const decoded = jwt.decode(token);
          email = decoded?.email || '';
        }
    
        const enrollmentResponse = await fetch(`/api/enrollment?userEmail=${email}&paymentStatus=PAID`);
        if (!enrollmentResponse.ok) {
          console.log('Failed to fetch enrollment data');
        }
    
        const enrolled = await enrollmentResponse.json();
        console.log("enrolled: ", enrolled);
    
        // Check if enrolledCourses is empty or not
        const enrolledCourses = enrolled?.length ? enrolled : [];
    
        // Fetch courses data
        const coursesResponse = await fetch('/api/course');
        if (!coursesResponse.ok) {
          console.log('Failed to fetch courses');
        }
        const allCourses = await coursesResponse.json();
    
        let filteredCourses;
        if (enrolledCourses.length === 0) {
          // If enrolledCourses is empty, render all courses
          filteredCourses = allCourses;
        } else {
          // Otherwise, filter out enrolled courses
          const enrolledCourseCodes = new Set(enrolledCourses.map(course => course.courseCode));
          filteredCourses = allCourses.filter(course => !enrolledCourseCodes.has(course.courseCode));
        }
    
        setCourses(filteredCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchEnrollmentAndCourses();

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
      router.push(`/enroll?courseCode=${encodeURIComponent(courseCode)}`);
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 mt-0">
      <div className="mt-28 bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-4">Course List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : (
            approvedCourses.map((course) => (
              <div key={course._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col relative">
                <div className="relative mb-4">
                  <Image
                    src={course.imageUrl}
                    alt={course.courseTitle}
                    width={400}
                    height={160} // Adjust height as per the aspect ratio
                    className="object-cover rounded-md w-full h-40"
                  />
                  <button
                    onClick={() => toggleWishlist(course)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-300 transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={isCourseInWishlist(course.courseCode) ? solidHeart : regularHeart} size="lg" />
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
