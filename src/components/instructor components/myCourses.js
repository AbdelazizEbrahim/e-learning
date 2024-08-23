'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import jwt from 'jsonwebtoken';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);
    const [editCourse, setEditCourse] = useState(null);
    const [instructorName, setInstructorName] = useState('');
    const formRef = useRef(null);

    useEffect(() => {
        const fetchInstructorAndCourses = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const decoded = jwt.decode(token);
                if (!decoded || !decoded.email) {
                    console.error("Failed to decode token or email not found in token");
                    return;
                }

                const email = decoded.email;

                // Fetch the instructor profile based on the email
                const profileResponse = await fetch(`/api/instructorProfile?email=${email}`);
                if (!profileResponse.ok) {
                    alert("Unable to fetch instructor profile data");
                    return;
                }

                const profileData = await profileResponse.json();
                if (!profileData) {
                    console.error("Instructor profile not found or full name missing");
                    return;
                }

                const fullName = profileData.data.fullName;
                setInstructorName(fullName);

                // Fetch courses based on the instructor's name
                const courseResponse = await fetch(`/api/course?instructor=${encodeURIComponent(fullName)}`);
                if (!courseResponse.ok) {
                    console.log("Failed to fetch courses");
                    setCourses([]); // Set an empty array in case of error
                    return;
                }

                const courseData = await courseResponse.json();

                if (Array.isArray(courseData)) {
                    setCourses(courseData);
                } else {
                    setCourses([]); // If not an array, set an empty array
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setCourses([]); // Set an empty array in case of error
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorAndCourses();

        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsAddOpen(false);
                setEditCourse(null);
            }
        };

        if (isAddOpen || editCourse) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAddOpen, editCourse]);

    const openAddForm = () => {
        setIsAddOpen(true);
    };

    const closeAddForm = () => {
        setIsAddOpen(false);
        setEditCourse(null);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const { courseTitle, courseCode, imageUrl, description, price, overview, requirements, whatWeWillLearn } = e.target.elements;
        setAddLoading(true);
        try {
            await fetch('/api/course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseTitle: courseTitle.value,
                    courseCode: courseCode.value,
                    instructor: instructorName,
                    imageUrl: imageUrl.value,
                    description: description.value,
                    price: price.value,
                    overview: overview.value,
                    requirements: requirements.value,
                    whatWeWillLearn: whatWeWillLearn.value,
                }),
            });

            const response = await fetch(`/api/course?instructor=${encodeURIComponent(instructorName)}`);
            const data = await response.json();
            setCourses(data);
            closeAddForm();
        } catch (error) {
            console.error('Error adding course:', error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { courseTitle, imageUrl, description, price, overview, requirements, whatWeWillLearn } = e.target.elements;
    
        if (!editCourse) return;
    
        setAddLoading(true);
        try {
            const response = await fetch(`/api/course`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseTitle: courseTitle.value,
                    courseCode: editCourse.courseCode, // Use the existing course code
                    imageUrl: imageUrl.value,
                    description: description.value,
                    price: price.value,
                    overview: overview.value,
                    requirements: requirements.value,
                    whatWeWillLearn: whatWeWillLearn.value,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update course');
            }
    
            // Refetch the courses list
            const courseResponse = await fetch(`/api/course?instructor=${encodeURIComponent(instructorName)}`);
            if (!courseResponse.ok) {
                throw new Error('Failed to fetch updated courses');
            }
    
            const data = await courseResponse.json();
            setCourses(data);
            setEditCourse(null);
            closeAddForm();
        } catch (error) {
            console.error('Error updating course:', error);
        } finally {
            setAddLoading(false);
        }
    };
    

    const handleDelete = async (courseCode) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                const response = await fetch(`/api/course`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ courseCode }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete course');
                }
    
                // Refetch the courses list
                const courseResponse = await fetch(`/api/course?instructor=${encodeURIComponent(instructorName)}`);
                if (!courseResponse.ok) {
                    throw new Error('Failed to fetch updated courses');
                }
    
                const data = await courseResponse.json();
                setCourses(data);
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };
    

    return (
        <div className="p-4 mr-72 ml-0">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={openAddForm}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                >
                    Add Course
                </button>
            </div>
            <hr className="my-4 border-gray-600" />
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-300 mb-4">My Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <p className="text-white text-center">Loading courses...</p>
                    ) : (
                        courses.map((course) => (
                            <div key={course.courseCode} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col transition-transform duration-300 transform hover:scale-105">
                                <div className="relative w-full h-32 mb-4">
                                    <Image
                                        src={'/image.jpeg'}
                                        alt={course.courseTitle}
                                        width={400}
                                        height={300}
                                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold mb-2 text-gray-400">Course Name: {course.courseTitle}</h2>
                                <p className="text-gray-400 mb-2">Course Code: {course.courseCode}</p>
                                <p className="text-gray-400 mb-2">Price: ${course.price}</p>
                                <p className="text-gray-400 mb-4">Overview: {course.overview}</p>
                                <p className="text-gray-400 mb-4">Requirements: {course.requirements}</p>
                                <p className="text-gray-400 mb-4">What We Will Learn: {course.whatWeWillLearn}</p>
                                <p className="text-gray-400 mb-4">Instructor Name: {course.instructor}</p>
                                <p className="text-gray-400 mb-2">Description: {course.description}</p>
                                <div className="mt-auto flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditCourse(course);
                                            setIsAddOpen(true);
                                        }}
                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-400 transition-colors duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.courseCode)}
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-400 transition-colors duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {isAddOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-auto max-h-[90vh] overflow-y-auto" ref={formRef}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{editCourse ? 'Edit Course' : 'Add New Course'}</h2>
                        <form onSubmit={editCourse ? handleUpdate : handleAdd}>
                            <div className="mb-4">
                                <label htmlFor="courseTitle" className="block text-gray-700 mb-2">Course Title</label>
                                <input
                                    type="text"
                                    id="courseTitle"
                                    name="courseTitle"
                                    defaultValue={editCourse?.courseTitle || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="courseCode" className="block text-gray-700 mb-2">Course Code</label>
                                <input
                                    type="text"
                                    id="courseCode"
                                    name="courseCode"
                                    defaultValue={editCourse?.courseCode || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                    required
                                    disabled={editCourse !== null}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imageUrl" className="block text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    defaultValue={editCourse?.imageUrl || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={editCourse?.description || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-gray-700 mb-2">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    defaultValue={editCourse?.price || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="overview" className="block text-gray-700 mb-2">Overview</label>
                                <textarea
                                    id="overview"
                                    name="overview"
                                    defaultValue={editCourse?.overview || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="requirements" className="block text-gray-700 mb-2">Requirements</label>
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    defaultValue={editCourse?.requirements || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="whatWeWillLearn" className="block text-gray-700 mb-2">What We Will Learn</label>
                                <textarea
                                    id="whatWeWillLearn"
                                    name="whatWeWillLearn"
                                    defaultValue={editCourse?.whatWeWillLearn || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                                    disabled={addLoading}
                                >
                                    {editCourse ? 'Update Course' : 'Add Course'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeAddForm}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseList;
