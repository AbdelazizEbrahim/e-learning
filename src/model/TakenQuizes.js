import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

const TakenQuizSchema = new Schema({
    courseCode: {type: String},
    quizId: {type: String},
    orderNumber: {type: String},
    isAnswered: {type: Boolean, default :false },
    userEmail: {type: String},
})

const TakenQuiz = mongoose.models.TakenQuiz || mongoose.model("TakenQuiz", TakenQuizSchema);

export default TakenQuiz;