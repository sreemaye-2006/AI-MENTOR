const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roleGoal: {
      type: String,
      required: true,
    },

    durationWeeks: {
      type: Number,
      default: 8,
    },

    dailyStudyTime: {
      type: Number,
      default: 2,
    },

    studyPlan: [
      {
        week: Number,

        topics: [String],

        resources: [String],

        dailyTasks: [
          {
            task: String,
            completed: { type: Boolean, default: false }
          }
        ],

        revisionTopics: [String],
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },

    completedWeeks: {
      type: Number,
      default: 0,
    },

    estimatedCompletionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudyPlan", studyPlanSchema);