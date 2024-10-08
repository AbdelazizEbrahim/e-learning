'use client';

import React, { useState, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const RightSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingEmail, setLoadingEmail] = useState(null); // Track loading state for each email

    const toggleSidebar = () => {
        setIsOpen(prevIsOpen => {
            const newIsOpen = !prevIsOpen;
            if (newIsOpen) {
                // console.log('Sidebar opened, fetching messages...');
                fetchMessages();
            }
            return newIsOpen;
        });
    };

    const fetchMessages = async () => {
        // console.log('Starting to fetch messages...');
        try {
            const res = await fetch('/api/feedback?limit=3&read=false');
            // console.log('Fetch response:', res);

            if (!res.ok) {
                console.error('Failed to fetch messages, status:', res.statusText);
                return; // Exit if fetch fails
            }

            const data = await res.json();
            // console.log('Fetched data:', data);

            if (data.success) {
                setMessages(data.data); // Set messages from data
            } else {
                throw new Error('Failed to fetch messages');
            }

        } catch (error) {
            console.error('Error occurred while fetching messages:', error);
            setMessages([]);
        }
    };

    const markAsRead = async (email) => {
        // console.log('Marking message as read for email:', email);
        setLoadingEmail(email); // Set loading for the specific email
        try {
            const res = await fetch(`/api/feedback`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, read: true }), // Update based on email
            });

            // console.log('Mark as read response:', res);

            if (!res.ok) {
                console.error('Failed to mark message as read, status:', res.statusText);
                throw new Error('Failed to mark message as read');
            }

            // Immediately update the UI by removing the read message
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.filter(msg => msg.email !== email);
                // console.log('Updated messages after read:', updatedMessages);
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error occurred while marking message as read:', error);
        } finally {
            setLoadingEmail(null); // Reset loading state
        }
    };

    useEffect(() => {
        if (isOpen) {
            // console.log('Sidebar is open, fetching messages...');
            fetchMessages();
        }
    }, [isOpen]);

    return (
        <div className={`hidden lg:block md:block fixed top-16 right-0 bottom-16 bg-black p-4 transition-all duration-300 ${isOpen ? 'w-48' : 'w-10'} shadow-lg`}>
            {/* Toggle Button */}
            <button
                className={`absolute top-4 -left-3 p-2 bg-blue-500 text-white rounded-full ${isOpen ? 'hidden' : 'block'}`}
                onClick={toggleSidebar}
            >
                <HiChevronRight className="h-6 w-6" />
            </button>
            <button
                className={`absolute top-4 right-0 p-2 bg-blue-500 text-white rounded-full ${isOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            >
                <HiChevronLeft className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className={`flex flex-col space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
                {messages.length === 0 ? (
                    <div className="text-white">No unread messages</div>
                ) : (
                    messages.map((message) => (
                        <div key={message.email} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">{message.email}</h3>
                            <p className="text-gray-700">{message.message}</p>
                            <button
                                onClick={() => markAsRead(message.email)}
                                className={`mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${loadingEmail === message.email ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loadingEmail === message.email} // Disable button if loading
                            >
                                {loadingEmail === message.email ? 'Loading...' : 'Read'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RightSideBar;