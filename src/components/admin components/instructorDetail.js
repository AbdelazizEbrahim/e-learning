'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import RightSideBar from '@/components/admin components/rightBar';

const InstructorDetail = () => {
    const [userCount, setUserCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [visibleDocuments, setVisibleDocuments] = useState({});
    const [instructorCount, setInstructorCount] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [documentPaths, setDocumentPaths] = useState({});
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true); // Sidebar state

    useEffect(() => {
        // Check if the "reloadedToken" is found in localStorage
        const reloadedToken = localStorage.getItem('reloadedToken');
        
        if (!reloadedToken) {
          // If "reloadedToken" is not found, reload the page
          localStorage.setItem('reloadedToken', 'true');
          window.location.reload();
        }
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch data from all endpoints
                const userResponse = await fetch('/api/auth/signup', { method: 'GET' });
                const studentResponse = await fetch('/api/userProfile', { method: 'GET' });
                const adminResponse = await fetch('/api/admin', { method: 'GET' });
                const instructorResponse = await fetch('/api/instructorProfile', { method: 'GET' });

                // Check if the responses are successful
                if (!userResponse.ok) throw new Error('Failed to fetch users');
                if (!studentResponse.ok) throw new Error('Failed to fetch students');
                if (!adminResponse.ok) throw new Error('Failed to fetch adminss');
                if (!instructorResponse.ok) throw new Error('Failed to fetch instructors');

                // Parse JSON data from responses
                const userData = await userResponse.json();
                const studentData = await studentResponse.json();
                // console.log("student: ", studentData)
                const adminData = await adminResponse.json();
                // console.log("admin: ", adminData)
                const instructorData = await instructorResponse.json();

                // Update state with counts
                setUserCount(Array.isArray(userData.users) ? userData.users.length : 0);
                setStudentCount(Array.isArray(studentData) ? studentData.length : 0);
                setAdminCount(Array.isArray(adminData) ? adminData.length : 0);
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

            // Fetch data based on selected card
            switch (cardType) {
                case 'Users':
                    listResponse = await fetch('/api/auth/signup', { method: 'GET' });
                    break;
                case 'Students':
                    listResponse = await fetch('/api/userProfile', { method: 'GET' });
                    break;
                case 'Admins':
                    listResponse = await fetch('/api/admin', { method: 'GET' });
                    break;
                case 'Instructors':
                    listResponse = await fetch('/api/instructorProfile', { method: 'GET' });
                    break;
                default:
                    break;
            }

            const responseData = await listResponse.json();

            // Process response data based on card type
            if (cardType === 'Users') {
                setListData(Array.isArray(responseData.users) ? responseData.users : []);
            } else if (cardType === 'Students') {
                setListData(Array.isArray(responseData) ? responseData : []);
            } else if (cardType === 'Admins') {
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

    const handleApprove = async (email) => {
        try {
            // console.log(`Approving instructor with email: ${email}`);
            const response = await fetch(`/api/instructorProfile?email=${email}&isApproved=true`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, isApproved: true }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to approve instructor');
            }
    
            // console.log(`Instructor with email ${email} approved successfully.`);
            setListData((prevListData) =>
                prevListData.map((item) =>
                    item.email === email ? { ...item, isApproved: true } : item
                )
            );
        } catch (error) {
            console.error('Error approving instructor:', error);
        }
    };
    
    const handleDocumentClick = async (email) => {
        try {
            // console.log(`Fetching documents for email: ${email}`);
            setLoading(true);
    
            // Construct query string to pass the email to the API
            const queryString = new URLSearchParams({ email }).toString();
            const response = await fetch(`/api/instructorFiles?${queryString}`);

            // console.log("Received document response:", response);

    
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
    
            // Parse the JSON data
            const data = await response.json();
            // console.log("Received document data:", data);
    
            // Extract fileDetails from the API response
            const { files } = data;
            // console.log("File details:", files);
    
            setLoading(false);
    
            // Check if fileDetails is available and has data
            if (files && files.length > 0) {
                const paths = {};
    
                files.forEach(file => {
                    if (file.fileComponent === 'cv') {
                        paths.cv = file.filePath; 
                    } else if (file.fileComponent === 'degree') {
                        paths.degree = file.filePath; 
                    }
                });
    
                // console.log("Document paths:", paths);
                setDocumentPaths(paths); 
    
                setVisibleDocuments((prev) => ({
                    ...prev,
                    [email]: !prev[email],  
                }));
            } else {
                alert('No documents found.');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setLoading(false);
        }
    };
    
    
    
    const renderList = () => {
        const renderCard = (item) => {
            return (
                <div key={item.id || item.email} className='bg-gray-800 p-5 rounded-lg shadow-lg text-white w-auto'>
                    <div>
                        <h2 className='text-gray-400 mb-2 max-w-auto'>Full Name: {item.fullName}</h2>
                        <p className='text-gray-400 mb-2'>Job Title: {item.jobTitle}</p>
                        <p className='text-gray-400 mb-2'>Email: {item.email}</p>
                        <p className='text-gray-400 mb-2'>ID: {item.instructorId}</p>
                        <p className='text-gray-400 mb-2'>Age: {item.age}</p>
                        <p className='text-gray-400 mb-2'>City: {item.city}</p>
                    </div>
    
                    <div className=' -ml-3'>
                        <button
                            onClick={() => handleApprove(item.email)}
                            disabled={item.isApproved}
                            className={`${
                                item.isApproved ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'
                            } mr-2 text-white py-2 px-2 rounded hover:bg-white/50 transition-colors duration-300`}
                        >
                            {item.isApproved ? 'Approved' : 'Approve'}
                        </button>
                        <button
                            onClick={() => handleDocumentClick(item.email)}
                            className="bg-blue-600 text-white py-2 px-2 rounded hover:bg-white/50 transition-colors duration-300"
                        >
                            Document
                        </button>
                    </div>
    
                    {visibleDocuments[item.email] && (
                        <div className="flex space-x-2 mt-2">
                            {documentPaths.degree && (
                                <a 
                                    href={documentPaths.degree} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-purple-600 text-white py-2 px-2 rounded hover:bg-white/50 transition-colors duration-300"
                                >
                                    Degree
                                </a>
                            )}
                            {documentPaths.cv && (
                                <a 
                                    href={documentPaths.cv} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white py-2 px-2 rounded hover:bg-white/50 transition-colors duration-300"
                                >
                                    CV
                                </a>
                            )}
                        </div>
                    )}

                </div>
            );
        };
    
        return (
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 -mr-24'>
                {listData.length > 0 ? listData.map(renderCard) : <p>No data available.</p>}
            </div>
        );
    };
    

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className=''>
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
                        onClick={() => handleCardClick('Admins')}
                    >
                        <h3 className='text-xl font-semibold'>Admins</h3>
                        <p className='text-2xl font-bold'>{adminCount}</p>
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
            <div> 
            <h1 className='text-2xl font-bold mb-4 ml-48'>User Actions</h1>
            </div>
            <div className={`flex-1 mr-40 p-4 mt-0 justify-start ${isOpen ? 'ml-48' : 'ml-16'} transition-all duration-300`}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='flex'>
                        <div className=''>
                            {/* Display the list data */}
                            {renderList()}
                        </div>
                    </div>
                )}
            </div>
            <div>
            <RightSideBar/>
            </div>
        </div>
    );
};

export default InstructorDetail;
