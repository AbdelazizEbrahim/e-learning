import connect from "@/utils/db";
import TakenQuiz from "@/model/TakenQuizes";

export default async function handler(req, res) {
    await connect();

    const { courseCode, userEmail } = req.query;
    console.log("email and course code: ", userEmail, courseCode)

    if (req.method === "GET") {
        // Handle GET request
        console.log("email and course code: ", userEmail, courseCode)
        if (courseCode && userEmail) {
            try {
                const takenQuiz = await TakenQuiz.find({ courseCode, userEmail });
                if (takenQuiz) {
                    console.log("taken quiz: ", takenQuiz);
                    return res.status(200).json(takenQuiz);
                } else {
                    return res.status(404).json({ message: "No quiz found for this course and user" });
                }
            } catch (error) {
                return res.status(500).json({ message: "Error retrieving quiz", error });
            }
        } else {
            return res.status(400).json({ message: "Missing courseCode or userEmail in query" });
        }
    }

    if (req.method === "POST") {
        // Handle POST request
        const { quizId, isAnswered, userEmail, orderNumber } = req.body;
        console.log("received post data: ", quizId, isAnswered, userEmail, courseCode);
        if (courseCode && userEmail && quizId !== undefined) {
            try {
                const newTakenQuiz = await TakenQuiz.create({ courseCode, userEmail, quizId, isAnswered, orderNumber });
                return res.status(201).json(newTakenQuiz);
            } catch (error) {
                return res.status(500).json({ message: "Error creating quiz entry", error });
            }
        } else {
            return res.status(400).json({ message: "Missing required fields in body or query" });
        }
    }

    // Return 405 Method Not Allowed if other methods are used
    return res.status(405).json({ message: "Method not allowed" });
}
