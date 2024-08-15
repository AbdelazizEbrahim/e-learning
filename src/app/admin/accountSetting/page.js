'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button'; // Ensure this path is correct
import { Input } from '../../../components/ui/input'; // Ensure this path is correct

const AccountSettings = () => {
  const [activeForm, setActiveForm] = useState(null); // State to track which form is active
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

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
  };

  const handleClose = () => {
    setActiveForm(null);
    setError(null); // Clear errors when closing
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
      // Define API endpoints for different actions
      const endpoints = {
        updateProfile: '/api/admin/update',
        changePassword: '/api/admin/change-password',
        updateContact: '/api/admin/update-contact',
        deleteAccount: '/api/admin/delete'
      };

      let response;
      if (activeForm === 'updateProfile') {
        response = await fetch(endpoints.updateProfile, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
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
          setLoading(false);
          return;
        }
        response = await fetch(endpoints.changePassword, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });
      } else if (activeForm === 'updateContact') {
        response = await fetch(endpoints.updateContact, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
            city: formData.city
          })
        });
      } else if (activeForm === 'deleteAccount') {
        response = await fetch(endpoints.deleteAccount, {
          method: 'DELETE'
        });
      }

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      alert('Action completed successfully');
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>

      {/* Buttons for different actions */}
      <div className="space-y-4 mb-6">
        <Button onClick={() => handleButtonClick('viewProfile')} className="bg-blue-500 text-white">View Profile</Button>
        <Button onClick={() => handleButtonClick('updateProfile')} className="bg-green-500 text-white">Update Profile</Button>
        <Button onClick={() => handleButtonClick('changePassword')} className="bg-yellow-500 text-white">Change Password</Button>
        <Button onClick={() => handleButtonClick('updateContact')} className="bg-red-500 text-white">Update Contact Info</Button>
        <Button onClick={() => handleButtonClick('deleteAccount')} className="bg-gray-500 text-white">Delete Account</Button>
      </div>

      {/* Conditional rendering of forms based on activeForm state */}
      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {activeForm === 'viewProfile' && 'View Profile'}
              {activeForm === 'updateProfile' && 'Update Profile'}
              {activeForm === 'changePassword' && 'Change Password'}
              {activeForm === 'updateContact' && 'Update Contact Info'}
              {activeForm === 'deleteAccount' && 'Delete Account'}
            </h2>

            {/* Conditional content based on activeForm */}
            {activeForm === 'viewProfile' && (
              <div>
                {/* Include profile details here */}
                <p>Profile details go here...</p>
              </div>
            )}

            {activeForm === 'updateProfile' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Admin Name"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Enter admin name"
                  required
                />
                <Input
                  label="Father Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                  required
                />
                <Input
                  label="Admin Email"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
                <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </form>
            )}

            {activeForm === 'changePassword' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
                <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            )}

            {activeForm === 'updateContact' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
                <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Contact Info'}
                </Button>
              </form>
            )}

            {activeForm === 'deleteAccount' && (
              <div className="space-y-4">
                <p>Are you sure you want to delete your account?</p>
                <Button onClick={handleSubmit} className="bg-red-500 text-white" disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete Account'}
                </Button>
                <Button onClick={handleClose} className="bg-gray-500 text-white">
                  Cancel
                </Button>
              </div>
            )}

            {/* Close button */}
            <Button onClick={handleClose} className="absolute top-2 right-2 bg-gray-300 text-black">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
