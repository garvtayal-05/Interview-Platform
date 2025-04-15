const { GoogleGenerativeAI } = require("@google/generative-ai");
const { extractTextFromFile } = require("./User_Controller");
const STT = require('../Models/STT_Model');
const mongoose = require('mongoose');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const userSessions = {};

async function analyzeSpeech(req, res) {
  try {
    const { question, answer, userId, responseTime } = req.body; // Added responseTime
    if (!answer?.trim()) return res.status(400).json({ error: "Answer is required" });

    if (!userSessions[userId]) {
      userSessions[userId] = { 
        answers: [], 
        evaluations: [],
        sessionId: new mongoose.Types.ObjectId().toString(),
        startTime: new Date() // Track session start time
      };
    }

    const prompt = `Evaluate this interview answer (1-10) on:
      - Correctness
      - Grammar
      - Vocabulary
      - Fluency
      - Confidence
      - Relevance
      
      Question: "${question}"
      Answer: "${answer}"
      
      Respond with pure JSON (no markdown or code blocks):
      {
        "scores": {
          "correctness": number,
          "grammar": number,
          "vocabulary": number,
          "fluency": number,
          "confidence": number,
          "relevance": number
        },
        "feedback": "Specific improvement suggestions"
      }`;

    const evaluationStart = Date.now();
    const result = await model.generateContent(prompt);
    const evaluationTime = Date.now() - evaluationStart;

    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
    const response = JSON.parse(cleanedResponse);

    await STT.findOneAndUpdate(
      { sessionId: userSessions[userId].sessionId },
      {
        $set: { 
          userId,
          sessionDuration: evaluationTime // Track evaluation processing time
        },
        $push: {
          evaluations: {
            question,
            answer,
            responseTime, // Store the response time from frontend
            processingTime: evaluationTime, // Store backend processing time
            scores: response.scores,
            feedback: response.feedback
          }
        }
      },
      { upsert: true, new: true }
    );

    userSessions[userId].answers.push({ question, answer, responseTime });
    userSessions[userId].evaluations.push(response);

    res.json({
      ...response,
      timing: {
        responseTime,
        processingTime: evaluationTime
      }
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({ 
      error: "Failed to evaluate answer",
      details: error.message 
    });
  }
}

async function generateFinalEvaluation(req, res) {
  try {
    const { userId } = req.body;
    const session = userSessions[userId];
    if (!session?.evaluations.length) {
      return res.status(400).json({ error: "No evaluation data" });
    }

    // Calculate total session duration
    const sessionDuration = new Date() - session.startTime;

    const prompt = `Analyze this interview session and provide:
      1. Overall scores (1-10)
      2. Strengths
      3. Weaknesses  
      4. Recommendations
      
      Session: ${JSON.stringify(session.evaluations)}
      
      Return PURE JSON (no markdown or code blocks) with this structure:
      {
        "overallScores": {
          "technical": number,
          "communication": number,
          "problemSolving": number,
          "confidence": number  
        },
        "strengths": ["..."],
        "weaknesses": ["..."],
        "recommendations": ["..."]
      }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
    const response = JSON.parse(cleanedResponse);

    // Ensure arrays exist in the response
    if (!response.strengths) response.strengths = [];
    if (!response.weaknesses) response.weaknesses = [];
    if (!response.recommendations) response.recommendations = [];
    
    // Update with final evaluation and timing data
    await STT.findOneAndUpdate(
      { sessionId: session.sessionId },
      {
        $set: {
          overallEvaluation: response.overallScores,
          strengths: response.strengths,
          weaknesses: response.weaknesses,
          recommendations: response.recommendations,
          sessionDuration // Store total session duration
        }
      }
    );

    delete userSessions[userId];
    res.json({
      ...response,
      sessionDuration
    });
  } catch (error) {
    console.error("Final evaluation error:", error);
    res.status(500).json({ 
      error: "Failed to generate final evaluation",
      details: error.message 
    });
  }
}

async function generateQuestions(req, type, content){
  try {
    const prompt = type === 'resume' 
      ? `Generate 5 interview questions (Easy/Medium level) based on this resume(only questions no other thing):\n${content}`
      : `Generate 5 interview questions (Easy/Medium level) about ${content} (only questions no other thing)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return text.split("\n")
      .map(q => q.replace(/^\d+[).]\s*/, "").trim())
      .filter(q => q.length > 0)
      .slice(0,5);
  } catch (error) {
    console.error("Question generation error:", error);
    throw new Error("Failed to generate questions");
  }
};

async function generateResumeQuestions(req, res){
  try {
    if (!req.file) return res.status(400).json({ error: "Resume file required" });
    
    const resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    if (!resumeText?.trim()) return res.status(400).json({ error: "Failed to extract text" });

    const questions = await generateQuestions(req, 'resume', resumeText);
    console.log(questions)
    res.json({ introLine: "Generated resume-based questions:", questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function generateTopicQuestions(req, res){
  try {
    const { topic } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: "Topic required" });

    const questions = await generateQuestions(req, 'topic', topic);
    res.json({ introLine: `Generated questions about ${topic}:`, questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function getUserPerformance(req, res) {
  try {
    const { userId } = req.params;
    
    // Get all sessions for the user, sorted by date
    const sessions = await STT.find({ userId })
      .sort({ createdAt: 1 }) // Oldest first for progress tracking
      .lean();

    if (!sessions.length) {
      return res.status(404).json({ message: 'No interview sessions found for this user' });
    }

    // Calculate comprehensive analytics
    const analytics = {
      sessionCount: sessions.length,
      firstSessionDate: sessions[0].createdAt,
      lastSessionDate: sessions[sessions.length - 1].createdAt,
      overallScores: calculateOverallScores(sessions),
      categoryPerformance: getCategoryPerformance(sessions),
      progressTrends: getProgressTrends(sessions),
      feedbackAnalysis: getFeedbackAnalysis(sessions),
      timingMetrics: getTimingMetrics(sessions),
      recommendations: generateRecommendations(sessions)
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error generating performance report:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate performance report',
      error: error.message 
    });
  }
}

// Enhanced helper functions
function calculateOverallScores(sessions) {
  const result = {
    technical: { total: 0, count: 0, average: 0 },
    communication: { total: 0, count: 0, average: 0 },
    problemSolving: { total: 0, count: 0, average: 0 },
    confidence: { total: 0, count: 0, average: 0 }
  };

  sessions.forEach(session => {
    if (session.overallEvaluation) {
      for (const category in result) {
        if (session.overallEvaluation[category]) {
          result[category].total += session.overallEvaluation[category];
          result[category].count++;
        }
      }
    }
  });

  // Calculate averages
  for (const category in result) {
    result[category].average = result[category].count > 0 
      ? parseFloat((result[category].total / result[category].count).toFixed(2))
      : 0;
  }

  return result;
}


function getCategoryPerformance(sessions) {
  const categories = {};
  let totalQuestions = 0;

  sessions.forEach(session => {
    session.evaluations?.forEach(evaluation => {
      totalQuestions++;
      for (const [category, score] of Object.entries(evaluation.scores || {})) {
        categories[category] = categories[category] || { total: 0, count: 0 };
        categories[category].total += score;
        categories[category].count++;
      }
    });
  });

  const performance = {};
  for (const [category, data] of Object.entries(categories)) {
    performance[category] = {
      average: parseFloat((data.total / data.count).toFixed(2)),
      questionCount: data.count,
      percentage: parseFloat((data.count / totalQuestions * 100).toFixed(1))
    };
  }

  return performance;
}

function getProgressTrends(sessions) {
  const trends = [];
  const monthlyAverages = {};
  const categoryTrends = {};

  // Initialize data structures
  sessions.forEach(session => {
    const monthYear = session.createdAt.toISOString().slice(0, 7); // YYYY-MM format
    
    if (!monthlyAverages[monthYear]) {
      monthlyAverages[monthYear] = {
        technical: 0,
        communication: 0,
        problemSolving: 0,
        confidence: 0,
        count: 0
      };
    }

    if (session.overallEvaluation) {
      for (const category in session.overallEvaluation) {
        monthlyAverages[monthYear][category] += session.overallEvaluation[category];
        monthlyAverages[monthYear].count++;
      }
    }
  });

  // Calculate monthly averages
  for (const [month, data] of Object.entries(monthlyAverages)) {
    const entry = { date: month };
    for (const category in data) {
      if (category !== 'count') {
        entry[category] = parseFloat((data[category] / data.count).toFixed(2));
        
        // Initialize category trend if needed
        if (!categoryTrends[category]) {
          categoryTrends[category] = [];
        }
        categoryTrends[category].push({
          date: month,
          score: entry[category]
        });
      }
    }
    trends.push(entry);
  }

  return {
    monthlyTrends: trends,
    categoryTrends
  };
}

function getFeedbackAnalysis(sessions) {
  const feedback = {
    strengths: {},
    weaknesses: {},
    recommendations: new Set()
  };

  sessions.forEach(session => {
    // Process strengths
    session.strengths?.forEach(strength => {
      feedback.strengths[strength] = (feedback.strengths[strength] || 0) + 1;
    });

    // Process weaknesses
    session.weaknesses?.forEach(weakness => {
      feedback.weaknesses[weakness] = (feedback.weaknesses[weakness] || 0) + 1;
    });

    // Process recommendations
    session.recommendations?.forEach(rec => {
      feedback.recommendations.add(rec);
    });
  });

  return {
    topStrengths: Object.entries(feedback.strengths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([item]) => item),
    topWeaknesses: Object.entries(feedback.weaknesses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([item]) => item),
    uniqueRecommendations: Array.from(feedback.recommendations)
  };
}

function getTimingMetrics(sessions) {
  const metrics = {
    responseTimes: [],
    processingTimes: [],
    sessionDurations: []
  };

  sessions.forEach(session => {
    let sessionResponseTime = 0;
    let sessionProcessingTime = 0;
    let questionCount = 0;

    session.evaluations?.forEach(eval => {
      sessionResponseTime += eval.responseTime || 0;
      sessionProcessingTime += eval.processingTime || 0;
      questionCount++;
    });

    if (questionCount > 0) {
      metrics.responseTimes.push(sessionResponseTime / questionCount);
      metrics.processingTimes.push(sessionProcessingTime / questionCount);
    }
    
    if (session.sessionDuration) {
      metrics.sessionDurations.push(session.sessionDuration);
    }
  });

  const calculateStats = (arr) => {
    if (arr.length === 0) return null;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    return {
      average: parseFloat((sum / sorted.length).toFixed(2)),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      total: parseFloat(sum.toFixed(2))
    };
  };

  return {
    responseTime: calculateStats(metrics.responseTimes),
    processingTime: calculateStats(metrics.processingTimes),
    sessionDuration: calculateStats(metrics.sessionDurations),
    totalQuestions: sessions.reduce((sum, session) => sum + (session.evaluations?.length || 0), 0)
  };
}

function generateRecommendations(sessions) {
  const weaknesses = getFeedbackAnalysis(sessions).topWeaknesses;
  const recommendations = [];
  
  // Generate recommendations based on common weaknesses
  if (weaknesses.includes("technical knowledge")) {
    recommendations.push("Focus on studying core technical concepts relevant to your field");
  }
  
  if (weaknesses.includes("communication")) {
    recommendations.push("Practice explaining technical concepts to non-technical audiences");
    recommendations.push("Consider joining a public speaking group or taking communication courses");
  }
  
  if (weaknesses.includes("confidence")) {
    recommendations.push("Practice mock interviews to build confidence");
    recommendations.push("Review your strengths and accomplishments before interviews");
  }
  
  // Add general recommendations
  recommendations.push(
    "Review your previous interview recordings to identify improvement areas",
    "Schedule regular mock interviews to track your progress",
    "Focus on 1-2 improvement areas at a time for maximum impact"
  );
  
  return [...new Set(recommendations)]; // Remove duplicates
}

module.exports = {
  analyzeSpeech,
  generateFinalEvaluation,
  generateTopicQuestions,
  generateResumeQuestions,
  getUserPerformance
};