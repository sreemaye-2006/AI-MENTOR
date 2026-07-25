const User = require("../models/User");
const Performance = require("../models/Performance");
const CareerRoadmap = require("../models/CareerRoadmap");

const { callLyzrAgent } = require("../services/lyzrService");
exports.generateRoadmap = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const performance = await Performance.findOne({
      user: user._id
    }).sort({ createdAt: -1 });

    const prompt = `
Generate a personalized career roadmap.

Student Name: ${user.name}

Target Role:
${user.currentRoleGoal}

Current Skill Level:
${user.currentSkillLevel}

Study Completion:
${performance?.studyCompletion || 0}%

Average Interview Score:
${performance?.averageInterviewScore || 0}

Strong Skills:
${performance?.strongestSkills.join(", ") || ""}

Weak Skills:
${performance?.weakestSkills.join(", ") || ""}

Priority Topics:
${performance?.priorityTopics.join(", ") || ""}

Generate:

1. Missing Skills

2. Technologies to Learn

3. Projects

4. Certifications

5. Learning Resources

6. Step-by-step Roadmap

7. Interview Preparation

8. Action Plan
`;

    const aiResponse = await callLyzrAgent(

      process.env.ROADMAP_AGENT_ID,

      user.email,

      `${user._id}-roadmap`,

      prompt

    );
    await CareerRoadmap.create({

    user:user._id,

    targetRole:user.currentRoleGoal,

    currentReadiness:performance?.roleReadiness || 0,

    missingSkills:["React"],

    technologiesToLearn:[
        {
            technology:"React",
            reason:"Industry standard frontend framework"
        }
    ],

    recommendedProjects:[
        {
            title:"Weather App",

            description:"Build using React and API",

            difficulty:"Intermediate"
        }
    ],

    certifications:[
        {
            name:"Meta Frontend Developer",

            provider:"Coursera"
        }
    ],

    learningResources:[
        {
            title:"React Docs",

            url:"https://react.dev"
        }
    ],

    roadmapSteps:[
        {
            stepNumber:1,

            title:"Learn React",

            description:"Complete React Fundamentals"
        }
    ],

    interviewPreparation:[
        "Practice DSA",
        "Mock Interviews"
    ],

    actionPlan:[
        "Build Portfolio",
        "Apply for Internship"
    ]

});

    res.json(aiResponse);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};