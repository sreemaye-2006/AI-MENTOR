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
Generate a personalized career roadmap for the following user profile.

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

CRITICAL: You MUST provide at least 1 learning resource (title and URL) for EVERY single step inside the 'roadmapSteps' array. It is mandatory.

Return ONLY a JSON object representing the career roadmap. The object should have the following structure exactly:
{
  "missingSkills": ["skill1", "skill2"],
  "technologiesToLearn": [
    { "technology": "tech name", "reason": "why to learn" }
  ],
  "recommendedProjects": [
    { "title": "project title", "description": "project description", "difficulty": "Beginner/Intermediate/Advanced" }
  ],
  "certifications": [
    { "name": "cert name", "provider": "provider name" }
  ],
  "learningResources": [
    { "title": "resource title", "url": "https://..." }
  ],
  "roadmapSteps": [
    { 
      "stepNumber": 1, 
      "title": "step title", 
      "description": "step description",
      "resources": [
        { "title": "resource title", "url": "https://..." }
      ]
    }
  ],
  "interviewPreparation": ["prep tip 1", "prep tip 2"],
  "actionPlan": ["action 1", "action 2"]
}
Do not include any markdown formatting like \`\`\`json or \`\`\`. Output ONLY the raw JSON object.
`;

    const aiResponse = await callLyzrAgent(
      process.env.ROADMAP_AGENT_ID,
      user.email,
      `${user._id}-roadmap`,
      prompt
    );
    
    let parsedData = {};
    try {
        let jsonStr = aiResponse.response;
        if (jsonStr.startsWith("\`\`\`json")) {
            jsonStr = jsonStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        } else if (jsonStr.startsWith("\`\`\`")) {
             jsonStr = jsonStr.replace(/\`\`\`/g, "").trim();
        }
        parsedData = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse AI response as JSON", aiResponse.response);
        return res.status(500).json({
            success: false,
            message: "Failed to generate a valid roadmap format from AI."
        });
    }

    const roadmap = await CareerRoadmap.create({
        user: user._id,
        targetRole: user.currentRoleGoal,
        currentReadiness: performance?.roleReadiness || 0,
        missingSkills: parsedData.missingSkills || [],
        technologiesToLearn: parsedData.technologiesToLearn || [],
        recommendedProjects: parsedData.recommendedProjects || [],
        certifications: parsedData.certifications || [],
        learningResources: parsedData.learningResources || [],
        roadmapSteps: parsedData.roadmapSteps || [],
        interviewPreparation: parsedData.interviewPreparation || [],
        actionPlan: parsedData.actionPlan || []
    });

    res.json({
        success: true,
        roadmap,
        aiResponse
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};