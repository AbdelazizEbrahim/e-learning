'use client';

import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { MdDelete } from 'react-icons/md';

const PaymentPage = () => {
    const [courses, setCourses] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        email: '',
        instructorId: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let email = '';
            const token = localStorage.getItem("authToken");
            const decoded = jwt.decode(token);
            if (decoded && decoded.email) {
                email = decoded.email;
            }

            if (email) {
                try {
                    // Fetch courses with pending or failed payment status
                    const response = await fetch(`/api/cart?userEmail=${email}&paymentStatus=Pending`);
                    const data = await response.json();
                    console.log('data', data);
                    setCourses(data);

                    // Calculate total price
                    const total = data.reduce((sum, course) => sum + course.price, 0);
                    setTotalPrice(total);

                } catch (error) {
                    console.error('Error fetching courses:', error);
                }

                try {
                    // Fetch instructor profile
                    const profileResponse = await fetch(`/api/instructorProfile?email=${email}`);
                    const profileData = await profileResponse.json();
                    console.log("data:", profileData)
                    setUserProfile(profileData.data);
                } catch (error) {
                    console.error('Error fetching instructor profile:', error);
                }
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (courseCode) => {
        const email = userProfile.email;

        if (window.confirm("Are you sure you want to delete this course from your cart?")) {
            try {
                const response = await fetch(`/api/cart?userEmail=${email}&courseCode=${courseCode}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log("data: ", response.json());

                if (!response.ok) {
                    throw new Error('Failed to delete course');
                }

                setCourses(courses.filter(course => course.courseCode !== courseCode));
                const total = courses.reduce((sum, course) => sum + course.price, 0);
                setTotalPrice(total);

            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const handlePayment = async () => {
        setLoading(true); // Start loading

        const paymentData = {
            totalPrice: totalPrice.toFixed(2),
            email: userProfile.email,
            fullName: userProfile.fullName,
            phoneNumber: "0975805980"
        };

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (data.status === 'success') {
                window.location.href = data.data.checkout_url; 
            } else {
                console.error('Payment initiation failed:', data.message);
            }
        } catch (error) {
            console.error('Error during payment initiation:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left card: List of courses */}
            <div className="bg-white p-6 rounded-lg shadow-lg ml-12">
                <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
                {courses.length > 0 ? (
                    <ul>
                        {courses.map((course) => (
                            <li key={course.id} className="mb-4 p-4 border-b border-gray-300 flex items-center">
                                <img
                                    src={'/image.jpeg'}
                                    alt={course.courseTitle}
                                    className="w-16 h-16 rounded-full mr-4 object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-gray-600">Course Code: {course.courseCode}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-600">Price: ${course.price}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(course.courseCode)}
                                    className="ml-4 text-black hover:text-red-700"
                                >
                                    <MdDelete className="h-6 w-6" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses found.</p>
                )}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Total Price: ${totalPrice}</h3>
                </div>
                <button
                    onClick={handlePayment}
                    className={`mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>

            {/* Right card: User profile */}
            <div className="bg-white p-6 rounded-lg shadow-lg mr-12">
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={userProfile.fullName}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={userProfile.email}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Instructor ID</label>
                        <input
                            type="text"
                            value={userProfile.instructorId}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={userProfile.city}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                            readOnly
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
