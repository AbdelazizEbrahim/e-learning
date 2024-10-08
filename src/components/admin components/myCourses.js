'use client';

import React, { useState, useEffect } from 'react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [isHomeLoading, setIsHomeLoading] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/course');
                const data = await response.json();
                setCourses(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleApprove = async (courseCode) => {
        try {
            await fetch('/api/course', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseCode, isApproved: true }),
            });

            // Update the course list in real-time
            setCourses((prevCourses) => {
                return prevCourses.map((course) =>
                    course.courseCode === courseCode ? { ...course, isApproved: true } : course
                );
            });
        } catch (error) {
            console.error('Error approving course:', error);
        }
    };

    const handleDelete = async (courseCode) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setDeleteLoading((prev) => ({ ...prev, [courseCode]: true }));
            try {
                const response = await fetch('/api/course', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ courseCode }),
                });
                if (response.ok) {
                    // Remove the deleted course from the state
                    setCourses((prevCourses) =>
                        prevCourses.filter((course) => course.courseCode !== courseCode)
                    );
                } else {
                    console.log('Failed to delete course');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
            } finally {
                setDeleteLoading((prev) => ({ ...prev, [courseCode]: false }));
            }
        }
    };

    const handleToggleHome = async (courseCode, isHome) => {
        setIsHomeLoading((prev) => ({ ...prev, [courseCode]: true }));
        try {
            const response = await fetch('/api/course', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseCode, isHome: !isHome }),
            });
            if (response.ok) {
                setCourses((prevCourses) =>
                    prevCourses.map((course) =>
                        course.courseCode === courseCode ? { ...course, isHome: !isHome } : course
                    )
                );
            } else {
                console.error('Failed to update isHome status');
            }
        } catch (error) {
            console.error('Error updating isHome status:', error);
        } finally {
            setIsHomeLoading((prev) => ({ ...prev, [courseCode]: false }));
        }
    };

    const approvedCourses = courses.filter((course) => course.isApproved);
    const newArrivals = courses.filter((course) => !course.isApproved);

    return (
        <div className="p-4 mr-8">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Approved Courses Section */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Approved Courses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? (
                            <p className="text-white">Loading...</p>
                        ) : (
                            approvedCourses.map((course) => (
                                <div key={course.courseCode} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                                    <img
                                        src={course.imageUrl}
                                        alt="Course Image"
                                        className="w-full h-32 object-cover mb-4 rounded"
                                    />
                                    <h3 className="text-lg font-semibold text-gray-400">{course.courseTitle}</h3>
                                    <p className="text-gray-400">Instructor: {course.instructor}</p>
                                    <p className="text-gray-400">Price: ${course.price}</p>
                                    <p className="text-gray-400">Description: {course.description}</p>
                                    <p className="text-gray-400">Overview: {course.overview}</p>
                                    <p className="text-gray-400">Requirements: {course.requirements}</p>
                                    <p className="text-gray-400">What You Will Learn: {course.whatWeWillLearn}</p>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleDelete(course.courseCode)}
                                            className={`bg-red-600 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-300 ${deleteLoading[course.courseCode] ? 'cursor-wait opacity-50' : ''}`}
                                            disabled={deleteLoading[course.courseCode]}
                                        >
                                            {deleteLoading[course.courseCode] ? 'Deleting...' : 'Delete'}
                                        </button>
                                        <button
                                            onClick={() => handleToggleHome(course.courseCode, course.isHome)}
                                            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-400 transition-colors duration-300 ${isHomeLoading[course.courseCode] ? 'cursor-wait opacity-50' : ''}`}
                                            disabled={isHomeLoading[course.courseCode]}
                                        >
                                            {course.isHome ? 'Remove from Home' : 'Add to Home'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* New Arrivals Section */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">New Arrivals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? (
                            <p className="text-white">Loading...</p>
                        ) : (
                            newArrivals.map((course) => (
                                <div key={course.courseCode} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                                    <img
                                        src="/image.jpeg"
                                        alt="Course Image"
                                        className="w-full h-32 object-cover mb-4 rounded"
                                    />
                                    <h3 className="text-lg font-semibold text-gray-400">{course.courseTitle}</h3>
                                    <p className="text-gray-400">Instructor: {course.instructor}</p>
                                    <p className="text-gray-400">Price: ${course.price}</p>
                                    <p className="text-gray-400">Description: {course.description}</p>
                                    <p className="text-gray-400">Overview: {course.overview}</p>
                                    <p className="text-gray-400">Requirements: {course.requirements}</p>
                                    <p className="text-gray-400">What You Will Learn: {course.whatWeWillLearn}</p>
                                    <button
                                        onClick={() => handleApprove(course.courseCode)}
                                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseList;
