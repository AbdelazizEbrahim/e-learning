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
  const [partnerships, setPartnerships] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBestCourses = async () => {
      setFetchingBestCourses(true);
      try {
        const response = await fetch('/api/course?isHome=true');
        if (!response.ok) {
          throw new Error('Failed to fetch best courses');
        }
        const data = await response.json();
        setBestCourses(data);
      } catch (error) {
        console.error('Error fetching best courses:', error);
      } finally {
        setFetchingBestCourses(false);
      }
    };

    const fetchPartnerships = async () => {
      try {
        const response = await fetch('/api/partners?sort=-createdAt&limit=5');
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
        const response = await fetch('/api/testimonies?sort=-createdAt&limit=5');
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
    fetchPartnerships();
    fetchTestimonies();
  }, []);

  const handleEnroll = (courseCode) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Redirect to the enroll page with the course code as a query parameter
      router.push(`/user/enroll?courseCode=${encodeURIComponent(courseCode)}`);
    } else {
      // Redirect to the sign-in page
      router.push('/signin');
    }
  };
  

  return (
    <div className='relative w-screen h-screen'>
      <main className='relative flex flex-col items-center w-full h-full p-4 mt-12'>
        <h1 className='text-3xl font-bold mb-4 text-black'>Welcome to Our E-Learning Platform.</h1>
        <p className='text-lg mb-8 text-black'>Choose an action below to get started.</p>

        {/* Best Courses Section */}
        <hr className='my-8 border-gray-600 border-2' />
        <h2 className='text-2xl font-semibold mb-4 text-black'>Best Courses</h2>
        <div className='flex flex-wrap gap-4'>
          {fetchingBestCourses ? (
            <p className='text-black'>Loading best courses...</p>
          ) : (
            bestCourses.map((course) => (
              <div
                key={course._id}
                className='bg-gray-800 p-6 rounded-lg shadow-lg flex-shrink-0 w-80 mb-5'
              >
                <div className='relative mb-4'>
                  <Image
                    src={course.imageUrl}
                    alt={course.courseTitle}
                    width={320}
                    height={180}
                    className='w-full h-48 object-cover rounded-md'
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

        {/* Partnership Section */}
        <hr className='my-8 border-gray-600 border-2' />
        <h2 className='text-2xl font-semibold mb-4 text-black'>Partners</h2>
        <div className='flex justify-center flex-wrap gap-6'>
          {partnerships.map((partner) => (
            <div key={partner._id} className=' transition-timing-function: linear flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg w-56'>
              <Image
                src={partner.imageUrl || 'image.jpg'}
                alt={partner.companyName}
                width={80}
                height={80}
                className='w-16 h-16 object-cover rounded-full mb-2'
              />
              <p className='text-gray-400'>{partner.description}</p>
            </div>
          ))}
        </div>

        {/* Testimony Section */}
        <hr className='my-8 border-gray-600 border-2' />
        <h2 className='text-2xl font-semibold mb-5 text-black'>Testimonies</h2>
        <div className='flex justify-center flex-wrap gap-6'>
          {testimonies.map((testimony) => (
            <div key={testimony._id} className='flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg w-56'>
              <div className='flex-shrink-0 mr-4'>
                <Image
                  src={testimony.imageUrl || '/default-testimony-image.jpg'}
                  alt={testimony.Name}
                  width={80}
                  height={80}
                  className='w-20 h-20 object-cover rounded-full'
                />
              </div>
              <div className='flex flex-col'>
                <p className='text-gray-400 mb-1 font-bold'>{testimony.Name}</p>
                <p className='text-gray-400'>{testimony.testimony}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
