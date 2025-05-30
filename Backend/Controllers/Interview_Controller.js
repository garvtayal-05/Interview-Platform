const Interview = require("../Models/Interview_Model");
const User = require("../Models/User_Model");
const JobProfile = require("../Models/JobProfile_Model");
const cloudinary = require("../Cloudinary_config");
const streamifier = require('streamifier');

// Helper function to calculate overall score
const calculateOverallScore = (scores) => {
  const validScores = scores.filter(score => typeof score === "number");
  return validScores.length > 0 
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
    : 0;
};

// Submit text interview
exports.submitTextInterview = async (req, res) => {
  try {
    const { jobId, answers } = req.body;
    const userId = req.user._id;

    const interview = new Interview({
      candidateId: userId,
      jobId,
      interviewType: "text",
      answers: answers.map(answer => ({
        questionId: answer.questionId,
        answerText: answer.answerText
      })),
      status: "completed",
      completedAt: new Date()
    });

    await interview.save();
    await User.updateOne(
      { _id: userId, "appliedJobs.jobId": jobId },
      { $set: { "appliedJobs.$.interviewId": interview._id } }
    );

    res.status(201).json({
      success: true,
      message: "Text interview submitted successfully",
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting text interview",
      error: error.message
    });
  }
};

exports.submitVideoInterview = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No video files uploaded'
      });
    }

    const { jobId, userId, answers } = req.body;
    const parsedAnswers = JSON.parse(answers);

    // Upload videos to Cloudinary
    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "interview_videos",
            public_id: `question_${index}_${Date.now()}`,
            chunk_size: 6000000 // 6MB chunks for larger files
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                questionId: parsedAnswers[index].questionId,
                videoUrl: result.secure_url,
                publicId: result.public_id
              });
            }
          }
        );
        
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const videoAnswers = await Promise.all(uploadPromises);

    // Save to database
    const interview = new Interview({
      candidateId: userId,
      jobId,
      interviewType: "video",
      answers: videoAnswers,
      status: "completed",
      completedAt: new Date()
    });

    await interview.save();

    res.status(201).json({
      success: true,
      message: "Video interview submitted successfully",
      interview
    });
  } catch (error) {
    console.error('Error submitting video interview:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting video interview'
    });
  }
};

// Get interviews for evaluation
exports.getInterviewsForEvaluation = async (req, res) => {
  try {
    const interviews = await Interview.find({ status: "completed" })
      .populate("candidateId", "name email")
      .populate("jobId", "jobTitle")
      .populate("answers.questionId", "questionText difficulty");

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching interviews",
      error: error.message
    });
  }
};

// Evaluate interview
exports.evaluateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { evaluations } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    // Update each answer by matching _id
    evaluations.forEach(e => {
      const answerToUpdate = interview.answers.id(e._id);
      if (answerToUpdate) {
        answerToUpdate.score = e.score;
        answerToUpdate.feedback = e.feedback;
      }
    });

    interview.overallScore = calculateOverallScore(evaluations.map(e => e.score));
    interview.status = "evaluated";
    interview.evaluatedAt = new Date();

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview evaluated successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error evaluating interview",
      error: error.message
    });
  }
};

// Get user's interview history
exports.getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidateId: req.user._id })
      .populate("jobId", "jobTitle")
      .populate("candidateId", "name email") 
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user interviews",
      error: error.message
    });
  }
};

// Get all interviews (admin only)
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('candidateId', 'name email')
      .populate('jobId', 'jobTitle')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};

// Get single interview details
exports.getInterviewDetails = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId)
      .populate('candidateId', 'name email')
      .populate('jobId', 'jobTitle requirements')
      .populate('answers.questionId', 'questionText difficulty');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interview details',
      error: error.message
    });
  }
};