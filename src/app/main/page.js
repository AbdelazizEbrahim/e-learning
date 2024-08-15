'use client';

import { useEffect, useState } from 'react';
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
          setCourses(data);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/enroll?courseCode=${encodeURIComponent(courseCode)}`);
    } catch (error) {
      alert('An error occurred while redirecting.');
    } finally {
      setEnrollLoading((prev) => ({ ...prev, [courseCode]: false }));
    }
  };

  return (
    <div className='relative w-screen h-screen'>
      <main className='relative flex flex-col items-center justify-center w-full h-full bg-black/50 p-6'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl'>
          <h1 className='text-3xl font-semibold mb-4'>Dashboard</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {loading ? (
              <p className='text-white'>Loading...</p>
            ) : (
              courses.map((course) => (
                <div key={course._id} className='bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col'>
                  <h2 className='text-xl font-semibold mb-2'>Course Name : {course.courseTitle}</h2>
                  <p className='text-gray-400 mb-2'>Course Code : {course.courseCode}</p>
                  <p className='text-gray-400 mb-4'>Instructor Name : {course.instructor}</p>
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
          <footer className='mt-6'>
            <p className='text-xs text-slate-200'>@2024 All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}