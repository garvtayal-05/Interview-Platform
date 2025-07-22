const Users = require("../Models/User_Model");
const { setUser, getUser } = require("../Services.js/Service_Auth");
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");


const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const JobProfile = require("../Models/JobProfile_Model");

const upload = multer({ storage: multer.memoryStorage() });

const SUPPORTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "image/png",
  "image/jpeg",
  "image/jpg",
];

// Gemini API configuration
const GEMINI_API_KEY = process.env.API_KEY; // Store your API key in environment variables
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Utility function to format text
function formatText(text) {
  return text
    .replace(/\n\s+/g, "\n") // Fix extra spaces at the start of lines
    .replace(/(\S)\n(\S)/g, "$1 $2") // Fix words broken into multiple lines
    .replace(/\n{2,}/g, "\n\n"); // Keep paragraph spacing
}

// Utility function to clean text
function cleanText(text) {
  return text
    .replace(/\*\*/g, "") // Remove double asterisks
    .replace(/\*/g, "") // Remove single asterisks
    .replace(/```/g, "") // Remove backticks
    .replace(/`/g, "") // Remove single backticks
    .replace(/#/g, "") // Remove hashtags (Markdown headers)
    .replace(/\n\s+/g, "\n") // Fix extra spaces at the start of lines
    .replace(/(\S)\n(\S)/g, "$1 $2") // Fix words broken into multiple lines
    .replace(/\n{2,}/g, "\n\n") // Keep paragraph spacing
    .trim(); // Remove leading/trailing whitespace
}

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);

  if (data.text.trim()) {
    return formatText(data.text); // Return formatted text
  } else {
    // If no text is found, extract text from images in the PDF
    return extractTextFromImage(buffer);
  }
}

// Extract text from DOCX
async function extractTextFromDOCX(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return formatText(result.value.trim() || "");
}

// Extract text from image using OCR
async function extractTextFromImage(buffer) {
  const processedImage = await sharp(buffer)
    .grayscale()
    .normalize() // Improve contrast
    .sharpen() // Enhance edges
    .toBuffer();

  const { data } = await Tesseract.recognize(processedImage, "eng", {
    preserve_interword_spaces: 1, // Preserve spaces between words
  });

  return formatText(data.text.trim() || "");
}

// Extract text from file based on file type
async function extractTextFromFile(buffer, fileType) {
  let extractedText = "";

  if (fileType === "application/pdf") {
    extractedText = await extractTextFromPDF(buffer);
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    extractedText = await extractTextFromDOCX(buffer);
  } else if (fileType.startsWith("image/")) {
    extractedText = await extractTextFromImage(buffer);
  }

  return extractedText;
}

// Send extracted text to Gemini API for structuring
async function sendToGeminiAPI(text) {
    try {
      const prompt = `
        Extract the following details from the text and structure them into the following format:
        - Name: <name>
        - Summary: <summary>
        - Education: <education>
        - Projects: <projects>
        - Skills: <skills>
        - Contact: <contact>
  
        Text: ${text}
      `;
  
      const result = await model.generateContent(prompt);
  
      if (result.response && result.response.text) {
        const structuredText = result.response.text();
  
        // Clean the structured text to remove unwanted characters
        const cleanedText = cleanText(structuredText);
  
        return cleanedText;
      } else {
        throw new Error("Failed to structure text with Gemini API");
      }
    } catch (error) {
      console.error("Error sending text to Gemini API:", error);
      throw new Error("Failed to process text with Gemini API");
    }
  }
