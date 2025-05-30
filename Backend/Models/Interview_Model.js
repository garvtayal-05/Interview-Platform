const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobProfile",
    required: true
  },
  answerText: String,
  videoUrl: String,
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  feedback: String
});

const InterviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobProfile",
    required: true
  },
  interviewType: {
    type: String,
    enum: ["text", "video"],
    required: true
  },
  answers: [AnswerSchema],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "completed", "evaluated"],
    default: "pending"
  },
  completedAt: Date,
  evaluatedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Interview", InterviewSchema);