'use client';

import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
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
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (activeForm === 'viewProfile') {
      const fetchProfileData = async () => {
        setLoading(true);
        console.log('Fetching profile data...');
        const token = localStorage.getItem('authToken');
        if (token) {
          console.log('token fetched');
          console.log(token);
          try {
            const decoded = jwt.decode(token);
            console.log(decoded);
            const email = decoded.email;
            if (email) {
              console.log('email fetched');
              console.log(email);
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
              console.log('Profile data fetched successfully');
            }
          } catch (error) {
            setError(error.message);
            console.error('Error fetching profile data:', error.message);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchProfileData();
    }
  }, [activeForm]);

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
    console.log(`Submitting form: ${activeForm}`);

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
        console.log('Profile updated');
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

        console.log('Password changed');
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

          console.log('Account deleted');
          alert('Account deleted successfully');
          handleClose();
        }
      }

      if (activeForm !== 'deleteAccount') {
        if (!response.ok) {
          throw new Error('Failed to update account');
        }

        // alert('Action completed successfully');
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
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {activeForm === 'viewProfile' && 'View Profile'}
              {activeForm === 'updateProfile' && 'Update Profile'}
              {activeForm === 'changePassword' && 'Change Password'}
              {activeForm === 'deleteAccount' && 'Delete Account'}
            </h2>

            {activeForm === 'viewProfile' && profileData && (
              <div className="space-y-4">
                <p><strong>Admin Name:</strong> {profileData.adminName}</p>
                <p><strong>Father Name:</strong> {profileData.fatherName}</p>
                <p><strong>Email:</strong> {profileData.adminEmail}</p>
                <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
                <p><strong>City:</strong> {profileData.city}</p>
              </div>
            )}

            {activeForm === 'updateProfile' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Admin Name</span>
                  <Input
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Enter admin name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Father Name</span>
                  <Input
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="Enter father's name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Admin Email</span>
                  <Input
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="Enter admin email"
                    required
                    disabled // Make email field uneditable
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Phone Number</span>
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
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
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className="bg-green-500 text-white" disabled={loading}>
                  {loading ? 'Loading...' : 'Update'}
                </Button>
                <Button onClick={handleClose} className="bg-red-500 text-white ml-2">
                  Close
                </Button>
              </form>
            )}

            {activeForm === 'changePassword' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Current Password</span>
                  <Input
                    name="currentPassword"
                    type="password"
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
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Confirm Password</span>
                  <Input
                    name="confirmPassword"
                    type="password"
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                  />
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className="bg-yellow-500 text-white" disabled={loading}>
                  {loading ? 'Loading...' : 'Change Password'}
                </Button>
                <Button onClick={handleClose} className="bg-red-500 text-white ml-2">
                  Close
                </Button>
              </form>
            )}

            {activeForm === 'deleteAccount' && (
              <div>
                <p className="text-red-500">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSubmit} className="bg-red-500 text-white" disabled={loading}>
                    {loading ? 'Loading...' : 'Delete Account'}
                  </Button>
                  <Button onClick={handleClose} className="bg-gray-500 text-white ml-2">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={handleClose} className="absolute top-2 right-2 bg-gray-300 text-gray-700">
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
