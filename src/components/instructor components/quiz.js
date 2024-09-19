'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const QuizPage = () => {
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      orderNumber: 0,
      choices: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);

  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizeAddForm, setQuizeAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  
  const searchParams = useSearchParams();

  const courseCode = searchParams.get('courseCode');

  // Fetch quizzes when the component mounts
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`/api/quiz?courseCode=${courseCode}`);
      const data = await response.json();
      setQuizzes(data.quizzes || []);

      console.log("response: ", response)
      console.log("data: ", data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }

  };




  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices[choiceIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const addChoice = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.push({ text: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        orderNumber: questions.length,
        choices: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleSubmit = async () => {
    // Check that each question has at least one correct choice selected
    const isValid = questions.every((question) =>
      question.choices.some((choice) => choice.isCorrect)
    );
  
    if (!isValid) {
      alert("Please select the correct answer for each question.");
      return; // Prevent form submission if validation fails
    }
  
    setIsLoading(true);
  
    try {
      if (editMode) {
        console.log("current quiz ID: ", currentQuizId);
        // Update the existing quiz
        const response = await fetch(`/api/quiz?id=${currentQuizId}`, {
          method: 'PUT',
          body: JSON.stringify({ questions }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          fetchQuizzes(); // Refresh quizzes list
          resetForm(); // Reset the form after updating
        }
      } else {
        // Create a new quiz
        console.log("courseCode: ", courseCode);
        const response = await fetch(`/api/quiz?courseCode=${courseCode}`, {
          method: 'POST',
          body: JSON.stringify({ questions }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          fetchQuizzes(); // Refresh quizzes list
          resetForm(); // Reset the form after creating
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const resetForm = () => {
    setQuestions([
      {
        questionText: '',
        orderNumber: 0,
        choices: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
    setEditMode(false); // Exit edit mode
    setCurrentQuizId(null); // Clear the current quiz ID
  };
  
  

  const handleUpdate = (quiz) => {
    console.log("Quiz: ", quiz);
    setQuestions(quiz.questions); 
    setEditMode(true); 
    setCurrentQuizId(quiz._id); 
  };
  

  const handleDelete = async (quizId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quiz?id=${quizId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchQuizzes(); // Refresh quizzes list
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Upload Quiz</h1>
      <button
        onClick={() => setQuizeAddForm(!quizeAddForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {quizeAddForm ? 'Cancel' : 'Upload Quiz'}
      </button>

      {quizeAddForm && (
        <div>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-6 border p-4 rounded-md bg-gray-100">
              <label className="block font-semibold mb-2">
                Question {questionIndex + 1} (Order Number: {question.orderNumber})
              </label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, 'questionText', e.target.value)
                }
                placeholder="Enter the question"
                className="p-2 border w-full rounded mb-4"
              />

              <label className="block mb-2">Order Number</label>
              <input
                type="number"
                value={question.orderNumber}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, 'orderNumber', parseInt(e.target.value))
                }
                className="p-2 border w-full rounded mb-4"
              />

              <h3 className="font-semibold mb-2">Choices</h3>
              {question.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="mb-2 flex items-center">
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) =>
                      handleChoiceChange(questionIndex, choiceIndex, 'text', e.target.value)
                    }
                    placeholder={`Choice ${choiceIndex + 1}`}
                    className="p-2 border rounded w-full mr-2"
                  />
                  <label className="mr-2">
                    <input
                      type="radio"
                      name={`correctChoice-${questionIndex}`}
                      checked={choice.isCorrect}
                      required
                      onChange={() => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].choices = updatedQuestions[
                          questionIndex
                        ].choices.map((c, i) => ({ ...c, isCorrect: i === choiceIndex }));
                        setQuestions(updatedQuestions);
                      }}
                    />{' '}
                    Correct
                  </label>
                </div>
              ))}

              <button
                onClick={() => addChoice(questionIndex)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                + Add Choice
              </button>
            </div>
          ))}

          <button onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            + Add Question
          </button>

          <button
  onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : editMode ? 'Update Quiz' : 'Submit Quiz'}
          </button>

        </div>
      )}

      {/* Display quizzes with update and delete options */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Existing Quizzes</h2>
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="border p-4 mb-4">
            <h3 className="font-semibold text-lg">{quiz.title}</h3>
            {quiz.questions.map((q, idx) => (
              <div key={idx}>
                <p>
                  <strong>
                    {q.orderNumber}. {q.questionText}
                  </strong>
                </p>
                <ul>
                  {q.choices.map((choice, i) => (
                    <li key={i} className={choice.isCorrect ? 'text-green-500' : ''}>
                      {choice.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => handleUpdate(quiz)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Update Quiz
            </button>
            <button
              onClick={() => handleDelete(quiz._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
