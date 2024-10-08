'use client';

import { FaCamera, FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AccountSettings = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    age: '',
    gender: '',
    city: '',
    biography: '',
    confirmPassword: '',
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); 
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwt.decode(token);
          const email = decoded?.email;

          fetchProfileImage(email);

          if (email) {
            const response = await fetch(`/api/userProfile?email=${email}`);
            if (!response.ok) {
              throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            console.log("data: ", data)
            setFormData({
              fullName: data[0].fullName,
              email: email, // Email remains unchanged
              studentId: data[0].studentId,
              age: data[0].age,
              gender: data[0].gender,
              city: data[0].city,
              biography: data[0].biography
            });
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // If no token, stop loading
      }
    };

    if (activeForm === 'viewProfile' || activeForm === 'updateProfile') {
      fetchProfileData();
    }
  }, [activeForm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.form-container') === null) {
        setActiveForm(null);
        setError(null);
        setShowConfirmDelete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProfileImage = async (email) => {
    console.log("email to post: " , email)
    try {
      const response = await fetch(`/api/photo?email=${email}`);
      console.log("resfetch: ", response)
      if (response.ok) {
        const data = await response.json();
        console.log("datafetch: ", data);
        setProfileImage(data.data?.imageUrl || null);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const email = decoded.email;
      console.log("email:", email);
      const response = await fetch(`/api/photo?email=${email}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("resp1: ", response)
      if (response.ok) {
        const data = await response.json();
        console.log("image da: ", data);
        setProfileImage(data.data.imageUrl); // Update profile image URL after upload
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
    console.log('Image update initiated');
  
    const file = event.target.files[0];
    console.log('Selected file:', file);
  
    if (!file) {
      console.log('No file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', file);
    console.log('FormData created with file');
  
    try {
      setLoading(true);
      console.log('Loading state set to true');
  
      const token = localStorage.getItem('authToken');
      console.log('Retrieved token from localStorage:', token);
  
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
  
      const email = decoded.email;
      console.log('Extracted email from token:', email);
  
      const response = await fetch(`/api/photo?email=${email}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Fetch request sent to API');
  
      if (response.ok) {
        const data = await response.json();
        console.log('Image update successful, response data:', data);
        setProfileImage(data.imageUrl);
        console.log('Profile image state updated');
      } else {
        console.error('Image update failed, response status:', response.status);
      }
    } catch (error) {
      console.error('Error updating image:', error);
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };
  

  const handleButtonClick = (formName) => {
    const token = localStorage.getItem('authToken');
    let email1 = '';

    if (token) {
      const decoded = jwt.decode(token);
      email1 = decoded?.email || '';  // Handle cases where email might be undefined
    }

    setActiveForm(formName);

    if (formName === 'createAccount') {
      setFormData(prevData => ({
        ...prevData,
        email: email1
      }));
    }

    if (formName === 'changePassword') {
      setFormData(prevData => ({
        ...prevData,
        currentPassword: '',
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
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('authToken');
    const email = jwt.decode(token)?.email;

    try {
      let response;
      if (activeForm === 'createAccount') {
        response = await fetch(`/api/userProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData
          })
        });
      } else if (activeForm === 'updateProfile') {
        response = await fetch(`/api/userProfile?email=${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData
          })
        });
      } else if (activeForm === 'changePassword') {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        response = await fetch(`/api/auth/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });
      } else if (activeForm === 'deleteAccount') {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          response = await fetch(`/api/userProfile?email=${email}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }

      if (!response.ok) {
        throw new Error('Action failed');
      }

      if (activeForm === 'deleteAccount') {
        alert('Account deleted successfully');
        handleClose();
      } else {
        alert('Action completed successfully');
        handleClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 -ml-12">Account Settings</h1>
      <div className="gap-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -ml-20">
        <Button onClick={() => handleButtonClick('viewProfile')} className="bg-blue-500 text-white w-60" disabled={loading}>
          {loading ? 'Loading...' : 'View Profile'}
        </Button>
        <Button onClick={() => handleButtonClick('updateProfile')} className="bg-green-500 text-white w-60" disabled={loading}>
          {loading ? 'Loading...' : 'Update Profile'}
        </Button>
        <Button onClick={() => handleButtonClick('createAccount')} className="bg-purple-500 text-white w-60" disabled={loading}>
          {loading ? 'Loading...' : 'Upgrade Account'}
        </Button>
      </div>


      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-4 ">
          <div className="form-container bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative overflow-y-auto max-h-[78vh]">
            <h2 className="text-xl font-semibold mb-4">
              {activeForm === 'viewProfile' && 'View Profile'}
              {activeForm === 'updateProfile' && 'Update Profile'}
              {activeForm === 'createAccount' && 'Create Account'}
              {activeForm === 'changePassword' && 'Change Password'}
              {activeForm === 'deleteAccount' && 'Delete Account'}
            </h2>

            {activeForm === 'viewProfile' && (
              <div className=''>
                <div className="text-center mb-6 ">
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
              <div className="space-y-4">
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Student ID:</strong> {formData.studentId}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>City:</strong> {formData.city}</p>
                <p><strong>Biography:</strong> {formData.biography}</p>
              </div>
              </div>
            )}

            {activeForm === 'updateProfile' && (
              <div className=''>
              <div className=''>
                <div className=''>
                  <div className="text-center mb-6 relative ">
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
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 ">
                <label className="block">
                  <span className="text-gray-700">Full Name</span>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Age</span>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Gender</span>
                  <Input
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    placeholder="Enter gender"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">City</span>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Biography</span>
                  <Input
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    placeholder="Enter biography"
                    required
                  />
                </label>

                <div className="flex justify-end mt-4 space-x-2">
                  <Button type="button" onClick={handleClose} className="bg-red-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
              </div>
            )}

            {activeForm === 'createAccount' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Full Name</span>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Email</span>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="Email from local storage"
                    required
                    disabled
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Student ID</span>
                  <Input
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Enter student ID"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Age</span>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Gender</span>
                  <Input
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    placeholder="Enter gender"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">City</span>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Biography</span>
                  <Input
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    placeholder="Enter biography"
                    required
                  />
                </label>

                <div className="flex justify-end mt-4 space-x-2">
                  <Button type="button" onClick={handleClose} className="bg-red-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Upgrade Account'}
                  </Button>
                </div>
              </form>
            )}

            {activeForm === 'changePassword' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Current Password</span>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">New Password</span>
                  <Input
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Confirm New Password</span>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                  />
                </label>

                <div className="flex justify-end mt-4 space-x-2">
                  <Button type="button" onClick={handleClose} className="bg-red-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            )}

            {activeForm === 'deleteAccount' && (
              <div className="space-y-4">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button type="button" onClick={() => setShowConfirmDelete(false)} className="bg-red-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Cancel'}
                  </Button>
                  <Button type="button" onClick={handleSubmit} className="bg-blue-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Delete Account'}
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
