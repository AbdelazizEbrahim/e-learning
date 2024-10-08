const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Choice schema
const ChoiceSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },  
});

// Define Question schema
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  orderNumber: { type: Number, required: true },
  choices: [ChoiceSchema],
});

// Define Quiz schema
const QuizSchema = new Schema({
  courseCode: { type: String },
  questions: [QuestionSchema],
  taken: {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export the Quiz model
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

export default Quiz;