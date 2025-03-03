const mongoose = require("mongoose");

const JobProfileSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      unique: true,
    },

    requirements: {
      type: [String],
      required: true,
    },


    questions: {
      type: [
        {
          questionText: { type: String, required: true },

          difficulty: {
            type: String,
            required: true,
            enum: ["easy", "medium", "hard"],
            required: true,
          },
        },
      ],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const JobProfile = mongoose.model("JobProfile", JobProfileSchema);
module.exports = JobProfile;
