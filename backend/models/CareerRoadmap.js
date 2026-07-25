const mongoose = require("mongoose");

const careerRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    currentReadiness: {
      type: Number,
      default: 0,
    },

    missingSkills: [
      {
        type: String,
      },
    ],

    technologiesToLearn: [
      {
        technology: String,
        reason: String,
      },
    ],

    recommendedProjects: [
      {
        title: String,
        description: String,
        difficulty: String,
      },
    ],

    certifications: [
      {
        name: String,
        provider: String,
      },
    ],

    learningResources: [
      {
        title: String,
        url: String,
      },
    ],

    roadmapSteps: [
      {
        stepNumber: Number,
        title: String,
        description: String,
        resources: [
          {
            title: String,
            url: String
          }
        ]
      },
    ],

    interviewPreparation: [
      {
        type: String,
      },
    ],

    actionPlan: [
      {
        type: String,
      },
    ],

    generatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareerRoadmap", careerRoadmapSchema);