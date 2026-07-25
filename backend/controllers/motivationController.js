const User = require("../models/User");
const Performance = require("../models/Performance");
const Motivation = require("../models/motivation");

const { callLyzrAgent } = require("../services/lyzrService");
exports.generateMotivation = async (req, res) => {
  try {
    // Get logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get latest performance report
    const performance = await Performance.findOne({
      user: user._id,
    }).sort({ createdAt: -1 });

    // Create AI prompt
    const prompt = `
You are an AI Motivation Coach.

Student Name: ${user.name}

Target Role: ${user.currentRoleGoal}

Study Completion: ${performance?.studyCompletion || 0}%

Average Interview Score: ${performance?.averageInterviewScore || 0}

Learning Trend: ${performance?.learningTrend || "Improving"}

Role Readiness: ${performance?.roleReadiness || 0}%

Generate:
1. A personalized motivational message.
2. Congratulate achievements.
3. Encourage improvement in weak areas.
4. Suggest short-term goals.
5. Keep the tone positive and encouraging.

Return only the motivational message.
`;

    // Call Lyzr Agent
    const aiResponse = await callLyzrAgent(
      process.env.MOTIVATION_AGENT_ID,
      user.email,
      `${user._id}-motivation`,
      prompt
    );

    // Extract message from AI response
    const motivationMessage =
      aiResponse.response ||
      aiResponse.message ||
      aiResponse.output ||
      JSON.stringify(aiResponse);

    // Save in MongoDB
    const motivation = await Motivation.create({
      user: user._id,
      message: motivationMessage,
    });

    // Return response
    res.status(200).json({
      success: true,
      message: "Motivation generated successfully",
      motivation,
    });

  } catch (error) {
    console.error("Motivation Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMotivation = async (req, res) => {
    try {
        const motivation = await Motivation.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        if (!motivation) {
            return res.status(404).json({ success: false, message: "No motivation data found." });
        }
        res.status(200).json({ success: true, motivation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
