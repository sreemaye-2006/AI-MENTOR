const User = require("../models/User");
const StudyPlan = require("../models/StudyPlan");
const Interview = require("../models/Interview");
const Performance = require("../models/Performance");

const { callLyzrAgent } = require("../services/lyzrService");

exports.generatePerformance = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        const studyPlan = await StudyPlan.findOne({
            user: user._id
        });

        const interviews = await Interview.find({
            user: user._id
        });

        const prompt = `
Analyze the student's performance.

Name: ${user.name}

Role: ${user.currentRoleGoal}

Study Completion:
${studyPlan?.progress || 0}%

Interview Attempts:
${interviews.length}

Interview Scores:
${interviews.map(i => i.totalScore).join(", ")}

Known Skills:
${user.knownSkills.join(", ")}

Weak Subjects:
${user.weakSubjects.join(", ")}

Generate:

Overall Progress

Average Score

Learning Trend

Strong Skills

Weak Skills

Priority Topics

Role Readiness

Improvement Suggestions

Next Learning Focus
`;

        const aiResponse = await callLyzrAgent(

            process.env.PERFORMANCE_AGENT_ID,

            user.email,

            `${user._id}-performance`,

            prompt

        );
        await Performance.create({

    user:user._id,

    studyCompletion:studyPlan?.progress || 0,

    averageInterviewScore:75,

    learningTrend:"Improving",

    strongestSkills:["HTML","CSS"],

    weakestSkills:["React"],

    priorityTopics:["React"],

    roleReadiness:70,

    improvementSuggestions:[
        "Practice React",
        "Build Projects"
    ],

    nextLearningFocus:"React"

});

        res.json(aiResponse);

    }

    catch (error) {

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};