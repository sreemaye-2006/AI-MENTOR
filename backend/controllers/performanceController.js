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
Analyze the student's performance and return ONLY a JSON object.

Name: ${user.name}
Role: ${user.currentRoleGoal}
Study Completion: ${studyPlan?.progress || 0}%
Interview Attempts: ${interviews.length}
Interview Scores: ${interviews.map(i => i.totalScore).join(", ")}
Known Skills: ${user.knownSkills.join(", ")}
Weak Subjects: ${user.weakSubjects.join(", ")}

Return ONLY a JSON object representing the performance analysis. The object should have the following structure exactly:
{
  "averageInterviewScore": 85,
  "learningTrend": "Improving", // Must be "Improving", "Stable", or "Declining"
  "strongestSkills": ["skill1", "skill2"],
  "weakestSkills": ["skill3", "skill4"],
  "priorityTopics": ["topic1", "topic2"],
  "roleReadiness": 75,
  "improvementSuggestions": ["suggestion1", "suggestion2"],
  "nextLearningFocus": "focus topic"
}
Do not include any markdown formatting like \`\`\`json or \`\`\`. Output ONLY the raw JSON object.
`;

        const aiResponse = await callLyzrAgent(
            process.env.PERFORMANCE_AGENT_ID,
            user.email,
            `${user._id}-performance`,
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
                message: "Failed to generate a valid performance format from AI."
            });
        }

        const performance = await Performance.create({
            user: user._id,
            studyCompletion: studyPlan?.progress || 0,
            averageInterviewScore: parsedData.averageInterviewScore || 0,
            learningTrend: ["Improving", "Stable", "Declining"].includes(parsedData.learningTrend) ? parsedData.learningTrend : "Stable",
            strongestSkills: parsedData.strongestSkills || [],
            weakestSkills: parsedData.weakestSkills || [],
            priorityTopics: parsedData.priorityTopics || [],
            roleReadiness: parsedData.roleReadiness || 0,
            improvementSuggestions: parsedData.improvementSuggestions || [],
            nextLearningFocus: parsedData.nextLearningFocus || ""
        });

        res.json({
            success: true,
            performance,
            aiResponse
        });

    }

    catch (error) {

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

exports.getPerformance = async (req, res) => {
    try {
        const performance = await Performance.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        if (!performance) {
            return res.status(404).json({ success: false, message: "No performance data found." });
        }
        res.status(200).json({ success: true, performance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};