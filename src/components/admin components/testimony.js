'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const TestimonyList = () => {
    const [testimonies, setTestimonies] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);
    const [editTestimony, setEditTestimony] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchTestimonies = async () => {
            try {
                const response = await fetch('/api/testimonies');
                if (!response.ok) {
                    throw new Error('Failed to fetch testimonies');
                }
                const data = await response.json();
                setTestimonies(data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setTestimonies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonies();

        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsAddOpen(false);
                setEditTestimony(null);
            }
        };

        if (isAddOpen || editTestimony) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAddOpen, editTestimony]);

    const openAddForm = () => {
        setIsAddOpen(true);
    };

    const closeAddForm = () => {
        setIsAddOpen(false);
        setEditTestimony(null);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const { Name, imageUrl, testimony } = e.target.elements;
        setAddLoading(true);
        try {
            const response = await fetch('/api/testimonies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: Name.value,
                    imageUrl: imageUrl.value,
                    testimony: testimony.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add testimony');
            }

            const testimonyResponse = await fetch('/api/testimonies');
            const data = await testimonyResponse.json();
            setTestimonies(data || []);
            closeAddForm();
        } catch (error) {
            console.error('Error adding testimony:', error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { Name, imageUrl, testimony } = e.target.elements;
        if (!editTestimony) return;

        setAddLoading(true);
        try {
            const response = await fetch(`/api/testimonies?id=${editTestimony._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: Name.value,
                    imageUrl: imageUrl.value,
                    testimony: testimony.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update testimony');
            }

            const testimonyResponse = await fetch('/api/testimonies');
            const data = await testimonyResponse.json();
            setTestimonies(data || []);
            setEditTestimony(null);
            closeAddForm();
        } catch (error) {
            console.error('Error updating testimony:', error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete the testimony by ${name}?`)) {
            try {
                const response = await fetch(`/api/testimonies?name=${encodeURIComponent(name)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete testimony');
                }
    
                const testimonyResponse = await fetch('/api/testimonies');
                const data = await testimonyResponse.json();
                setTestimonies(data || []);
            } catch (error) {
                console.error('Error deleting testimony:', error);
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
                    Add Testimony
                </button>
            </div>
            <hr className="my-4 border-gray-600" />
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-300 mb-4">Testimonies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <p className="text-white text-center">Loading testimonies...</p>
                    ) : (
                        testimonies.map((testimony) => (
                            <div key={testimony._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col transition-transform duration-300 transform hover:scale-105">
                                <div className="relative w-full flex justify-center mb-4">
                                    <Image
                                        src={testimony.imageUrl}
                                        alt={testimony.Name}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-300 text-center">{testimony.Name}</h2>
                                <p className="text-gray-400 mb-4 text-center">{testimony.testimony}</p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditTestimony(testimony);
                                            setIsAddOpen(true);
                                        }}
                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-400 transition-colors duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimony.Name)}
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{editTestimony ? 'Edit Testimony' : 'Add New Testimony'}</h2>
                        <form onSubmit={editTestimony ? handleUpdate : handleAdd}>
                            <div className="mb-4">
                                <label htmlFor="Name" className="block text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    defaultValue={editTestimony?.Name || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imageUrl" className="block text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    defaultValue={editTestimony?.imageUrl || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="testimony" className="block text-gray-700 mb-2">Testimony</label>
                                <textarea
                                    id="testimony"
                                    name="testimony"
                                    defaultValue={editTestimony?.testimony || ''}
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                                    disabled={addLoading}
                                >
                                    {editTestimony ? 'Update Testimony' : 'Add Testimony'}
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

export default TestimonyList;
