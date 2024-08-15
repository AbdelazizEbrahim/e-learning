'use client';

import React, { useState, useEffect } from 'react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});

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

    const openUpdateForm = (course) => {
        setSelectedCourse(course);
        setIsUpdateOpen(true);
    };

    const closeUpdateForm = () => {
        setIsUpdateOpen(false);
        setSelectedCourse(null);
    };

    const openAddForm = () => {
        setIsAddOpen(true);
    };

    const closeAddForm = () => {
        setIsAddOpen(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { courseTitle, instructor } = e.target.elements;
        setUpdateLoading(true);
        try {
            await fetch('/api/course', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseTitle: courseTitle.value,
                    courseCode: selectedCourse.courseCode, // Use course code for update
                    instructor: instructor.value,
                }),
            });
            const response = await fetch('/api/course');
            const data = await response.json();
            setCourses(data);
            closeUpdateForm();
        } catch (error) {
            console.error('Error updating course:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const { courseTitle, courseCode, instructor } = e.target.elements;
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
                    instructor: instructor.value,
                }),
            });
            const response = await fetch('/api/course');
            const data = await response.json();
            setCourses(data);
            closeAddForm();
        } catch (error) {
            console.error('Error adding course:', error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (courseCode) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setDeleteLoading(prev => ({ ...prev, [courseCode]: true }));
            try {
                const response = await fetch('/api/course', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ courseCode }), // Use course code for delete
                });
                if (response.ok) {
                    const updatedCourses = await fetch('/api/course').then(res => res.json());
                    setCourses(updatedCourses);
                } else {
                    console.log('Failed to delete course');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
            } finally {
                setDeleteLoading(prev => ({ ...prev, [courseCode]: false }));
            }
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={openAddForm}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                >
                    Add Course
                </button>
            </div>
            <hr className="my-4 border-gray-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    <p className="text-white text-center">Loading...</p>
                ) : (
                    courses.map((course) => (
                        <div key={course.courseCode} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col">
                            <h2 className="text-xl font-semibold mb-2">Course Name: {course.courseTitle}</h2>
                            <p className="text-gray-400 mb-2">Course Code: {course.courseCode}</p>
                            <p className="text-gray-400 mb-4">Instructor Name: {course.instructor}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => openUpdateForm(course)}
                                    className={`bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-400 transition-colors duration-300 ${updateLoading ? 'cursor-wait opacity-50' : ''}`}
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Updating...' : 'Update'}
                                </button>
                                <button
                                    onClick={() => handleDelete(course.courseCode)} // Use course code for delete
                                    className={`bg-red-600 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-300 ${deleteLoading[course.courseCode] ? 'cursor-wait opacity-50' : ''}`}
                                    disabled={deleteLoading[course.courseCode]}
                                >
                                    {deleteLoading[course.courseCode] ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Update Form Popup */}
            {isUpdateOpen && selectedCourse && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Update Course</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Course Name</label>
                                <input
                                    type="text"
                                    name="courseTitle"
                                    defaultValue={selectedCourse.courseTitle}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Course Code</label>
                                <input
                                    type="text"
                                    name="courseCode"
                                    defaultValue={selectedCourse.courseCode}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    readOnly // Make the course code field uneditable
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Instructor Name</label>
                                <input
                                    type="text"
                                    name="instructor"
                                    defaultValue={selectedCourse.instructor}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeUpdateForm}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${updateLoading ? 'cursor-wait opacity-50' : ''}`}
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Add Course Popup */}
            {isAddOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Add Course</h2>
                        <form onSubmit={handleAdd}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Course Name</label>
                                <input
                                    type="text"
                                    name="courseTitle"
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Course Code</label>
                                <input
                                    type="text"
                                    name="courseCode"
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Instructor Name</label>
                                <input
                                    type="text"
                                    name="instructor"
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeAddForm}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-green-500 text-white px-4 py-2 rounded-lg ${addLoading ? 'cursor-wait opacity-50' : ''}`}
                                    disabled={addLoading}
                                >
                                    {addLoading ? 'Adding...' : 'Add'}
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