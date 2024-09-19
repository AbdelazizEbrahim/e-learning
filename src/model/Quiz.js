'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaPlayCircle, FaDochub } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

export default function StartLearning() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('courseCode');

  const [documents, setDocuments] = useState([]);
  const [name, setName ] = useState(null);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]); 
  const [playingVideoId, setPlayingVideoId] = useState(null); 
  const [quizVisible, setQuizVisible] = useState({}); 

  const [quizResults, setQuizResults] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Handling radio selection
  const handleAnswerSelect = (qIndex, aIndex) => {
    setQuizResults((prevResults) => ({
      ...prevResults,
      [qIndex]: aIndex,  // Store the index of the selected answer
    }));
  };

  // Handling submit (functionality will be added later)
  const handleSubmitQuiz = (quiz) => {
    console.log("Quiz submitted", quiz);
    // Functionality to handle quiz submission will go here
  };

  useEffect(() => {
    if (courseCode) {
      fetchDocuments();
      fetchVideos();
      fetchQuizzes();
      fetchName();
    }
  }, [courseCode]);

  const fetchName = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const email = decoded.email;
      let api;

      if (email) {
        api = decoded.role === 'user' ? 'userProfile' : 'instructorProfile';
        try {
          const response = await fetch(`/api/${api}?email=${email}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            const name = data.data.fullName.split(' ')[0];
            setName(name);
          } else {
            console.error('Failed to fetch user profile:', response.statusText);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    }
  };

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

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`/api/quiz?courseCode=${courseCode}`);
      const data = await response.json();
      const sortedQuizzes = data.quizzes.sort((a, b) => a.quizzes[0].questions[0]?.orderNumber - b.quizzes[0].questions[0]?.orderNumber);
      setQuizzes(sortedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handlePlayVideo = (videoId, orderNumber) => {
    setPlayingVideoId(videoId === playingVideoId ? null : videoId);
    setQuizVisible(prev => ({ ...prev, [orderNumber]: true }));
  };

  const handleDocumentClick = (orderNumber) => {
    setQuizVisible(prev => ({ ...prev, [orderNumber]: true }));
  };

  const combinedContent = [];
  const docMap = new Map(documents.map(doc => [doc.orderNumber, doc]));
  const vidMap = new Map(videos.map(vid => [vid.orderNumber, vid]));
  const quizMap = new Map(quizzes.map(quiz => [quiz.questions[0]?.orderNumber, quiz]));

  const allOrderNumbers = new Set([...docMap.keys(), ...vidMap.keys(), ...quizMap.keys()]);

  allOrderNumbers.forEach(orderNumber => {
    const doc = docMap.get(orderNumber);
    const vid = vidMap.get(orderNumber);
    const quiz = quizMap.get(orderNumber);

    combinedContent.push({
      orderNumber,
      video: vid || null,
      document: doc || null,
      quiz: quiz || null,
    });
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Hello, Welcome {name}</h2>
      <div className="grid grid-cols-1 gap-6">
        {combinedContent.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg max-w-3xl mx-auto">
            {item.video && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Video</h2>
                <div className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {playingVideoId === item.video._id ? (
                    <div className="relative w-full h-72">
                      <video className="w-full h-full rounded-lg" src={item.video.videoPath} controls autoPlay />
                      <button 
                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2" 
                        onClick={() => handlePlayVideo(null, item.orderNumber)} 
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative cursor-pointer w-full h-48 bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${item.video.thumbnail || '/bg.jpg'})` }}
                      onClick={() => handlePlayVideo(item.video._id, item.orderNumber)}
                    >
                      <div className="absolute inset-0 flex justify-center items-center">
                        <FaPlayCircle size={80} className="text-blue-500" />
                      </div>
                    </div>
                  )}
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-semibold text-gray-800">{item.video.videoName}</h3>
                    <p className="text-md text-gray-600 mt-2">{item.video.description}</p>
                  </div>
                </div>
              </div>
            )}

            {item.document && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Document</h2>
                <a href={item.document.documentPath} target="_blank" rel="noopener noreferrer" className="block p-4" onClick={() => handleDocumentClick(item.orderNumber)}>
                  <div className="relative">
                    <FaDochub size={40} className="text-blue-500 mx-auto mb-4" />
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-semibold text-gray-800">{item.document.docName}</h3>
                    <p className="text-md text-gray-600 mt-2">{item.document.description}</p>
                  </div>
                </a>
              </div>
            )}

            {item.quiz && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Quiz</h2>
                <div className="border rounded-lg p-4">
                  <h3 className="text-md font-semibold mb-2">{item.quiz.title}</h3>
                  {item.quiz.questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-4">
                      <p className="font-medium">{question.questionText}</p>
                      <ul className="mt-2">
                        {question.choices.map((choice, aIndex) => (
                          <li key={aIndex}>
                            <label>
                              <input
                                type="radio"
                                name={`q${qIndex}`}
                                value={choice.text}
                                onChange={() => handleAnswerSelect(qIndex, aIndex)}
                                required
                              />
                              {choice.text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                    onClick={() => handleSubmitQuiz(item.quiz)}
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
