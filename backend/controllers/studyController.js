const User = require("../models/User");
const StudyPlan = require("../models/StudyPlan");
const { generateStudyPlan } = require("../services/lyzrService");

exports.generatePlan = async (req, res) => {
  try {

    // Get Logged-in User
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create Prompt
    const prompt = `
Create a personalized study plan.

Name: ${user.name}
Role Goal: ${user.currentRoleGoal}
Semester: ${user.currentSemester}
Skill Level: ${user.currentSkillLevel}

Known Skills:
${user.knownSkills.join(", ")}

Weak Subjects:
${user.weakSubjects.join(", ")}

Strong Subjects:
${user.strongSubjects.join(", ")}

Daily Study Time:
${user.dailyStudyTime} hours

Target Date:
${user.targetDate}

Return a well-structured study plan.
`;

    // Call Lyzr
    const aiResponse = await generateStudyPlan(
      user.email,
      `${user._id}-study`,
      prompt
    );

    // Save Response
    const study = await StudyPlan.create({
      user: user._id,
      roleGoal: user.currentRoleGoal,
      studyPlan: aiResponse.response || [],
    });

    res.status(200).json({
      success: true,
      studyPlan: study,
      aiResponse
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};