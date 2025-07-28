const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        default: "Anonymous",
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    linkedin: {
        type: String,
        trim: true,
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn profile URL'],
    },
    currentRole: {
        type: String,
        trim: true,
        required: true,
    },
    companyName: {
        type: String,
        trim: true,
        required: true,
    },
    offer: {
      type: String,
        trim: true,
        enum: ["Accepted", "Rejected"],
        required: true,
    },
    experience: {
        type: String,
        trim: true,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
        trim: true,
        enum: ["Easy", "Medium", "Hard"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Assuming your user model name is "User"
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],

  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", ExperienceSchema);
module.exports = Experience;


