'use client';

import { useState, useEffect } from 'react';
import { FaCamera, FaPlus } from 'react-icons/fa';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AccountSettings = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    adminName: '',
    fatherName: '',
    adminEmail: '',
    password: '',
    phoneNumber: '',
    city: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); 
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProfileData = async (email) => {
      try {
        const response = await fetch(`/api/admin?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
        setFormData({
          adminName: data.adminName,
          fatherName: data.fatherName,
          adminEmail: email,
          phoneNumber: data.phoneNumber,
          city: data.city
        });
      } catch (error) {
        setError(error.message);
        console.error('Error fetching profile data:', error.message);
      }
    };
  
    const fetchProfileImage = async (email) => {
      try {
        const response = await fetch(`/api/photo?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.data?.imageUrl || null);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
  
    if (activeForm === 'viewProfile' || activeForm === 'updateProfile') {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = jwt.decode(token);
        const email = decoded.email;
        if (email) {
          fetchProfileData(email);
          fetchProfileImage(email);
        }
      }
    }
  }, [activeForm]);
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const decoded = jwt.decode(token);
      const email = decoded.email;
      const response = await fetch(`/api/photo?email=${email}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.data.imageUrl); 
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (event) => {
  
    const file = event.target.files[0];
  
    if (!file) {
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', file);
  
    try {
      setLoading(true);
  
      const token = localStorage.getItem('authToken');
  
      const decoded = jwtDecode(token);
  
      const email = decoded.email;
  
      const response = await fetch(`/api/photo?email=${email}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.imageUrl);
      } else {
        console.error('Image update failed, response status:', response.status);
      }
    } catch (error) {
      console.error('Error updating image:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
    if (formName === 'changePassword') {
      setFormData(prevData => ({
        ...prevData,
        password: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
    if (formName === 'deleteAccount') {
      setShowConfirmDelete(false);
    }
  };

  const handleClose = () => {
    setActiveForm(null);
    setError(null);
    setShowConfirmDelete(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const email = jwt.decode(token)?.email;

      let response;
      if (activeForm === 'updateProfile') {
        response = await fetch(`/api/admin?email=${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            adminName: formData.adminName,
            fatherName: formData.fatherName,
            adminEmail: formData.adminEmail,
            phoneNumber: formData.phoneNumber,
            city: formData.city
          })
        });
      } else if (activeForm === 'changePassword') {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          console.error('Passwords do not match');
          setLoading(false);
          return;
        }
        response = await fetch(`/api/auth/signup`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email,
            password: formData.currentPassword,
            newPassword: formData.newPassword
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to change password');
        }

        alert('Password changed successfully');
        handleClose();
      } else if (activeForm === 'deleteAccount') {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          response = await fetch(`/api/admin?email=${email}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
          });

          if (!response.ok) {
            throw new Error('Failed to delete account');
          }

          alert('Account deleted successfully');
          handleClose();
        }
      }

      if (activeForm !== 'deleteAccount') {
        if (!response.ok) {
          throw new Error('Failed to update account');
        }

        handleClose();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error during action:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 -ml-16">Account Settings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 -ml-24">
        <Button onClick={() => handleButtonClick('viewProfile')} className="bg-blue-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'View Profile'}
        </Button>
        <Button onClick={() => handleButtonClick('updateProfile')} className="bg-green-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Update Profile'}
        </Button>
        <Button onClick={() => handleButtonClick('changePassword')} className="bg-yellow-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Change Password'}
        </Button>
        <Button onClick={() => handleButtonClick('deleteAccount')} className="bg-gray-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Delete Account'}
        </Button>
      </div>

      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 max-h-[50vh] mt-32">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <Button onClick={handleClose} className="absolute top-2 right-2 bg-gray-300 text-gray-700">
              ×
            </Button>
            <h2 className="text-xl font-semibold mb-4">
              {activeForm === 'viewProfile' && 'View Profile'}
              {activeForm === 'updateProfile' && 'Update Profile'}
              {activeForm === 'changePassword' && 'Change Password'}
              {activeForm === 'deleteAccount' && 'Delete Account'}
            </h2>

            {activeForm === 'viewProfile' && profileData && (
              <div>
                <div className="text-center mb-6">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                  ) : (
                    <label className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto cursor-pointer">
                      <FaCamera className="text-gray-500" size={30} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <p className="text-gray-800">{profileData.adminName}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <p className="text-gray-800">{profileData.adminEmail}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <p className="text-gray-800">{profileData.phoneNumber}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">City</label>
                  <p className="text-gray-800">{profileData.city}</p>
                </div>
              </div>
            )}

            {activeForm === 'updateProfile' && (
              <div>
              <div>
              <div className="text-center mb-6 relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
          ) : (
            <label className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto cursor-pointer">
              <FaCamera className="text-gray-500" size={30} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpdate}
              />
            </label>
          )}
          {/* Plus button for updating the profile image */}
          <label
            htmlFor="file-upload"
            className="absolute bottom-0 right-0 mb-1 mr-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
          >
            <FaPlus size={20} className="text-gray-700" />
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpdate}
            />
          </label>
        </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="adminName" className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    id="adminName"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="fatherName" className="block text-sm font-medium mb-1">Father Name</label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="bg-green-500 text-white" disabled={loading}>
                  {loading ? 'Loading...' : 'Save Changes'}
                </Button>
              </form>
              </div>
            )}

            {activeForm === 'changePassword' && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Current Password</label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="bg-yellow-500 text-white" disabled={loading}>
                  {loading ? 'Loading...' : 'Change Password'}
                </Button>
              </form>
            )}

            {activeForm === 'deleteAccount' && (
              <div>
                <p className="text-red-500">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex gap-4 mt-4">
                  <Button onClick={handleSubmit} className="bg-red-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Delete Account'}
                  </Button>
                  <Button onClick={handleClose} className="bg-gray-300 text-gray-700">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;



