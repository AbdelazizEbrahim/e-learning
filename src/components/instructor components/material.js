'use client';


import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPlayCircle, FaDochub } from 'react-icons/fa';

export default function MaterialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('courseCode');

  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showDocUploadForm, setShowDocUploadForm] = useState(false);
  const [showVideoUploadForm, setShowVideoUploadForm] = useState(false);

  const [editingDoc, setEditingDoc] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  const [Updating, setUpdating] = useState(false);

  const [docUpload, setDocUpload] = useState(null);
  const [docName, setDocName] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [orderNumber, setOrderNumber] = useState(0);

  const [openDropdown, setOpenDropdown] = useState(null); 

  const [videoUpload, setVideoUpload] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  const docFormRef = useRef(null);
  const videoFormRef = useRef(null);
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  

  useEffect(() => {
    if (courseCode) {
      fetchDocuments();
      fetchVideos();
    }
  }, [courseCode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (docFormRef.current && !docFormRef.current.contains(event.target)) {
        setShowDocUploadForm(false);
      }
      if (videoFormRef.current && !videoFormRef.current.contains(event.target)) {
        setShowVideoUploadForm(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/courseDocument?courseCode=${courseCode}`);
      const data = await response.json();
      const sortedDocuments = data.documents.sort((a, b) => a.orderNumber - b.orderNumber);
      setDocuments(sortedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      console.log("course code: ", courseCode);
      const response = await fetch(`/api/courseVideo?courseCode=${courseCode}`);
      const data = await response.json();
      const sortedVideos = data.videos.sort((a, b) => a.orderNumber - b.orderNumber);
      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

const handleDocUpload = async () => {
  const formData = new FormData();
  formData.append('file', docUpload);
  formData.append('courseCode', courseCode);
  formData.append('docName', docName);
  formData.append('description', docDescription);
  formData.append('orderNumber', orderNumber);

  try {
    const response = await fetch(`/api/courseDocument${editingDoc ? `/${editingDoc._id}` : `?courseCode=${courseCode}`}`, {
      method: editingDoc ? 'PUT' : 'POST',
      body: formData,
    });
    if (response.ok) {
      fetchDocuments();
      handleFormClose();  // Clear the form after successful upload
    } else {
      console.error('Error uploading document');
    }
  } catch (error) {
    console.error('Error uploading document:', error);
  }
};

const handleVideoUpload = async () => {
  const formData = new FormData();
  formData.append('file', videoUpload);
  formData.append('courseCode', courseCode);
  formData.append('videoName', videoName);
  formData.append('description', videoDescription);
  formData.append('orderNumber', orderNumber);

  try {
    const response = await fetch(`/api/courseVideo${editingVideo ? '' : `?courseCode=${courseCode}`}`, {
      method: editingVideo ? 'PUT' : 'POST',
      body: formData,
    });
    if (response.ok) {
      fetchVideos();
      handleFormClose();  // Clear the form after successful upload
    } else {
      console.error('Error uploading video');
    }
  } catch (error) {
    console.error('Error uploading video:', error);
  }
};

  

  const handleDropdownToggle = (item, type) => {
    const itemId = item._id;
    // if (type === 'document') {
    //   setEditingDoc(item);
    //   setShowDocUploadForm(true); 
    // } else {
    //   setEditingVideo(item);
    //   setShowVideoUploadForm(true); 
    // }
    setDropdownOpen(dropdownOpen === itemId ? null : itemId);
  };

  const openDocForm = (item) => {
    setEditingDoc(item);
    setShowDocUploadForm(true);
    setDocName(item.docName || '');
    setDocDescription(item.description || '');
    setOrderNumber(item.orderNumber || '');
  };
  
  const openVideoForm = (item) => {
    setEditingVideo(item);
    setShowVideoUploadForm(true);
    setVideoName(item.videoName || '');
    setVideoDescription(item.description || '');
    setOrderNumber(item.orderNumber || '');
  };
  
  const handleDocUpdate = async () => {
    if (!editingDoc) return;
  
    const formData = new FormData();
    formData.append('docId', editingDoc._id);
    formData.append('docName', docName);
    formData.append('description', docDescription);
    formData.append('orderNumber', orderNumber);
  
    if (docUpload) {
      formData.append('file', docUpload);
    }
  
    try {
      const response = await fetch(`/api/courseDocument?documentId=${editingDoc._id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update document');
      }
  
      await fetchDocuments();
      handleFormClose(); // Clear the form after successful update
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
  
  
  const handleVideoUpdate = async () => {
    if (!editingVideo) return;
  
    const formData = new FormData();
    formData.append('videoId', editingVideo._id);
    formData.append('videoName', videoName);
    formData.append('description', videoDescription);
    formData.append('orderNumber', orderNumber);
  
    if (videoUpload) {
      formData.append('file', videoUpload);
    }
  
    try {
      const response = await fetch(`/api/courseVideo?videoId=${editingVideo._id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update video');
      }
  
      await fetchVideos();
      handleFormClose(); 
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };
  
  
  const handleDocDelete = async (docId) => {
    console.log("delete id: ", docId);
    if (window.confirm(`Are you sure you want to delete this document?`)) {
      try {
        const response = await fetch(`/api/courseDocument?documentId=${docId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ docId }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete document');
        }
  
        await fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  const handleFormClose = () => {
    setDocName('');
    setDocDescription('');
    setOrderNumber('');
    setDocUpload(null);
    setEditingDoc(null);
    setShowDocUploadForm(false);
  
    setVideoName('');
    setVideoDescription('');
    setOrderNumber('');
    setVideoUpload(null);
    setEditingVideo(null);
    setShowVideoUploadForm(false);
  };
  
  
  
  const handleVideoDelete = async (videoId) => {
    if (window.confirm(`Are you sure you want to delete this video?`)) {
      try {
        const response = await fetch(`/api/courseVideo?videoId=${videoId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });
  
        console.log("response: ", response);
        if (!response.ok) {
          throw new Error('Failed to delete video');
        }
  
        // Refetch the videos list
        await fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };
  


  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
        {/* Document Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <button
            onClick={() => setShowDocUploadForm(!showDocUploadForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            {showDocUploadForm ? 'Cancel' : 'Upload Document'}
          </button>
         {/* Document Form */}
          
         {showDocUploadForm && (
          <div
            ref={docFormRef}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => {
              setShowDocUploadForm(false);
              setEditingDoc(null);
            }}
          >
            <div
              className="p-4 border rounded-lg w-4/5 max-w-lg bg-gray-500"
              onClick={(e) => e.stopPropagation()} // Prevent click outside from closing the form
            >
              <div className="mb-2">
                <label className="block text-white font-semibold mb-1">Upload Document</label>
                <input
                  type="file"
                  onChange={(e) => setDocUpload(e.target.files[0])}
                  className="p-2 border rounded w-full"
                />
              </div>

              <div className="mb-2">
                <label className="block text-white font-semibold mb-1">Document Name</label>
                <input
                  type="text"
                  placeholder="Document Name"
                  value={docName} // Use the state variable docName
                  onChange={(e) => setDocName(e.target.value)} // Update state when value changes
                  className="p-2 border rounded w-full"
                />
              </div>

              <div className="mb-2">
                <label className="block text-white font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Description"
                  value={docDescription} // Use the state variable docDescription
                  onChange={(e) => setDocDescription(e.target.value)} // Update state when value changes
                  className="p-2 border rounded w-full"
                  rows={4}
                />
              </div>

              <div className="mb-2">
                <label className="block text-white font-semibold mb-1">Order Number</label>
                <input
                  type="number"
                  placeholder="Order Number"
                  value={orderNumber} // Use the state variable orderNumber
                  onChange={(e) => setOrderNumber(e.target.value)} // Update state when value changes
                  className="p-2 border rounded w-full"
                />
              </div>

              <div className="flex justify-between">
              <button
                onClick={() => {
                  if (editingDoc) {
                    handleDocUpdate();
                  } else {
                    handleDocUpload();
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editingDoc ? 'Update Document' : 'Submit Document'}
              </button>

                <button
                  onClick={() => {
                    setShowDocUploadForm(false);
                    setEditingDoc(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


  
          <ul className="mt-6 grid grid-cols-2 gap-4">
           {documents.map((doc) => (
            <li key={doc._id} className=" relative border rounded-lg shadow-lg hover:shadow-lg transition-shadow duration-300">
              <a
                href={doc.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4"
              >
                <div className="relative">
                  <FaDochub size={40} className="text-blue-500 mx-auto mb-4" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{doc.docName}</h3>
                  <p className="text-md text-gray-600 mt-2">{doc.description}</p>
                </div>
              </a>
              <button
                onClick={() => handleDropdownToggle(doc, 'document')}
                className="absolute top-2 right-2 text-black font-bold rounded-full text-l p-2"
              >
                &#x22EE;
              </button>
              {dropdownOpen === doc._id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-8 right-0 w-auto bg-white border rounded shadow-lg z-10"
                >
                  <ul>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => openDocForm(doc)}
                      >
                        Update
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
                        onClick={() => handleDocDelete(doc._id)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}

          </ul>
        </div>
  
        {/* Video Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <button
            onClick={() => setShowVideoUploadForm(!showVideoUploadForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            {showVideoUploadForm ? 'Cancel' : 'Upload Video'}
          </button>
          {showVideoUploadForm && (
            <div
              ref={videoFormRef}
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={() => {
                setShowVideoUploadForm(false);
                setEditingVideo(null);
              }}
            >
              <div
                className="p-4 border rounded-lg w-4/5 max-w-lg bg-gray-500"
                onClick={(e) => e.stopPropagation()} // Prevent click outside from closing the form
              >
                <div className="mb-2">
                  <label className="block text-white font-semibold mb-1">Upload Video</label>
                  <input
                    type="file"
                    onChange={(e) => setVideoUpload(e.target.files[0])}
                    className="p-2 border rounded w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-white font-semibold mb-1">Video Name</label>
                  <input
                    type="text"
                    placeholder="Video Name"
                    value={videoName} // Use the state variable videoName
                    onChange={(e) => setVideoName(e.target.value)} // Update state when value changes
                    className="p-2 border rounded w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-white font-semibold mb-1">Description</label>
                  <textarea
                    placeholder="Description"
                    value={videoDescription} // Use the state variable videoDescription
                    onChange={(e) => setVideoDescription(e.target.value)} // Update state when value changes
                    className="p-2 border rounded w-full"
                    rows={4}
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-white font-semibold mb-1">Order Number</label>
                  <input
                    type="number"
                    placeholder="Order Number"
                    value={orderNumber} // Use the state variable orderNumber
                    onChange={(e) => setOrderNumber(e.target.value)} // Update state when value changes
                    className="p-2 border rounded w-full"
                  />
                </div>

                <div className="flex justify-between">
                <button
                    onClick={() => {
                      if (editingVideo) {
                        handleVideoUpdate();
                      } else {
                        handleVideoUpload();
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    {editingVideo ? 'Update Video' : 'Submit Video'}
              </button>

                  <button
                    onClick={() => {
                      setShowVideoUploadForm(false);
                      setEditingVideo(null);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

  
          <ul className="mt-6 grid grid-cols-2 gap-4">
            {videos.map((video) => (
              <li key={video._id} className="relative border rounded-lg shadow-lg hover:shadow-lg transition-shadow duration-300">
                <a
                  href={video.videoPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4"
                >
                  <div className="relative">
                    <FaPlayCircle size={40} className="text-blue-500 mx-auto mb-4" />
                  </div>
                  <div className="text-center ">
                    <h3 className="text-xl font-semibold text-gray-800">{video.videoName}</h3>
                    <p className="text-md text-gray-600 mt-2">{video.description}</p>
                  </div>
                </a>
                <button
                  onClick={() => handleDropdownToggle(video, 'video')}
                  className="absolute top-2 right-2 text-black rounded-full text-lg p-2 font-bold"
                >
                  &#x22EE;
                </button>
                {dropdownOpen === video._id && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-8 right-0 w-auto bg-white border rounded shadow-lg z-10"
                  >
                    <ul>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => openVideoForm(video)}
                        >
                          Update
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
                          onClick={() => handleVideoDelete(video._id)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))}

          </ul>
        </div>
      </div>
    </div>
  );
  
}
