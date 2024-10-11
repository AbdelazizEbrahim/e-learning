'use client';

import React, { useState, useRef, useEffect } from 'react';
import RightSideBar from '@/components/admin components/rightBar';

const AboutPageForm = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [textEntry, setTextEntry] = useState(null);
    const [aboutTexts, setAboutTexts] = useState([]);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const response = await fetch('/api/aboutText');
                const data = await response.json();
                console.log("data: ", data
                setAboutTexts(data.data.sort((a, b) => b.priority - a.priority)); // Sort by priority, descending
            } catch (error) {
                console.error('Error fetching texts:', error);
            }
        };

        fetchTexts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsFormOpen(false);
                setTextEntry(null);
            }
        };

        if (isFormOpen || textEntry) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFormOpen, textEntry]);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => {
        setIsFormOpen(false);
        setTextEntry(null);
    };

    // Handle form submission for adding new entry
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, body, priority } = e.target.elements;
        setLoading(true);
    
        try {
            let response;
            if (textEntry) {
                // Handle editing an existing entry (PUT)
                response = await fetch(`/api/aboutText?title=${textEntry.title}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mainBody: body.value.trim(),
                        priority: parseInt(priority.value.trim(), 10),
                    }),
                });
            } else {
                // Handle adding a new entry (POST)
                response = await fetch('/api/aboutText', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title.value.trim(),
                        mainBody: body.value.trim(),
                        priority: parseInt(priority.value.trim(), 10),
                    }),
                });
            }
    
            if (!response.ok) throw new Error('Failed to submit data');
            const data = await response.json();
    
            // Update the aboutTexts state
            setAboutTexts(prev =>
                textEntry
                    ? prev.map((item) => (item.title === textEntry.title ? data.data : item))
                    : [data.data, ...prev].sort((a, b) => b.priority - a.priority)
            );
    
            closeForm();
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);
        }
    };
    

    // Handle delete action
    const handleDelete = async (title) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the entry with the title "${title}"?`);
    
        if (!isConfirmed) return; // If the user cancels, exit the function
    
        try {
            const response = await fetch(`/api/aboutText?title=${title}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete text');
            setAboutTexts(prev => prev.filter(text => text.title !== title));
        } catch (error) {
            console.error('Error deleting text:', error);
        }
    };
    

    // Handle edit action (open form pre-filled with existing data)
    const handleEdit = (text) => {
        setTextEntry(text);
        setIsFormOpen(true);
    };

    return (
       <>
        <RightSideBar />
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={openForm}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                >
                    Add About Entry
                </button>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
                    <div
                        ref={formRef}
                        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative"
                    >
                        <button
                            onClick={closeForm}
                            className="absolute top-2 right-2 text-red-500 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-2xl font-bold mb-4">
                                {textEntry ? 'Edit About Entry' : 'Add About Entry'}
                            </h2>
                            <div className="mb-4">
                                <label htmlFor="title" className="block font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    defaultValue={textEntry?.title || ''}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="body" className="block font-bold mb-2">Main Body</label>
                                <textarea
                                    id="body"
                                    name="body"
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    defaultValue={textEntry?.mainBody || ''}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="priority" className="block font-bold mb-2">Priority (1-10)</label>
                                <input
                                    type="number"
                                    id="priority"
                                    name="priority"
                                    min="1"
                                    max="10"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    defaultValue={textEntry?.priority || ''}
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Processing...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Display texts based on priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 lg:mr-28">
            {aboutTexts.map((text) => (
                    <div key={text._id} className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">{text.title}</h3>
                        <p className="mb-2">{text.mainBody}</p>
                        <p className="text-sm text-gray-500">Priority: {text.priority}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => handleEdit(text)}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-400 transition-colors duration-300"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(text.title)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-400 transition-colors duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
       </>
    );
};

export default AboutPageForm;
