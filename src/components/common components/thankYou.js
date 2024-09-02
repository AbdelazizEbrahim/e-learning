'use client';

import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const ThankYouPage = () => {
    const router = useRouter();

    useEffect(() => {
        const handleUpdateAndClearCart = async () => {
            let email = '';
            let role = '';
            const token = localStorage.getItem("authToken");
            const decoded = jwt.decode(token);
            if (decoded && decoded.email) {
                email = decoded.email;
                role = decoded.role;
            }

            if (email) {
                try {
                    console.log("Starting update process...");
                    console.log("Decoded email from token: ", email);

                    // Update all courses in the cart for the user to PAID
                    const updateResponse = await fetch('/api/enrollment', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userEmail: email,
                            paymentStatus: 'PAID',
                        }),
                    });

                    if (!updateResponse.ok) {
                        console.log('Failed to update enrollment items');
                        const errorData = await updateResponse.json();
                        console.error('Response Error:', errorData);
                        return;
                    }

                    console.log('Cart items updated successfully');
                    // Delete cart items
                    const deleteResponse = await fetch(`/api/cart?userEmail=${email}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (deleteResponse.ok) {
                        console.log('Cart items deleted successfully');
                    } else {
                        console.log('Failed to delete cart items');
                        const errorData = await deleteResponse.json();
                        console.error('Response Error:', errorData);
                    }
                } catch (error) {
                    console.error('Error updating or deleting cart items:', error);
                }
            } else {
                console.log("No email found in token.");
            }

            // Redirect after a short delay
            setTimeout(() => {
                if (role === 'user') {
                    console.log("Redirecting to the user page...");
                    router.push('/user');
                } else if (role === 'instructor') {
                    console.log("Redirecting to the instructor page...");
                    router.push('/instructor');
                }
            }, 3000);
        };

        handleUpdateAndClearCart();
    }, [router]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h2>
                <p className="text-gray-600">You have successfully completed the payment.</p>
                <p className="text-gray-600">You will be redirected shortly.</p>
            </div>
        </div>
    );
};

export default ThankYouPage;
