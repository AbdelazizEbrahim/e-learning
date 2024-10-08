'use client';

import { useState, useEffect } from 'react';
import { FaCamera, FaPlus } from 'react-icons/fa'; 
import jwt from 'jsonwebtoken';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { jwtDecode } from 'jwt-decode';

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
  const [profileImage, setProfileImage] = useState(null); 
  const [showDocForm, setShowDocForm] = useState(false);

  let email='';
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const decoded = jwt.decode(token);
    email = decoded?.email;
    if (token) {
      email = decoded?.email;
      if (email) {
        setFormData(prevData => ({
          ...prevData,
          email: email,  
        }));
        fetchProfileImage(email); // Fetch profile image when email is available
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
      const decoded = jwt.decode(token);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      email = decoded?.email;
      if (token) {
        try {
          if (email) {
            const response = await fetch(`/api/instructorProfile?email=${email}`);
            if (!response.ok) {
              throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            if (data.success) {
              setFormData(prevData => ({
                ...prevData,
                ...data.data, 
                email: email,  
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

  const fetchProfileImage = async (email) => {
    console.log("email to get:", email);
    try {
      const response = await fetch(`/api/photo?email=${email}`);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched image data:", data);
  
      if (data && data.data.imageUrl) {
        setProfileImage(data.data.imageUrl); // Set the profile image URL
      } else {
        console.warn('No imageUrl found in the response data');
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

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.imageUrl); // Update profile image URL after upload
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
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

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
  
    if (!token || !email) {
      setError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }
  
    try {
      let response;
  
      if (activeForm === 'updateProfile') {
        // Update profile form submission
        response = await fetch(`/api/instructorProfile?email=${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData }),
        });
      } else if (activeForm === 'upgradeProfile') {
        // Upgrade profile form submission
        response = await fetch(`/api/instructorProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData }),
        });
      } else if (activeForm === 'uploadDocumentation') {
        // Documentation upload form
        const formDataForUpload = new FormData();
        if (!formData.degree || !formData.cv) {
          setError('Please upload both degree and CV files.');
          setLoading(false);
          return;
        }
  
        formDataForUpload.append('degree', formData.degree);
        formDataForUpload.append('cv', formData.cv);
  
        response = await fetch(`/api/instructorFiles?email=${email}`, {
          method: 'POST',
          body: formDataForUpload,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("doc responese: ", response);
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload documentation: ${errorText}`);
        }
      }
  
      const result = await response.json();
      console.log("doc data: ",result)
      if (result.success) {
        alert('Action completed successfully');
        handleClose();
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
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
        <Button onClick={() => handleButtonClick('upgradeProfile')} className="bg-purple-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Upgrade Profile'}
        </Button>
        <Button onClick={() => handleButtonClick('uploadDocumentation')} className="bg-teal-500 text-white" disabled={loading}>
          {loading ? 'Loading...' : 'Upload Documentation'}
        </Button>
      </div>


      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out overflow-y-auto ">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative modal-content overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">
              {activeForm === 'viewProfile' && 'View Profile'}
              {activeForm === 'updateProfile' && 'Update Profile'}
              {activeForm === 'upgradeProfile' && 'Upgrade Profile'}
              {activeForm === 'uploadDocumentation' && 'Upload Documentation'}
            </h2>

            {activeForm === 'viewProfile' && (
              <div className='w-2/3'>
                <div className="text-center mb-6">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-28 h-28 rounded-full mx-auto"
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
                  <p><strong>Job Title:</strong> {formData.jobTitle}</p>
                  <p><strong>Full Name:</strong> {formData.fullName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Instructor ID:</strong> {formData.instructorId}</p>
                  <p><strong>Age:</strong> {formData.age}</p>
                  <p><strong>Gender:</strong> {formData.gender}</p>
                  <p><strong>City:</strong> {formData.city}</p>
                  <p><strong>Biography:</strong> {formData.biography}</p>
                </div>
              </div>
            )}

            { (activeForm === 'updateProfile' || activeForm === 'upgradeProfile') && (
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block mb-2">
                  Job Title
                </label>
                <Input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block mb-2">
                  Full Name
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="age" className="block mb-2">
                  Age
                </label>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="gender" className="block mb-2">
                  Gender
                </label>
                <Input
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="city" className="block mb-2">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="biography" className="block mb-2">
                  Biography
                </label>
                <Input
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  textarea
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </form>
          </div>          
  )}

            {activeForm === 'uploadDocumentation' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Label>Degree</Label>
                <Input
                  label="Upload Degree"
                  name="degree"
                  type="file"
                  onChange={handleChange}
                />
                <Label>CV</Label>
                <Input
                  label="Upload CV"
                  name="cv"
                  type="file"
                  onChange={handleChange}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Uploading...' : 'Submit'}
                </Button>
              </form>
            )}

            {error && (
              <div className="text-red-500 mt-4">
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;

