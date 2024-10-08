'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import 'chart.js/auto';
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
    const [isOpen, setIsOpen] = useState(false); 

    useEffect(() => {
        const reloadedToken = localStorage.getItem('reloadedToken');
        
        if (!reloadedToken) {
          localStorage.setItem('reloadedToken', 'true');
          window.location.reload();
        }
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const userResponse = await fetch('/api/auth/signup', { method: 'GET' });
                const studentResponse = await fetch('/api/userProfile', { method: 'GET' });
                const courseResponse = await fetch('/api/course', { method: 'GET' });
                const instructorResponse = await fetch('/api/instructorProfile', { method: 'GET' });

                if (!userResponse.ok) throw new Error('Failed to fetch users');
                if (!studentResponse.ok) throw new Error('Failed to fetch students');
                if (!courseResponse.ok) throw new Error('Failed to fetch courses');
                if (!instructorResponse.ok) throw new Error('Failed to fetch instructors');

                const userData = await userResponse.json();
                const studentData = await studentResponse.json();
                const courseData = await courseResponse.json();
                const instructorData = await instructorResponse.json();

                setUserCount(Array.isArray(userData.users) ? userData.users.length : 0);
                setStudentCount(Array.isArray(studentData) ? studentData.length : 0);
                setCourseCount(Array.isArray(courseData) ? courseData.length : 0);
                setInstructorCount(Array.isArray(instructorData.data) ? instructorData.data.length : 0);

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

            switch (cardType) {
                case 'Users':
                    listResponse = await fetch('/api/auth/signup', { method: 'GET' });
                    break;
                case 'Students':
                    listResponse = await fetch('/api/userProfile', { method: 'GET' });
                    break;
                case 'Courses':
                    listResponse = await fetch('/api/course', { method: 'GET' });
                    break;
                case 'Instructors':
                    listResponse = await fetch('/api/instructorProfile', { method: 'GET' });
                    break;
                default:
                    break;
            }

            const responseData = await listResponse.json();

            if (cardType === 'Users') {
                setListData(Array.isArray(responseData.users) ? responseData.users : []);
            } else if (cardType === 'Students') {
                setListData(Array.isArray(responseData) ? responseData : []);
            } else if (cardType === 'Courses') {
                setListData(Array.isArray(responseData) ? responseData : []);
            } else if (cardType === 'Instructors') {
                setListData(Array.isArray(responseData.data) ? responseData.data : []);
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
                <div key={item.id || item.email} className='bg-gray-800 p-3 rounded-lg shadow-lg text-white'>
                    {selectedCard === 'Users' && (<><p className='text-gray-400 mb-2'>Email: {item.email}</p>
                                                 <p className='text-gray-400 mb-2'>Role: {item.role}</p></>)
                    }
                    {selectedCard === 'Students' && (
                        <>
                            <p className='text-gray-400 mb-2'>Full Name: {item.fullName}</p>
                            <p className='text-gray-400 mb-2'>Email: {item.email}</p>
                            <p className='text-gray-400 mb-2'>ID: {item.studentId}</p>
                            <p className='text-gray-400 mb-2'>City: {item.city}</p>
                            <p className='text-gray-400 mb-2'>Age: {item.age}</p>
                            <p className='text-gray-400 mb-2'>Gender: {item.gender}</p>
                        </>
                    )}
                    {selectedCard === 'Courses' && (
                        <>
                            <h2 className='text-gray-400 mb-2'>Title: {item.courseTitle}</h2>
                            <p className='text-gray-400 mb-2'>Code: {item.courseCode}</p>
                            <p className='text-gray-400 mb-2'>Instructor: {item.instructor}</p>
                            <p className='text-gray-400 mb-2'>Price: ${item.price}</p>
                        </>
                    )}
                    {selectedCard === 'Instructors' && (
                        <>
                            <h2 className='text-gray-400 mb-2'>Full Name: {item.fullName}</h2>
                            <p className='text-gray-400 mb-2'>Job Title: {item.jobTitle}</p>
                            <p className='text-gray-400 mb-2'>Email: {item.email}</p>
                            <p className='text-gray-400 mb-2'>ID: {item.instructorId}</p>
                            <p className='text-gray-400 mb-2'>Age: {item.age}</p>
                            <p className='text-gray-400 mb-2'>City: {item.city}</p>
                        </>
                    )}
                </div>
            );
        };

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 mr-20'>
                {listData.length > 0 ? listData.map(renderCard) : <p>No data available.</p>}
            </div>
        );
    };

    const data = {
        labels: ['Users', 'Students', 'Courses', 'Instructors'],
        datasets: [
            {
                label: 'Count',
                data: [userCount, studentCount, courseCount, instructorCount],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 20,
            },
        ],
    };

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
        <div className='flex min-w-32'>
            <div className={`fixed top-16 left-0 bottom-16 bg-gray-900 p-2 transition-all duration-300 ${isOpen ? 'lg:w-44 w-24' : 'w-12'} shadow-lg`}>
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
            <div className={`flex flex-col mt-12 space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
                <div
                className='bg-white p-2 lg:p-4 shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                onClick={() => handleCardClick('Users')}
                >
                <h3 className='text-small lg:text-xl lg:font-semibold '>Users</h3>
                <p className='text-2xl font-bold'>{userCount}</p>
                </div>
                <div
                className='p-2 lg:p-4 bg-white shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                onClick={() => handleCardClick('Students')}
                >
                <h3 className='text-small lg:text-xl -ml-2 font-semibold'>Student</h3>
                <p className='text-2xl font-bold'>{studentCount}</p>
                </div>
                <div
                className='p-2 lg:p-4 bg-white shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                onClick={() => handleCardClick('Courses')}
                >
                <h3 className='text-small lg:text-xl font-semibold'>Courses</h3>
                <p className='text-2xl font-bold'>{courseCount}</p>
                </div>
                <div
                className='p-2 lg:p-4 bg-white shadow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer'
                onClick={() => handleCardClick('Instructors')}
                >
                <h3 className='text-small lg:text-xl -ml-2 font-semibold'>Instructor</h3>
                <p className='text-2xl font-bold'>{instructorCount}</p>
                </div>
            </div>
            </div>
            <div className={`flex-1 mr-72 lg:mr-40 p-0 mt-0 justify-start ${isOpen ? 'lg:ml-12 -ml-20' : 'lg:ml-0 -ml-20'} transition-all duration-300`}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='flex flex-col lg:flex-row'>
                        <div className='w-full lg:w-1/2 '>
                            <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
                            <Bar data={data} options={options} className='mb-8'  />
                        </div>
                        <div className='w-full lg:w-1/2 m-4 mr-12'>
                            {renderList()}
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
