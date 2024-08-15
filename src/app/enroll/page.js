'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollStudent({ searchParams }) {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [city, setCity] = useState('');
  const courseCode = searchParams.courseCode; // Get courseCode from searchParams
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          fatherName,
          studentId,
          city,
          courseCode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enroll student');
      }

      const data = await response.json();
      alert('Successfully enrolled in the course!');
      router.push('/main');
    } catch (error) {
      alert('Failed to enroll student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-screen h-screen'>
      <main className='relative flex flex-col items-center justify-center w-full h-full bg-black/50 p-6'>
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-md'>
          <h1 className='text-2xl font-semibold mb-4'>Enroll Student</h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium'>Student Name</label>
              <input
                type='text'
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder='Enter student name'
                className='p-2 rounded bg-gray-700 text-white'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium'>Father Name</label>
              <input
                type='text'
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder='Enter father name'
                className='p-2 rounded bg-gray-700 text-white'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium'>Student ID</label>
              <input
                type='text'
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder='Enter student ID'
                className='p-2 rounded bg-gray-700 text-white'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium'>City</label>
              <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Enter city'
                className='p-2 rounded bg-gray-700 text-white'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium'>Course</label>
              <input
                type='text'
                value={courseCode}
                readOnly
                placeholder='Course Code'
                className='p-2 rounded bg-gray-700 text-white cursor-not-allowed'
              />
            </div>
            <button
              type='submit'
              className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300'
              disabled={loading}
            >
              {loading ? 'Enrolling...' : 'Enroll'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}