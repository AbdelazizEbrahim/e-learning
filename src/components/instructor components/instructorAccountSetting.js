'use client';

import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AccountSettings = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    fullName: '',
    email: '',
    instructorId: '',
    age: '',
    gender: '',
    city: '',
    biography: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwt.decode(token);
      const email = decoded?.email;
      if (email) {
        setFormData(prevData => ({
          ...prevData,
          email: email,  // Set email from local storage
        }));
      }
    }

    const handleClickOutside = (event) => {
      if (activeForm && !event.target.closest('.modal-content')) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeForm]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwt.decode(token);
          const email = decoded?.email;
          if (email) {
            const response = await fetch(`/api/instructorProfile?email=${email}`);
            if (!response.ok) {
              throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            if (data.success) {
              setFormData(prevData => ({
                ...prevData,
                ...data.data, // Spread the received data into formData
                email: email,  // Set email from local storage
              }));
            } else {
              throw new Error(data.error);
            }
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (activeForm === 'viewProfile' || activeForm === 'updateProfile') {
      fetchProfileData();
    }
  }, [activeForm]);

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
    if (formName === 'uploadDocumentation') {
      setFormData(prevData => ({
        ...prevData,
        degree: null,
        cv: null
      }));
      setShowDocForm(true);
    }
  };

  const handleClose = () => {
    setActiveForm(null);
    setError(null);
    setShowDocForm(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('authToken');
    const email = jwt.decode(token)?.email;

    try {
      let response;
      if (activeForm === 'updateProfile') {
        response = await fetch(`/api/instructorProfile?email=${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData
          })
        });
      } else if (activeForm === 'upgradeProfile') {
        response = await fetch(`/api/instructorProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData
          })
        });

      } else if (activeForm === 'uploadDocumentation') {
        const formDataForUpload = new FormData();
        if (formData.degree) formDataForUpload.append('degree', formData.degree);
        if (formData.cv) formDataForUpload.append('cv', formData.cv);
        
        response = await fetch(`/api/files`, {
          method: 'POST',
          body: formDataForUpload,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (!response.ok) {
        throw new Error('Action failed');
      }

      console.log("response: ",response)
      const result = await response.json();
      console.log("data: ", result);
      if (result.success) {
        alert('Action completed successfully');
        handleClose();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
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
        <Button onClick={() => handleButtonClick('upgradeProfile')} className="bg-purple-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Upgrade Profile'}
        </Button>
        <Button onClick={() => handleButtonClick('uploadDocumentation')} className="bg-teal-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Upload Documentation'}
        </Button>
      </div>

      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out overflow-y-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative modal-content overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">
              {activeForm === 'viewProfile' && 'View Profile'}
              {activeForm === 'updateProfile' && 'Update Profile'}
              {activeForm === 'upgradeProfile' && 'Upgrade Profile'}
              {activeForm === 'uploadDocumentation' && 'Upload Documentation'}
            </h2>

            {activeForm === 'viewProfile' && (
              <div className="space-y-4">
                <p><strong>Job Title:</strong> {formData.jobTitle}</p>
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Instructor ID:</strong> {formData.instructorId}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>City:</strong> {formData.city}</p>
                <p><strong>Biography:</strong> {formData.biography}</p>
              </div>
            )}

            {(activeForm === 'updateProfile' || activeForm === 'upgradeProfile') && (
              <form onSubmit={handleSubmit}>
                <label className="block mb-2">Job Title</label>
                <Input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Job Title"
                  className="mb-4"
                />
                <label className="block mb-2">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="mb-4"
                />
                <label className="block mb-2">Email</label>
                <Input
                  type="text"
                  name="email"
                  value={formData.email}
                  placeholder="Email"
                  className="mb-4"
                  disabled
                />
                <label className="block mb-2">Instructor ID</label>
                <Input
                  type="text"
                  name="instructorId"
                  value={formData.instructorId}
                  placeholder="Instructor ID"
                  onChange={handleChange}
                  disabled={activeForm === 'updateProfile'}
                  className="mb-4"
                />
                <label className="block mb-2">Age</label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="mb-4"
                />
                <label className="block mb-2">Gender</label>
                <Input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                  className="mb-4"
                />
                <label className="block mb-2">City</label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="mb-4"
                />
                <label className="block mb-2">Biography</label>
                <Input
                  type="text"
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  placeholder="Biography"
                  className="mb-4"
                />
                <Button type="submit" className="bg-green-500 text-white" disabled={loading}>
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </form>
            )}

            {showDocForm && (
              <form onSubmit={handleSubmit}>
                <label className="block mb-2">Degree Document</label>
                <Input
                  type="file"
                  name="degree"
                  onChange={handleChange}
                  className="mb-4"
                />
                <label className="block mb-2">CV Document</label>
                <Input
                  type="file"
                  name="cv"
                  onChange={handleChange}
                  className="mb-4"
                />
                <Button type="submit" className="bg-teal-500 text-white" disabled={loading}>
                  {loading ? 'Loading...' : 'Upload'}
                </Button>
              </form>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <Button onClick={handleClose} className="absolute top-2 right-2 bg-red-500 text-white">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
