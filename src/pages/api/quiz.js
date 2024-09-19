import connect from '@/utils/db';
import Quiz from '@/model/Quiz';

export default async function handler(req, res) {
  await connect();

  const { method } = req;
  const { id } = req.query;
  const { courseCode } = req.query;
  console.log("course code: ", courseCode);
  
  switch (method) {
    // 1. Create a new quiz
    case 'POST':
      if (courseCode){
        try {
          const { title, questions } = req.body;
  
          console.log("requist: ", req.body);
  
          const newQuiz = new Quiz({
            courseCode,
            title,
            questions,
          });
  
          await newQuiz.save();
          res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
        } catch (error) {
          res.status(400).json({ message: 'Error creating quiz', error: error.message });
        }
        break;
      }


    // 2. Get all quizzes or get a specific quiz by ID
    case 'GET':
      if (courseCode){
        try {
          if (id) {
            // If an ID is passed, fetch the specific quiz
            const quiz = await Quiz.findById(id);
            console.log("quiz id: ", id);
            if (!quiz) {
              return res.status(404).json({ message: 'Quiz not found' });
            }
            res.status(200).json({ quiz });
          } else {
            // If no ID, fetch all quizzes
            console.log("course code1: ", courseCode);
            const quizzes = await Quiz.find({courseCode} );
            res.status(200).json({ quizzes });
          }
        } catch (error) {
          res.status(400).json({ message: 'Error fetching quizzes', error: error.message });
        }
        break;
      }

    // 3. Update a quiz by ID
    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ message: 'Quiz ID is required for updating' });
        }
        const { title, questions } = req.body;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
          id,
          { title, questions, updatedAt: Date.now() },
          { new: true } // Return the updated quiz
        );

        if (!updatedQuiz) {
          return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
      } catch (error) {
        res.status(400).json({ message: 'Error updating quiz', error: error.message });
      }
      break;

    // 4. Delete a quiz by ID
    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ message: 'Quiz ID is required for deletion' });
        }

        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz) {
          return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz deleted successfully' });
      } catch (error) {
        res.status(400).json({ message: 'Error deleting quiz', error: error.message });
      }
      break;

    // Method not allowed
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