// Create user profile
async function User_CreateProfile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileType = req.file.mimetype;

    // Validate file type
    if (!SUPPORTED_FILE_TYPES.includes(fileType)) {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, or image." });
    }

    // Extract text from the file
    let extractedText = await extractTextFromFile(req.file.buffer, fileType);
    console.log("Extracted Text:", extractedText);

    // Send extracted text to Gemini API for structuring
    let structuredText = await sendToGeminiAPI(extractedText);
    console.log("Structured Text:", structuredText);

    // Save the structured text to the user's profile
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profileText = structuredText;
    await user.save();

    // Return the structured text in the response
    console.log(structuredText)
    return res.status(200).json({ message: "Profile created successfully", profileText: structuredText });
  } catch (error) {
    console.error("Error in User_CreateProfile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}





async function Google_Login(req, res) {
  const { name, email, googleId } = req.body;

  if (!email || !googleId || !name) {
    return res.status(400).json({ Error: "Missing Google credentials" });
  }

  try {
    let user = await Users.findOne({ email });

    if (!user) {
      // New User ➜ Signup
      user = await Users.create({
        name,
        email,
        password: googleId, // not secure, only for dummy field (you can use a separate field like isGoogleUser: true)
      });
    }

    const token = setUser(user); // your custom JWT generator
    return res.status(200).json({ token });
  } catch (err) {
    console.log("Google Login Error:", err);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
}


async function User_SignUp(req, res){
    const {name, email, password} = req.body;

        const temp_user = await Users.findOne({email: email.trim().toLowerCase()})
        
        if(temp_user){
            return res.status(409).json({Error: "Email id already exist. Please change it"});
        }

    if(!name || !email || !password){
        return res.status(400).json({Error: "All fields are necessary"})
    }
    
    const hashedPassword = await argon2.hash(password);
    try{
        await Users.create({
         name, 
         email, 
         password: hashedPassword,
        });

        return res.status(200).json({Message: "User Created"});
    }
    catch(e){
        console.log('Error: ', e);
        return res.status(500).json({Error: "User Error"});
    }
}

async function User_Login(req,res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(409).json({Error: "Email and password are required"});
    }
    try{

        const user = await Users.findOne({email: email.trim().toLowerCase()})

        if(!user){
            return res.status(401).json({Error: 'Invalid Email'});
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if(!isPasswordValid){
            return res.status(401).json({Error: 'Wrong Password'})
        }

        const token = setUser(user);
        return res.json({token});
    }
    catch(err){
        console.log("Error: " ,err);
        return res.status(500).json({Error : "Internal Server Error"});

    }
}

async function User_ForgotPassword(req, res) {
  const { email } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: "If user exists, an email will be sent" }); // Don't leak user info
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  // ✅ Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AceBoard" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Link",
    html: `<p>Click the link below to reset your password. This link will expire in 10 minutes:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  return res.status(200).json({ message: "Reset link sent if user exists" });
}


async function User_PasswordReset(req, res) {
  const { resetToken, newPassword } = req.body;
  const token = resetToken;
console.log(req.body)
  if (!token) return res.status(400).json({ Error: "Token required" });

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ email });

    if (!user) return res.status(404).json({ Error: "User not found" });

    if (newPassword.length < 6) {
      return res.status(400).json({ Error: "Password must be at least 6 characters" });
    }

    user.password = await argon2.hash(newPassword);
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res.status(401).json({ Error: "Token is invalid or expired" });
  }
}


async function verify_token(req, res){
   const { resetToken } = req.body;

  try {
    jwt.verify(resetToken, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


const User_ApplyJob = async (req, res) => {
  try {
    const { _id } = req.params; // Job ID
    const { interviewDate } = req.body; // Interview date from the request body
    const userId = req.user._id; // Get user ID from request

    // Validate interview date
    if (!interviewDate) {
      return res.status(400).json({ error: "Interview date is required" });
    }

    // Find user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already applied
    const alreadyApplied = user.appliedJobs.some(
      (job) => job.jobId && job.jobId.equals(new mongoose.Types.ObjectId(_id))
    );
    if (alreadyApplied) {
      return res.status(400).json({ error: "You have already applied for this job" });
    }

    // Apply job with interview date
    user.appliedJobs.push({ jobId: _id, interviewDate: new Date(interviewDate) });
    await user.save();

    res.status(200).json({ message: "Job applied successfully" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Failed to apply for job" });
  }
};


async function User_AppliedJobs(req, res) {
  try {
    const user = await Users.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.appliedJobs || user.appliedJobs.length === 0) {
      return res.status(404).json({ message: "No applied jobs found" });
    }

    const jobIds = user.appliedJobs.map(job => job.jobId);
    const jobs = await JobProfile.find({ _id: { $in: jobIds } });

    return res.status(200).json({ appliedJobs: jobs });

  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



  const getJobApplications = async (req, res) => {
    try {
      const userId = req.user._id; // Current logged-in user (job creator)
  
      // 1. Find all jobs created by this user
      const myJobs = await JobProfile.find({ createdBy: userId }).select('_id jobTitle');
      
      if (!myJobs.length) {
        return res.status(200).json({ 
          message: "No jobs posted yet", 
          applications: [] 
        });
      }
  
      const myJobIds = myJobs.map(job => job._id);
  
      // 2. Find all applications for these jobs
      const applicants = await Users.find({
        'appliedJobs.jobId': { $in: myJobIds }
      }).select('name email appliedJobs');
  
      // 3. Transform the data
      const applications = [];
      
      applicants.forEach(user => {
        user.appliedJobs.forEach(application => {
          if (application.jobId && myJobIds.some(id => id.equals(application.jobId))) {
            // Find the corresponding job details
            const job = myJobs.find(j => j._id.equals(application.jobId));
            
            applications.push({
              jobId: application.jobId,
              jobTitle: job.jobTitle,
              candidateId: user._id,
              candidateName: user.name,
              candidateEmail: user.email,
              appliedAt: application.appliedAt,
              interviewDate: application.interviewDate || null
            });
          }
        });
      });
  
      res.status(200).json({ 
        success: true,
        count: applications.length,
        applications 
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch applications" 
      });
    }
  };

module.exports={
    User_SignUp,
    User_Login,
    User_PasswordReset,
    User_ForgotPassword,
    User_CreateProfile,
    upload,
    User_ApplyJob,
    User_AppliedJobs,
    extractTextFromFile,
    cleanText,
    getJobApplications,
    Google_Login,
    verify_token
}