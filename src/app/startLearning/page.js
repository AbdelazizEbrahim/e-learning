'use client';

import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSearchParams } from 'next/navigation';
import { FaPlayCircle, FaDochub } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

export default function StartLearning() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('courseCode');

  const [documents, setDocuments] = useState([]);
  const [name, setName ] = useState(null);
  const [email, setEmail ] = useState(null);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]); 
  const [playingVideoId, setPlayingVideoId] = useState(null); 
  const [quizVisible, setQuizVisible] = useState({}); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [takenQuizzes, setTakenQuizzes] = useState([])
  const [quizResults, setQuizResults] = useState([]); 
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [docOpened, setDocOpened] = useState(false);
  const [interactionState, setInteractionState] = useState({}); 
  let email1;

  useEffect(() => {
    if (courseCode) {
      fetchDocuments();
      fetchVideos();
      fetchQuizzes();
      fetchName();
      fetchTakenQuizzes(email1);
    }
  }, [courseCode]);

  const totalTakenQuizzes = takenQuizzes.length; // Total quizzes taken
  const totalAnsweredQuizzes = takenQuizzes.filter(quiz => quiz.isAnswered).length;

  const percentage = totalTakenQuizzes > 0 ? (totalAnsweredQuizzes / totalTakenQuizzes) * 100 : 0;

  useEffect(() => {
    if (quizzes.length > 0) {
      const quizMap = new Map(quizzes.map(quiz => [quiz.questions[0]?.orderNumber, quiz]));
    }
  }, [quizzes]);
  
  const fetchTakenQuizzes = async (email) => {
    // if (!email) {
    //   return;
    // }
      console.log('Fetching taken quizzes for:', email, courseCode);
      const response = await fetch(`/api/takenQuiz?userEmail=${email}&courseCode=${courseCode}`);
      const data = await response.json();
      
      // Log the fetched taken quizzes
      console.log("Fetched taken quizzes: ", data);
      
      // Set the taken quizzes state
      setTakenQuizzes(data);
   
  };
  

  const handleAnswerSelect = (quizId, questionId, selectedChoice) => {
    const updatedResults = { ...quizResults };
  
    if (!updatedResults[quizId]) {
      updatedResults[quizId] = {};
    }
  
    const isCorrect = selectedChoice.isCorrect;
    updatedResults[quizId][questionId] = {
      isCorrect,
      submitted: false,
    };
  
    setQuizResults(updatedResults);
    setIsAnswered(isCorrect); // Store whether the answer is correct
  };
  
  const handleQuizSubmitToDb = async (quiz, userEmail, courseCode) => {

    // const order
    const orderNumber = quiz.questions[0]?.orderNumber;
    const quizId = quiz._id;
    console.log("Submitting quiz data:", { orderNumber, userEmail, courseCode, isAnswered, quizId });
  
    try {
      const response = await fetch(`/api/takenQuiz?courseCode=${courseCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          quizId,
          userEmail,
          isAnswered
        }),
      });
      setShowAnswer(true);

      const result = await response.json();
      console.log("Quiz response:", response);
      console.log("Quiz data:", result);

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${response.status} - ${errorDetails.message}`);
      }
  
      console.log("Quiz submitted successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to submit quiz:", error.message);
    }
  };
  
  const handleSubmitQuiz = (quiz) => {
    const quizId = quiz._id;
    const updatedResults = { ...quizResults };
  
    if (!updatedResults[quizId]) {
      updatedResults[quizId] = {};
    }
  
    quiz.questions.forEach((question) => {
      if (!updatedResults[quizId][question._id]) {
        updatedResults[quizId][question._id] = {};
      }
      updatedResults[quizId][question._id].submitted = true; 
    });
  
    handleQuizSubmitToDb(quiz, email, courseCode);
    setQuizResults(updatedResults); 
    setQuizSubmitted(true);
  };
  
  const fetchName = async () => {
    const token = localStorage.getItem('authToken');
  
    if (token) {
      const decoded = jwtDecode(token);
      email1 = decoded.email;
      setEmail(email1);
      let api;
  
      if (email1) {
        if (decoded.role === 'user'){
          api = 'userProfile'
        } else if (decoded.role === 'instructor') {
          api = 'instructorProfile'
        }
        try {
          const response = await fetch(`/api/${api}?email=${email1}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, 
              'Content-Type': 'application/json', 
            },
          });
  
          console.log('response:', response);
          if (response.ok) {
            const data = await response.json();
            console.log("data: ", data);
            const name = data.data.fullName.split(' ')[0];
            setName(name);
          } else {
            console.error('Failed to fetch user profile:', response.statusText);
          }

        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        console.error('Email not found in token');
      }
    } else {
      console.error('No auth token found');
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

      console.log("quiz response: ", response);
      console.log("quiz data: ", data);
  
      const quizzesArray = Array.isArray(data) ? data : [];
  
      const sortedQuizzes = quizzesArray.sort((a, b) => {
        const aOrderNumber = a?.questions[0]?.orderNumber || 0;
        const bOrderNumber = b?.questions[0]?.orderNumber || 0;
        return aOrderNumber - bOrderNumber;
      });
  
      console.log("sorted quizes: ", sortedQuizzes);
      setQuizzes(sortedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleDocumentClick = (orderNumber) => {
    setDocOpened(true);
  
    setInteractionState((prevState) => ({
      ...prevState,
      [orderNumber]: {
        ...prevState[orderNumber],
        docOpened: true,  // Track that the document was opened
      }
    }));
  };
  
  const handlePlayVideo = (videoId, orderNumber) => {
    setPlayingVideoId(videoId === playingVideoId ? null : videoId);
  
    setInteractionState((prevState) => ({
      ...prevState,
      [orderNumber]: {
        ...prevState[orderNumber],
        videoPlayed: true,  // Track that the video was played
      }
    }));
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
  console.log("Combined content: ", combinedContent);

  return (
    <div className="container mx-auto p-6">
      {/* Counter */}
      <div className="fixed top-16 right-0 w-32 h-32 p-2 z-30 bg-gray-400 rounded-full">
      <CircularProgressbar className=''
        value={percentage} 
        text={`${Math.round(percentage)}%`} 
        styles={buildStyles({
          pathColor: '#3b82f6', 
          textColor: '#000', 
          trailColor: '#f4f4f4',
          textSize: '16px', 
        })} 
      />
      <div className="absolute inset-0 items-center mt-16 justify-center text-center">
        <span className="text-lg font-semibold -mb-10">{totalAnsweredQuizzes}/{totalTakenQuizzes}</span>
        <span className="text-sm"> </span>
      </div>
    </div>
      <h2 className="text-xl font-semibold mb-4">Hello, Welcome {name}</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Combined Content */}
        {combinedContent.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg max-w-3xl mx-auto">

            {item.video && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Video</h2>
                <div className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {playingVideoId === item.video._id ? (
                    <div className="relative w-full h-72">
                      <video
                        className="w-full h-full rounded-lg"
                        src={item.video.videoPath}
                        controls
                        autoPlay
                      />
                      <button 
                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2" 
                        onClick={() => handlePlayVideo(null, item.orderNumber)} // Stop playback
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative cursor-pointer w-full h-48 bg-cover bg-center rounded-lg"
                      style={{
                        backgroundImage: `url(${item.video.thumbnail || '/bg.jpg'})`,
                      }}
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
                <div className="relative border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <a
                    href={item.document.documentPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4"
                    onClick={() => handleDocumentClick(item.orderNumber)}
                  >
                    <div className="relative">
                      <FaDochub size={40} className="text-blue-500 mx-auto mb-4" />
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="text-xl font-semibold text-gray-800">{item.document.docName}</h3>
                      <p className="text-md text-gray-600 mt-2">{item.document.description}</p>
                    </div>
                  </a>
                </div>
              </div>
            )}

         {/* Quiz Section */}
            {item.quiz && interactionState[item.orderNumber]?.videoPlayed && interactionState[item.orderNumber]?.docOpened && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">{item.quiz.title}</h2>
                <div className="border rounded-lg p-4">
                  {item.quiz.questions.map((question, qIndex) => (
                    <div key={question._id} className="mb-4">
                      <p className="font-medium">
                        {question.orderNumber}. {question.questionText}
                      </p>
                      <ul className="mt-2">
                        {question.choices.map((choice, aIndex) => (
                          <li key={aIndex}>
                            <label>
                              <input
                                type="radio"
                                name={`q${question._id}`}
                                value={choice.text}
                                onChange={() => handleAnswerSelect(item.quiz._id, question._id, choice)}
                                disabled={quizResults[item.quiz._id]?.[question._id]?.submitted}
                              />
                              {choice.text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Submit button for each quiz */}
                  <button
                    onClick={() => handleSubmitQuiz(item.quiz)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    disabled={takenQuizzes.some(takenQuiz => takenQuiz.quizId === item.quiz._id)}
                  >
                    {takenQuizzes.some(takenQuiz => takenQuiz.quizId === item.quiz._id) ? 'Quiz Already Taken' : 'Take Quiz'}
                  </button>

                  {/* Show the quiz results if submitted */}
                  {quizResults[item.quiz._id]?.submitted && (
                    <div
                      className={`mt-4 ${isAnswered ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isAnswered ? 'Correct!' : 'Incorrect.'}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
