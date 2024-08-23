'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function EnrollStudent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courseCode, setCourseCode] = useState('');
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token from localStorage:', token); // Log token

    if (token) {
      try {
        const decoded = jwt.decode(token);
        console.log('Decoded JWT:', decoded); // Log decoded token

        if (decoded && decoded.email) {
          setUserEmail(decoded.email);
          console.log('User Email set:', decoded.email); // Log email set
        } else {
          console.warn('Decoded token does not contain email');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.warn('No token found in localStorage');
    }

    const code = searchParams.get('courseCode');
    console.log('Course code from URL:', code); // Log course code from URL

    if (code) {
      setCourseCode(code);
      fetchCourseInfo(code);
    } else {
      alert('Course code is missing.');
      router.push('/');
    }
  }, [searchParams, router]);

  const fetchCourseInfo = async (code) => {
    console.log('Fetching course info for code:', code); // Log before fetching course info

    try {
      const response = await fetch(`/api/course/?courseCode=${code}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course information');
      }
      const data = await response.json();
      setCourseInfo(data);
      console.log('Course info fetched:', data); // Log fetched course info
    } catch (error) {
      console.error('Error fetching course information:', error);
    }
  };

  const handleAddToCart = async () => {
    console.log('User Email:', userEmail); // Log user email
    console.log('Course Info:', courseInfo); // Log course info

    if (!userEmail || !courseInfo) {
      alert('Missing user email or course information');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          courseCode: courseInfo.courseCode,
          price: courseInfo.price,
          paymentId: '', // Assuming payment ID will be handled later
          paymentStatus: 'Pending', // Assuming default status
          status: 'Active', // Assuming default status
        }),
      });

      if (response.ok) {
        alert('Course added to cart successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to add course to cart: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to add course to cart:', error);
      alert('Failed to add course to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative w-screen h-screen flex items-center justify-center mt-0'>
      <main className='relative flex flex-col lg:flex-row items-center justify-center bg-black/50 p-6 space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-4xl'>
        
        {/* Course Information Card */}
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-sm'>
          {courseInfo ? (
            <>
              <Image
                src={'/image.jpeg'} // Use the image URL from courseInfo or a default image
                alt={courseInfo.courseTitle}
                width={500} // Set the width of the image
                height={200} // Set the height of the image
                className='w-full h-40 object-cover rounded mb-4'
              />
              <p className='text-sm mb-1'><strong>Course Name:</strong> {courseInfo.courseTitle}</p>
              <p className='text-sm mb-1'><strong>Course Code:</strong> {courseCode}</p>
              <p className='text-sm mb-1'><strong>Price:</strong> {courseInfo.price}</p>
              <p className='text-sm mb-1'><strong>Instructor:</strong> {courseInfo.instructor}</p>
              <p className='text-sm mb-1'><strong>Overview:</strong> {courseInfo.overview}</p>
              <p className='text-sm mb-1'><strong>Requirements:</strong> {courseInfo.requirements}</p>
              <p className='text-sm mb-1'><strong>Description:</strong> {courseInfo.description}</p>
              <p className='text-sm mb-1'><strong>What You Will Learn? :</strong> {courseInfo.whatWeWillLearn}</p>
            </>
          ) : (
            <p>Loading course information...</p>
          )}
        </div>

        {/* Add to Cart Card */}
        <div className='bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-sm flex items-center justify-center'>
          <button
            onClick={handleAddToCart}
            className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300'
            disabled={loading}
          >
            Add to Cart
          </button>
        </div>
      </main>
    </div>
  );
}
