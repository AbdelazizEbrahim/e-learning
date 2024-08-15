'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Chart.js library for bar graph
import 'chart.js/auto'; // Chart.js auto import for the required components
import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [instructorCount, setInstructorCount] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true); // Sidebar state

    useEffect(() => {
        const fetchData = async () => {
    try {
        setLoading(true);

        // Fetch data from all endpoints
        const userResponse = await fetch('/api/auth/signup', { method: 'GET' });
        const studentResponse = await fetch('/api/enroll', { method: 'GET' });
        const courseResponse = await fetch('/api/course', { method: 'GET' });
        const instructorResponse = await fetch('/api/instructors', { method: 'GET' });

        // Check if the responses are successful
        if (!userResponse.ok) throw new Error('Failed to fetch users');
        if (!studentResponse.ok) throw new Error('Failed to fetch students');
        if (!courseResponse.ok) throw new Error('Failed to fetch courses');
        if (!instructorResponse.ok) throw new Error('Failed to fetch instructors');

        // Parse JSON data from responses
        const userData = await userResponse.json();
        const studentData = await studentResponse.json();
        const courseData = await courseResponse.json();
        const instructorData = await instructorResponse.json();

        // Log data for debugging purposes
        console.log('User Data:', userData);
        console.log('Student Data:', studentData);
        console.log('Course Data:', courseData);
        console.log('Instructor Data:', instructorData);

        // Update state with counts
        setUserCount(Array.isArray(userData.users) ? userData.users.length : 0);
        setStudentCount(Array.isArray(studentData.data) ? studentData.data.length : 0);
        setCourseCount(Array.isArray(courseData) ? courseData.length : 0);
        setInstructorCount(Array.isArray(instructorData) ? instructorData.length : 0);

        setLoading(false);
    } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
    }
};


        fetchData();
    }, []);

    const handleCardClick = async (cardType) => {
        try {
            setSelectedCard(cardType);
            setLoading(true);
            let listResponse;

            // Fetch data based on selected card
            switch (cardType) {
                case 'Users':
                    listResponse = await fetch('/api/auth/signup', { method: 'GET' });
                    break;
                case 'Students':
                    listResponse = await fetch('/api/enroll', { method: 'GET' });
                    break;
                case 'Courses':
                    listResponse = await fetch('/api/course', { method: 'GET' });
                    break;
                case 'Instructors':
                    listResponse = await fetch('/api/instructors', { method: 'GET' });
                    break;
                default:
                    break;
            }

            const responseData = await listResponse.json();

            // Process response data based on card type
            if (cardType === 'Users') {
                setListData(Array.isArray(responseData.users) ? responseData.users : []);
            } else if (cardType === 'Students') {
                setListData(Array.isArray(responseData.data) ? responseData.data : []);
            } else if (cardType === 'Courses') {
                setListData(Array.isArray(responseData) ? responseData : []);
            } else if (cardType === 'Instructors') {
                setListData(Array.isArray(responseData) ? responseData : []);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching list data:', error);
            setLoading(false);
        }
    };

    const renderList = () => {
        const renderCard = (item) => {
            return (
                <div key={item.id || item.email} className='bg-gray-800 p-5 rounded-lg shadow-lg text-white min-w-48'>
                    {selectedCard === 'Users' && <p className='text-gray-400 mb-2'>Email: {item.email}</p>}
                    {selectedCard === 'Students' && (
                        <>
                            <p className='text-gray-400 mb-2'>Name: {item.studentName}</p>
                            <p className='text-gray-400 mb-2'>Father's Name: {item.fatherName}</p>
                            <p className='text-gray-400 mb-2'>ID: {item.studentId}</p>
                            <p className='text-gray-400 mb-2'>City: {item.city}</p>
                        </>
                    )}
                    {selectedCard === 'Courses' && (
                        <>
                            <h2 className='text-gray-400 mb-2'>Title: {item.courseTitle}</h2>
                            <p className='text-gray-400 mb-2'>Code: {item.courseCode}</p>
                            <p className='text-gray-400 mb-2'>Inst.: {item.instructor}</p>
                        </>
                    )}
                    {selectedCard === 'Instructors' && (
                        <>
                            <h2 className='text-gray-400 mb-2'>Name: {item.name}</h2>
                            <p className='text-gray-400 mb-2'>Email: {item.email}</p>
                            <p className='text-gray-400 mb-2'>Department: {item.department}</p>
                        </>
                    )}
                </div>
            );
        };

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                {listData.length > 0 ? listData.map(renderCard) : <p>No data available.</p>}
            </div>
        );
    };

    // Data for the bar chart
    const data = {
        labels: ['Users', 'Students', 'Courses', 'Instructors'],
        datasets: [
            {
                label: 'Count',
                data: [userCount, studentCount, courseCount, instructorCount],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Options for the bar chart
    const options = {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='flex'>
            {/* Left Sidebar with Cards */}
            <div className={`fixed top-16 left-0 bottom-16 bg-gray-900 p-4 transition-all duration-300 ${isOpen ? 'w-44' : 'w-12'} shadow-lg`}>
                {/* Toggle Button */}
                <button
                    className={`absolute top-4 right-0 p-2 bg-blue-500 text-white rounded-full ${isOpen ? 'hidden' : 'block'}`}
                    onClick={toggleSidebar}
                >
                    <HiChevronRight className="h-6 w-6" />
                </button>
                <button
                    className={`absolute top-4 left-0 p-2 bg-blue-500 text-white rounded-full ${isOpen ? 'block' : 'hidden'}`}
                    onClick={toggleSidebar}
                >
                    <HiChevronLeft className="h-6 w-6" />
                </button>

                {/* Cards Section */}
                <div className={`flex flex-col space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <div
                        className='bg-white p-4 shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                        onClick={() => handleCardClick('Users')}
                    >
                        <h3 className='text-xl font-semibold'>Users</h3>
                        <p className='text-2xl font-bold'>{userCount}</p>
                    </div>
                    <div
                        className='bg-white p-4 shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                        onClick={() => handleCardClick('Students')}
                    >
                        <h3 className='text-xl font-semibold'>Students</h3>
                        <p className='text-2xl font-bold'>{studentCount}</p>
                    </div>
                    <div
                        className='bg-white p-4 shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                        onClick={() => handleCardClick('Courses')}
                    >
                        <h3 className='text-xl font-semibold'>Courses</h3>
                        <p className='text-2xl font-bold'>{courseCount}</p>
                    </div>
                    <div
                        className='bg-white p-4 shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                        onClick={() => handleCardClick('Instructors')}
                    >
                        <h3 className='text-xl font-semibold'>Instructors</h3>
                        <p className='text-2xl font-bold'>{instructorCount}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 mr-40 p-4 mt-0 justify-start  ${isOpen ? 'ml-12' : 'ml-0'} transition-all duration-300`}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='flex'>
                        <div className='w-1/2 pr-4'>
                            <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
                            {/* Display the chart */}
                            <Bar data={data} options={options} className='mb-8' />
                        </div>
                        <div className='w-1/2'>
                            {/* Display the list data */}
                            {renderList()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
