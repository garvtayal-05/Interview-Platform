const mongoose = require('mongoose');

const STT = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    evaluations: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        responseTime: {  // Simple response time in seconds
            type: Number,
            default: 0
        },
        scores: {
            correctness: Number,
            grammar: Number,
            vocabulary: Number,
            fluency: Number,
            confidence: Number,
            relevance: Number
        },
        feedback: {
            type: String,
            required: true
        }
    }],
    overallEvaluation: {
        technical: Number,
        communication: Number,
        problemSolving: Number,
        confidence: Number
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String]
}, { timestamps: true });  // createdAt and updatedAt handled automatically

module.exports = mongoose.model('STT', STT);