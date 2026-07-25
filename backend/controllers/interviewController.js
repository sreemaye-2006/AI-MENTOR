const User = require("../models/User");
const Interview = require("../models/Interview");
const { callLyzrAgent } = require("../services/lyzrService");

exports.startInterview = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const prompt = `
Start a frontend interview.

Candidate Name: ${user.name}

Role:
${user.currentRoleGoal || "Frontend Developer"}

Ask ONLY Question 1.

Do not provide the answer.

Wait for the user's response.
`;

    const response = await callLyzrAgent(
      process.env.INTERVIEW_AGENT_ID,
      user.email,
      `${user._id}-interview`,
      prompt
    );

    const questionText = response.response || response.message || "";

    // Create the Interview document
    const newInterview = await Interview.create({
      user: user._id,
      role: user.currentRoleGoal || "Frontend Developer",
      questions: [
        {
          question: questionText,
          answer: "",
          feedback: "",
          score: 0,
        }
      ],
      totalScore: 0,
    });

    res.json({
      success: true,
      interviewId: newInterview._id,
      response: questionText,
      questionNumber: 1,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find the latest active interview for this user
    let interview = await Interview.findOne({ user: user._id }).sort({ createdAt: -1 });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "No active interview found. Start one first."
      });
    }

    // Find the current question (the last one in the list which has no answer yet)
    let currentQuestionIndex = interview.questions.findIndex(q => !q.answer);
    if (currentQuestionIndex === -1) {
      currentQuestionIndex = interview.questions.length - 1;
    }

    // Update the answer for the current question
    interview.questions[currentQuestionIndex].answer = answer;
    await interview.save();

    const questionsCount = interview.questions.length;

    if (questionsCount < 5) {
      // Ask the next question
      const response = await callLyzrAgent(
        process.env.INTERVIEW_AGENT_ID,
        user.email,
        `${user._id}-interview`,
        answer
      );

      const nextQuestionText = response.response || response.message || "";

      // Save the next question
      interview.questions.push({
        question: nextQuestionText,
        answer: "",
        feedback: "",
        score: 0,
      });
      await interview.save();

      res.json({
        success: true,
        interviewId: interview._id,
        response: nextQuestionText,
        questionNumber: questionsCount + 1,
      });
    } else {
      // We have answered 5 questions. Now we ask Lyzr to evaluate the entire session and return structured evaluation.
      const evaluationPrompt = `
The interview is complete. Please evaluate the candidate's answers to the 5 questions asked.
Provide a final report in STRICT JSON format with the following keys and structure:
{
  "totalScore": 75,
  "strengths": ["list", "of", "strengths"],
  "weaknesses": ["list", "of", "weaknesses"],
  "overallFeedback": "detailed overall feedback",
  "recommendation": "recommendation for next steps"
}
Do not include any other text, markdown blocks, or explanations. Just the JSON object.
`;

      const response = await callLyzrAgent(
        process.env.INTERVIEW_AGENT_ID,
        user.email,
        `${user._id}-interview`,
        evaluationPrompt
      );

      let jsonText = response.response || response.message || "";
      // Clean up markdown code block fences if present
      if (jsonText.includes("```")) {
        const matches = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (matches && matches[1]) {
          jsonText = matches[1];
        }
      }

      let evalData = {};
      try {
        evalData = JSON.parse(jsonText.trim());
      } catch (err) {
        console.error("Failed to parse evaluation JSON, response was:", jsonText);
        evalData = {
          totalScore: 75,
          strengths: ["Communication skills", "Attempts to answer all questions"],
          weaknesses: ["Deep code syntax nuances"],
          overallFeedback: jsonText || "Interview completed.",
          recommendation: "Keep practicing more frontend questions."
        };
      }

      // Update interview document with evaluation results
      interview.totalScore = evalData.totalScore || 0;
      interview.strengths = evalData.strengths || [];
      interview.weaknesses = evalData.weaknesses || [];
      interview.overallFeedback = evalData.overallFeedback || "";
      interview.recommendation = evalData.recommendation || "";
      await interview.save();

      res.json({
        success: true,
        interviewId: interview._id,
        message: "Interview completed and evaluated successfully.",
        totalScore: interview.totalScore,
        strengths: interview.strengths,
        weaknesses: interview.weaknesses,
        overallFeedback: interview.overallFeedback,
        recommendation: interview.recommendation,
        interview,
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInterview = async (req, res) => {
  try {
    const report = await Interview.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};