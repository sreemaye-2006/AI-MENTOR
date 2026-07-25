const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studyCompletion: {
      type: Number,
      default: 0,
    },

    averageInterviewScore: {
      type: Number,
      default: 0,
    },

    learningTrend: {
      type: String,
      enum: ["Improving", "Stable", "Declining"],
      default: "Stable",
    },

    strongestSkills: [
      {
        type: String,
      },
    ],

    weakestSkills: [
      {
        type: String,
      },
    ],

    priorityTopics: [
      {
        type: String,
      },
    ],

    roleReadiness: {
      type: Number,
      default: 0,
    },

    improvementSuggestions: [
      {
        type: String,
      },
    ],

    nextLearningFocus: {
      type: String,
      default: "",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Performance", performanceSchema);