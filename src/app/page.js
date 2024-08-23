'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState({
    signin: false,
    signup: false,
    resetPassword: false,
  });
  const [bestCourses, setBestCourses] = useState([]);
  const [fetchingBestCourses, setFetchingBestCourses] = useState(true);
  const [instructorAdvices, setInstructorAdvices] = useState([]);
  const [currentInstructorIndex, setCurrentInstructorIndex] = useState(0);
  const [partnerships, setPartnerships] = useState([]);
  const [currentPartnershipIndex, setCurrentPartnershipIndex] = useState(0);
  const [testimonies, setTestimonies] = useState([]);
  const [currentTestimonyIndex, setCurrentTestimonyIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchBestCourses = async () => {
      setFetchingBestCourses(true);
      try {
        const response = await fetch('/api/course');
        if (!response.ok) {
          throw new Error('Failed to fetch best courses');
        }
        const data = await response.json();
        setBestCourses(data.slice(0, 3)); // Limit to the top 3 courses
      } catch (error) {
        console.error('Error fetching best courses:', error);
      } finally {
        setFetchingBestCourses(false);
      }
    };

    const fetchInstructorAdvices = async () => {
      try {
        const response = await fetch('/api/instructor-advices');
        if (!response.ok) {
          throw new Error('Failed to fetch instructor advices');
        }
        const data = await response.json();
        setInstructorAdvices(data);
      } catch (error) {
        console.error('Error fetching instructor advices:', error);
      }
    };

    const fetchPartnerships = async () => {
      try {
        const response = await fetch('/api/partnerships');
        if (!response.ok) {
          throw new Error('Failed to fetch partnerships');
        }
        const data = await response.json();
        setPartnerships(data);
      } catch (error) {
        console.error('Error fetching partnerships:', error);
      }
    };

    const fetchTestimonies = async () => {
      try {
        const response = await fetch('/api/testimonies');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonies');
        }
        const data = await response.json();
        setTestimonies(data);
      } catch (error) {
        console.error('Error fetching testimonies:', error);
      }
    };

    fetchBestCourses();
    fetchInstructorAdvices();
    fetchPartnerships();
    fetchTestimonies();
  }, []);

  const handleEnroll = async (courseCode) => {
    const token = localStorage.getItem('token'); // Check token from local storage
    if (token) {
      router.push(`/signin?courseCode=${encodeURIComponent(courseCode)}`);
    } else {
      router.push('/signin');
    }
  };

  const handleInstructorNav = (direction) => {
    setCurrentInstructorIndex((prev) => 
      (prev + direction + instructorAdvices.length) % instructorAdvices.length
    );
  };

  const handlePartnershipNav = (direction) => {
    setCurrentPartnershipIndex((prev) => 
      (prev + direction + partnerships.length) % partnerships.length
    );
  };

  const handleTestimonyNav = (direction) => {
    setCurrentTestimonyIndex((prev) => 
      (prev + direction + testimonies.length) % testimonies.length
    );
  };

  return (
    <div className='relative w-screen h-screen'>
      <main className='relative flex flex-col items-center w-full h-full p-4 mt-12'>
        <h1 className='text-3xl font-bold mb-4 text-black'>Welcome to Our E-Learning Platform.</h1>
        <p className='text-lg mb-8 text-black'>Choose an action below to get started.</p>

        {/* Best Courses Section */}
        <hr className='my-8 border-gray-600' />
        <h2 className='text-2xl font-semibold mb-4 text-black'>Best Courses</h2>
        <div className='flex flex-wrap gap-4'>
          {fetchingBestCourses ? (
            <p className='text-black'>Loading best courses...</p>
          ) : (
            bestCourses.map((course) => (
              <div
                key={course._id}
                className='bg-gray-800 p-4 rounded-lg shadow-lg flex-shrink-0 w-72 mb-5'
              >
                <div className='relative mb-4'>
                  <Image
                    src={'/image.jpeg'} // Use course imageUrl or fallback to default image
                    alt={course.courseTitle}
                    width={320} // Adjust width for single row
                    height={180} // Adjust height for single row
                    className='w-full h-32 object-cover rounded-md'
                  />
                </div>
                <h3 className='text-gray-400 mb-2 font-black'>{course.courseTitle}</h3>
                <p className='text-gray-400 mb-2'>Course Code: {course.courseCode}</p>
                <p className='text-gray-400 mb-2'>Instructor: {course.instructor}</p>
                <p className='text-gray-400 mb-2'>Price: {course.price}</p>
                <p className='text-gray-400 mb-2'>Overview: {course.overview}</p>
                <p className='text-gray-400 mb-2'>Requirements: {course.requirements}</p>
                <p className='text-gray-400 mb-4'>What You Will Learn: {course.whatWeWillLearn}</p>
                <button
                  onClick={() => handleEnroll(course.courseCode)}
                  className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300'
                >
                  Enroll
                </button>
              </div>
            ))
          )}
        </div>

        {/* Instructor Advice Section */}
        <hr className='my-8 border-gray-600' />
        <h2 className='text-2xl font-semibold mb-4 text-black'>Instructor Advice</h2>
        <div className='relative flex items-center'>
          <button
            onClick={() => handleInstructorNav(-1)}
            className='absolute left-0 bg-gray-700 text-white p-2 rounded-full'
          >
            &lt;
          </button>
          {instructorAdvices.length > 0 && (
            <div className='flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg w-72'>
              <div className='relative mb-4'>
                <Image
                  src={ '/image.jpeg'}
                  alt={instructorAdvices[currentInstructorIndex].name}
                  width={80}
                  height={80}
                  className='w-20 h-20 object-cover rounded-full'
                />
              </div>
              <h3 className='text-gray-400 mb-2 font-bold'>{instructorAdvices[currentInstructorIndex].name}</h3>
              <p className='text-gray-400'>{instructorAdvices[currentInstructorIndex].advice}</p>
            </div>
          )}
          <button
            onClick={() => handleInstructorNav(1)}
            className='absolute right-0 bg-gray-700 text-white p-2 rounded-full'
          >
            &gt;
          </button>
        </div>

        {/* Partnership Section */}
        <hr className='my-8 border-gray-600' />
        <h2 className='text-2xl font-semibold mb-4 text-black'>Our Partners</h2>
        <div className='relative flex items-center'>
          <button
            onClick={() => handlePartnershipNav(-1)}
            className='absolute left-0 bg-gray-700 text-white p-2 rounded-full'
          >
            &lt;
          </button>
          {partnerships.length > 0 && (
            <div className='flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg w-72'>
              <h3 className='text-gray-400 mb-2 font-bold'>{partnerships[currentPartnershipIndex].companyName}</h3>
              <p className='text-gray-400'>{partnerships[currentPartnershipIndex].work}</p>
            </div>
          )}
          <button
            onClick={() => handlePartnershipNav(1)}
            className='absolute right-0 bg-gray-700 text-white p-2 rounded-full'
          >
            &gt;
          </button>
        </div>

        {/* Testimony Section */}
        <hr className='my-8 border-gray-600' />
        <h2 className='text-2xl font-semibold mb-4 text-black'>What Our Users Say</h2>
        <div className='relative flex items-center'>
          <button
            onClick={() => handleTestimonyNav(-1)}
            className='absolute left-0 bg-gray-700 text-white p-2 rounded-full'
          >
            &lt;
          </button>
          {testimonies.length > 0 && (
            <div className='flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg w-72'>
              <p className='text-gray-400'>{testimonies[currentTestimonyIndex].testimony}</p>
              <h3 className='text-gray-400 mt-2 font-bold'>{testimonies[currentTestimonyIndex].name}</h3>
            </div>
          )}
          <button
            onClick={() => handleTestimonyNav(1)}
            className='absolute right-0 bg-gray-700 text-white p-2 rounded-full'
          >
            &gt;
          </button>
        </div>
      </main>
    </div>
  );
}
