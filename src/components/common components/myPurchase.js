'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const MyPurchase = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch Courses from Enrollment with userEmail and paymentStatus of PAID
  const fetchCourses = async (email) => {
    try {
      const response = await fetch(`/api/enrollment?userEmail=${email}&paymentStatus=PAID`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const result = await response.json();
      console.log("API response:", result);

      // Check if the result.data is an array
      if (Array.isArray(result)) {
        setCourses(result);
      } else {
        console.error('Expected an array but got:', result);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]); // Set to empty array in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const reloadedToken = localStorage.getItem('reloadedToken');
    
    if (!reloadedToken) {
      localStorage.setItem('reloadedToken', 'true');
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    // Decode the token to get the user's email
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.email) {
        fetchCourses(decoded.email); // Fetch courses using email and payment status
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 mt-0">
      <div className="mt-28 bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-4">Course List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : (
            courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col relative">
                  <div className="relative mb-4">
                    <Image
                      src={course.imageUrl}
                      alt={course.courseTitle}
                      width={400}
                      height={160} // Adjust height as per the aspect ratio
                      className="object-cover rounded-md w-full h-40"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Course Name: {course.courseTitle}</h2>
                  <p className="text-gray-400 mb-2">Course Code: {course.courseCode}</p>
                  <p className="text-gray-400 mb-2">Instructor: {course.instructor}</p>
                  <p className="text-gray-400 mb-2">Description: {course.description}</p>
                  <p className="text-gray-400 mb-2">Price: {course.price}</p>
                  <p className="text-gray-400 mb-2">Overview: {course.overview}</p>
                  <p className="text-gray-400 mb-2">Requirements: {course.requirements}</p>
                  <p className="text-gray-400 mb-4">What You Will Learn: {course.whatWeWillLearn}</p>
                </div>
              ))
            ) : (
              <p className="text-white">No courses available</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPurchase;
