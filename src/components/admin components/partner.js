'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const PartnerList = () => {
    const [partners, setPartners] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);
    const [editPartner, setEditPartner] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch('/api/partners');
                if (!response.ok) {
                    throw new Error('Failed to fetch partners');
                }
                const data = await response.json();
                console.log("data: ", data)
                setPartners(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPartners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();

        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsAddOpen(false);
                setEditPartner(null);
            }
        };

        if (isAddOpen || editPartner) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAddOpen, editPartner]);

    const openAddForm = () => setIsAddOpen(true);
    const closeAddForm = () => {
        setIsAddOpen(false);
        setEditPartner(null);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const { Name, imageUrl, description } = e.target.elements;
        setAddLoading(true);
        try {
            const response = await fetch('/api/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: Name.value.trim(),
                    imageUrl: imageUrl.value.trim(),
                    description: description.value.trim(),
                }),
            });

            if (!response.ok) throw new Error('Failed to add partner');

            const data = await response.json();
            setPartners((prev) => [...prev, data.data]);
            closeAddForm();
        } catch (error) {
            console.error('Error adding partner:', error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { Name, imageUrl, description } = e.target.elements;
        if (!editPartner) return;

        setAddLoading(true);
        try {
            const response = await fetch(`/api/partners`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: Name.value.trim(),
                    imageUrl: imageUrl.value.trim(),
                    description: description.value.trim(),
                }),
            });

            if (!response.ok) throw new Error('Failed to update partner');

            const data = await response.json();
            setPartners((prev) =>
                prev.map((partner) =>
                    partner.Name === data.data.Name ? data.data : partner
                )
            );
            closeAddForm();
        } catch (error) {
            console.error('Error updating partner:', error);
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (Name) => {
        if (!window.confirm("Are you sure you want to delete this partner?")) return;

        try {
            const response = await fetch(`/api/partners`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name }),
            });

            if (!response.ok) throw new Error('Failed to delete partner');

            setPartners((prev) => prev.filter((partner) => partner.Name !== Name));
        } catch (error) {
            console.error('Error deleting partner:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={openAddForm}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300"
                >
                    Add Partner
                </button>
            </div>
            <hr className="my-4 border-gray-600" />
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-300 mb-4">Partners</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <p className="text-white text-center">Loading partners...</p>
                    ) : (
                        partners.map((partner) => (
                            <div key={partner._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col transition-transform duration-300 transform hover:scale-105">
                                <div className="relative w-full flex justify-center mb-4">
                                    <Image
                                        src={partner.imageUrl}
                                        alt={partner.Name}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-300 text-center">{partner.Name}</h2>
                                <p className="text-gray-400 mb-4 text-center">{partner.description}</p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setEditPartner(partner)}
                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-400 transition-colors duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(partner.Name)}
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

            {(isAddOpen || editPartner) && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50"
                >
                    <div
                        ref={formRef}
                        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-[75vh] relative"
                    >
                        <button
                            onClick={closeAddForm}
                            className="absolute top-2 right-2 text-red-500 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <form onSubmit={editPartner ? handleUpdate : handleAdd}>
                            <h2 className="text-2xl font-bold mb-4">{editPartner ? 'Edit Partner' : 'Add Partner'}</h2>
                            <div className="mb-4">
                                <label htmlFor="Name" className="block font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    defaultValue={editPartner?.Name || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imageUrl" className="block font-bold mb-2">Image URL</label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    defaultValue={editPartner?.imageUrl || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block font-bold mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    defaultValue={editPartner?.description || ''}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button
                                    type="submit"
                                    disabled={addLoading}
                                    className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300 ${addLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {addLoading ? 'Processing...' : editPartner ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerList;
