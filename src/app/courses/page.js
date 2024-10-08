'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState({});
  const router = useRouter();

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
          setCourses(data.filter(course => course.isApproved)); // Filter only approved courses
        } else {
          alert('Unexpected data format.');
        }
      } catch (error) {
        alert('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseCode) => {
    setEnrollLoading((prev) => ({ ...prev, [courseCode]: true }));
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
         router.push(`/enroll?courseCode=${encodeURIComponent(courseCode)}`);
      } else {
         router.push(`/signin?courseCode=${encodeURIComponent(courseCode)}`);
      }
    } catch (error) {
      alert('An error occurred while redirecting.');
    } finally {
      setEnrollLoading((prev) => ({ ...prev, [courseCode]: false }));
    }
  };

  return (
    <div className='relative h-screen w-screen'>
      <main className='relative flex flex-col items-center w-full h-full p-4'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl'>
          <h1 className='text-3xl font-semibold mb-4'>Available Courses</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {loading ? (
              <p className='text-white'>Loading...</p>
            ) : (
              courses.map((course) => (
                <div 
                  key={course._id} 
                  className='bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col transform transition-transform duration-300 hover:scale-105 mb-0'
                >
                  <div className='relative mb-4'>
                    <Image
                      src={course.imageUrl}  
                      alt={course.courseTitle}
                      width={640}  
                      height={240}  
                      className='w-full h-40 object-cover rounded-md'
                    />
                  </div>
                  <h2 className='text-xl font-semibold mb-2'>Course Name: {course.courseTitle}</h2>
                  <p className='text-gray-400 mb-2'>Course Code: {course.courseCode}</p>
                  <p className='text-gray-400 mb-2'>Price: ${course.price}</p> {/* Added Price */}
                  <p className='text-gray-400 mb-4'>Description: {course.description}</p> {/* Added Description */}
                  <p className='text-gray-400 mb-4'>Instructor Name: {course.instructor}</p>
                  <p className='text-gray-400 mb-4'>Overview: {course.overview}</p> {/* Added Overview */}
                  <p className='text-gray-400 mb-4'>Requirements: {course.requirements}</p> {/* Added Requirements */}
                  <p className='text-gray-400 mb-4'>What We Will Learn: {course.whatWeWillLearn}</p> {/* Added What We Will Learn */}
                  <button
                    onClick={() => handleEnroll(course.courseCode)}
                    className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300 relative'
                    disabled={enrollLoading[course.courseCode]}
                  >
                    {enrollLoading[course.courseCode] ? 'Enrolling...' : 'Enroll'}
                    {enrollLoading[course.courseCode] && (
                      <span className='absolute right-2 animate-spin'>⏳</span>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
