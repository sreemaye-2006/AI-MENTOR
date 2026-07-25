const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    currentRoleGoal: {
      type: String,
      default: "",
    },

    currentSemester: {
      type: Number,
      default: 1,
    },

    currentSkillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    knownSkills: [
      {
        type: String,
      },
    ],

    weakSubjects: [
      {
        type: String,
      },
    ],

    strongSubjects: [
      {
        type: String,
      },
    ],

    dailyStudyTime: {
      type: Number,
      default: 1,
    },

    targetDate: {
      type: Date,
    },

    previousProgress: {
      type: Number,
      default: 0,
    },

    lastStudySession: {
      type: Date,
    },

    accuracyPerTopic: [
      {
        topic: String,
        accuracy: Number,
      },
    ],

    completedTopics: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);