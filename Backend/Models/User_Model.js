const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensures email is stored in lowercase
      trim: true, // Removes leading/trailing spaces
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"], // Restrict values
      lowercase: true, // Ensures email is stored in lowercase
      trim: true, // Removes leading/trailing spaces
    },
    age: {
      type: Number,
      required: true,
      min: 1, // Prevent negative or zero age
    },
    role: {
      type: String,
      default: "normal", // Default role
      enum: ["admin", "normal"], // Allowed roles
      lowercase: true, // Ensures email is stored in lowercase
      trim: true, // Removes leading/trailing spaces
    },

    appliedJobs: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobProfile" },
        appliedAt: { type: Date, default: Date.now }, // Timestamp when applied
        interviewDate: { type: Date }, // Add this field for interview date
        interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" } // Add this line
      },
    ],

  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
