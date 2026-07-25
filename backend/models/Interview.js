const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    interviewDate: {
      type: Date,
      default: Date.now,
    },

    questions: [
      {
        question: String,
        answer: String,
        feedback: String,
        score: Number,
      },
    ],

    totalScore: {
      type: Number,
      default: 0,
    },

    strengths: [String],

    weaknesses: [String],

    overallFeedback: {
      type: String,
    },

    recommendation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);