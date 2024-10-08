import connect from '@/utils/db';
import Quiz from '@/model/Quiz';

export default async function handler(req, res) {
  await connect();

  const { method } = req;
  const { id, taken } = req.query;
  const { courseCode } = req.query;
  console.log("course code: ", courseCode);
  
  switch (method) {
    // 1. Create a new quiz
    case 'POST':
      if (courseCode) {
        try {
          const { questions } = req.body;
    
          // Log the request body and courseCode to ensure the request data is correct
          console.log("Request body:", req.body);
          console.log("Course code:", courseCode);
    
          // Create new quiz object
          const newQuiz = new Quiz({
            courseCode,
            questions,
          });
    
          // Save the new quiz to the database
          await newQuiz.save();
    
          // Log success message if the quiz is successfully created
          console.log("Quiz created successfully:", newQuiz);
    
          // Return success response
          res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
        } catch (error) {
          // Log detailed error message to the console
          console.error("Error creating quiz:", error);
    
          // Return error response
          res.status(400).json({ message: 'Error creating quiz', error: error.message });
        }
      } else {
        // Log a message if courseCode is not provided
        console.error("Error: courseCode is missing");
        res.status(400).json({ message: 'courseCode is required' });
      }
      break;
    


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
            console.log("course code11: ", courseCode);
            const quizzes = await Quiz.find({courseCode} );
            console.log("all quizes: ", quizzes);
            res.status(200).json( quizzes );
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
        if(taken){
          const updateQuiz = await Quiz.findByIdAndUpdate(
            id, {taken}, {new:true}
          ); 

          if (!updateQuiz){
            console.log("Quiz not found");
            return Response.json("Quiz not found");
          }

          console.log("Quiz Updated");
          return Response.json("Quiz successfully taken");
        }
        const { questions } = req.body;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
          id,
          { questions, updatedAt: Date.now() },
          { new: true } 
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
