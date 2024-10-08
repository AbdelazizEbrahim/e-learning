'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState({});
  const [courseProgress, setCourseProgress] = useState({});
  const router = useRouter();

  // Fetch Courses from Enrollment with userEmail and paymentStatus of PAID
  const fetchCourses = async (email) => {
    try {
      const response = await fetch(`/api/enrollment?userEmail=${email}&paymentStatus=PAID`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const result = await response.json();
      if (Array.isArray(result)) {
        setCourses(result);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all quizzes and taken quizzes to calculate progress
  const calculateProgress = async (courseCode, email) => {
    try {
      const quizzesResponse = await fetch(`/api/quiz?courseCode=${courseCode}`);
      const allQuizzes = await quizzesResponse.json();
      console.log("all quizzes: ", allQuizzes)

      const userQuizzesResponse = await fetch(`/api/takenQuiz?userEmail=${email}&courseCode=${courseCode}`);
      const takenQuizzes = await userQuizzesResponse.json();
      console.log("taken quizzes: ", takenQuizzes)

      const totalQuizzes = allQuizzes.length;
      const takenQuizzesCount = takenQuizzes.length;
      const progressPercentage = totalQuizzes > 0 ? (takenQuizzesCount / totalQuizzes) * 100 : 0;

      // Update progress state
      setCourseProgress(prevProgress => ({
        ...prevProgress,
        [courseCode]: Math.round(progressPercentage),
      }));
    } catch (error) {
      console.error('Error calculating progress:', error);
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
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.email) {
        fetchCourses(decoded.email); // Fetch courses using email
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.email && courses.length > 0) {
        courses.forEach((course) => {
          calculateProgress(course.courseCode, decoded.email);
        });
      }
    }
  }, [courses]);

  const handleStartLearning = async (courseCode) => {
    setEnrollLoading((prev) => ({ ...prev, [courseCode]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/startLearning?courseCode=${encodeURIComponent(courseCode)}`);
    } catch (error) {
      console.error('Error occurred while redirecting:', error);
    } finally {
      setEnrollLoading((prev) => ({ ...prev, [courseCode]: false }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 mt-72 md:mt-0">
      <div className="mt-28 bg-[#16202a] text-white p-6 rounded-lg shadow-lg w-full max-w-5xl ">
        <h1 className="text-3xl font-semibold mb-4">Course List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                      height={160}
                      className="object-cover rounded-md w-full h-40"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Course Name: {course.courseTitle}</h2>
                  <p className="text-gray-400 mb-2">Course Code: {course.courseCode}</p>
                  <p className="text-gray-400 mb-2">Instructor: {course.instructor}</p>
                  <p className="text-gray-400 mb-2">Description: {course.description}</p>
                  <p className="text-gray-400 mb-2">Price: {course.price}</p>
                  <p className="text-gray-400 mb-2">Overviews: {course.overview}</p>
                  <p className="text-gray-400 mb-2">Requirements: {course.requirements}</p>
                  <p className="text-gray-400 mb-2">What You will Learn? : {course.whatWeWillLearn}</p>

                  {/* Start Learning Button */}
                  <button
                    onClick={() => handleStartLearning(course.courseCode)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300 relative"
                    disabled={enrollLoading[course.courseCode]}
                  >
                    {enrollLoading[course.courseCode] ? 'Loading...' : 'Start Learning'}
                  </button>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${courseProgress[course.courseCode] || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{courseProgress[course.courseCode] || 0}% completed</p>
                  </div>
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

export default MyLearning;
