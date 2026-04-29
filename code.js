
const Users = require("../Models/User_Model");
const { setUser, getUser } = require("../Services.js/Service_Auth");
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

async function Google_Login_User(req, res) {
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
                role: 'normal',
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


async function User_SignUp(req, res) {
    const { name, email, password } = req.body;

    const temp_user = await Users.findOne({ email: email.trim().toLowerCase() })

    if (temp_user) {
        return res.status(409).json({ Error: "Email id already exist. Please change it" });
    }

    if (!name || !email || !password) {
        return res.status(400).json({ Error: "All fields are necessary" })
    }

    const hashedPassword = await argon2.hash(password);
    try {
        await Users.create({
            name,
            email,
            role: 'normal',
            password: hashedPassword,
        });

        return res.status(200).json({ Message: "User Created" });
    }
    catch (e) {
        console.log('Error: ', e);
        return res.status(500).json({ Error: "User Error" });
    }
}

async function User_Login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(409).json({ Error: "Email and password are required" });
    }
    try {

        const user = await Users.findOne({ email: email.trim().toLowerCase() })

        if (!user) {
            return res.status(401).json({ Error: 'Invalid Email' });
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).json({ Error: 'Wrong Password' })
        }

        const token = setUser(user);
        return res.json({ token });
    }
    catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({ Error: "Internal Server Error" });

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

    //  Send Email
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


async function verify_token(req, res) {
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



async function Google_Login_Admin(req, res) {
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
                role: 'admin',
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

async function Admin_SignUp(req, res) {
    const { name, email, password } = req.body;

    const temp_user = await Users.findOne({ email: email.trim().toLowerCase() })

    if (temp_user) {
        return res.status(409).json({ Error: "Email id already exist. Please change it" });
    }

    if (!name || !email || !password) {
        return res.status(400).json({ Error: "All fields are necessary" })
    }

    const hashedPassword = await argon2.hash(password);
    try {
        await Users.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        return res.status(200).json({ Message: "User Created" });
    }
    catch (e) {
        console.log('Error: ', e);
        return res.status(500).json({ Error: "User Error" });
    }
}

async function Admin_Login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(409).json({ Error: "Email and password are required" });
    }
    try {

        const user = await Users.findOne({ email: email.trim().toLowerCase() })

        if (!user) {
            return res.status(401).json({ Error: 'Invalid Email' });
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).json({ Error: 'Wrong Password' })
        }

        const token = setUser(user);
        return res.json({ token });
    }
    catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({ Error: "Internal Server Error" });

    }
}

module.exports = {
    User_SignUp,
    User_Login,
    User_PasswordReset,
    User_ForgotPassword,
    User_ApplyJob,
    User_AppliedJobs,
    getJobApplications,
    Google_Login_User,
    verify_token,
    Google_Login_Admin,
    Admin_Login,
    Admin_SignUp
}
