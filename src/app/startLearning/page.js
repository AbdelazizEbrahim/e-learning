'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaPlayCircle, FaDochub } from 'react-icons/fa';

export default function StartLearning() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('courseCode');

  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null); // To track the currently playing video

  useEffect(() => {
    if (courseCode) {
      fetchDocuments();
      fetchVideos();
    }
  }, [courseCode]);

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
      const response = await fetch(`/api/courseVideo?courseCode=${courseCode}`);
      const data = await response.json();
      const sortedVideos = data.videos.sort((a, b) => a.orderNumber - b.orderNumber);
      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handlePlayVideo = (videoId) => {
    setPlayingVideoId(videoId === playingVideoId ? null : videoId); // Toggle video playback
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4">
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <a
                  href={doc.documentPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4"
                >
                  <div className="relative">
                    <FaDochub size={40} className="text-blue-500 mx-auto mb-4" />
                  </div>
                </a>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{doc.docName}</h3>
                  <p className="text-md text-gray-600 mt-2">{doc.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Video Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4">
            {videos.map((video) => (
              <li
                key={video._id}
                className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* If this video is being played, render the video element; otherwise, show thumbnail with play button */}
                {playingVideoId === video._id ? (
                  <video
                    className="w-full h-48 rounded-lg"
                    src={'/bg.jpg'}
                    controls
                    autoPlay
                  />
                ) : (
                  <div className="relative cursor-pointer" onClick={() => handlePlayVideo(video._id)}>
                    {/* Thumbnail background */}
                    <div
                      className="w-full h-48 bg-cover bg-center rounded-lg"
                      style={{
                        backgroundImage: `url(${video.thumbnail || '/default-thumbnail.jpg'})`,
                      }}
                    ></div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <FaPlayCircle size={80} className="text-blue-500" />
                    </div>
                  </div>
                )}
                <div className="text-center mt-4">
                  <h3 className="text-xl font-semibold text-gray-800">{video.videoName}</h3>
                  <p className="text-md text-gray-600 mt-2">{video.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
