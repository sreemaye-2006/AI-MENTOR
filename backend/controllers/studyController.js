const User = require("../models/User");
const StudyPlan = require("../models/StudyPlan");
const { callLyzrAgent } = require("../services/lyzrService");

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
Create a personalized study plan for the following user profile.

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

Return ONLY a JSON array of objects representing the study plan by week. Each object should have the following structure exactly:
[
  {
    "week": 1,
    "topics": ["topic1", "topic2"],
    "resources": ["resource1", "resource2"],
    "dailyTasks": ["task1", "task2"],
    "revisionTopics": ["revision1"]
  },
  ...
]
Do not include any markdown formatting like \`\`\`json or \`\`\`. Output ONLY the raw JSON array.
`;

    // Call Lyzr
    const aiResponse = await callLyzrAgent(
      process.env.STUDY_AGENT_ID,
      user.email,
      `${user._id}-study`,
      prompt
    );

    let parsedPlan = [];
    try {
        let jsonStr = aiResponse.response;
        // Basic cleanup in case Lyzr still adds markdown
        if (jsonStr.startsWith("\`\`\`json")) {
            jsonStr = jsonStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        } else if (jsonStr.startsWith("\`\`\`")) {
             jsonStr = jsonStr.replace(/\`\`\`/g, "").trim();
        }
        parsedPlan = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse AI response as JSON", aiResponse.response);
        return res.status(500).json({
            success: false,
            message: "Failed to generate a valid study plan format from AI."
        });
    }

    // Map dailyTasks to objects
    const mappedPlan = parsedPlan.map(week => ({
      ...week,
      dailyTasks: week.dailyTasks ? week.dailyTasks.map(taskStr => ({
        task: taskStr,
        completed: false
      })) : []
    }));

    // Save Response
    const study = await StudyPlan.create({
      user: user._id,
      roleGoal: user.currentRoleGoal,
      studyPlan: mappedPlan,
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

exports.getPlan = async (req, res) => {
  try {
    const study = await StudyPlan.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!study) {
      return res.status(404).json({ success: false, message: "No study plan found." });
    }
    res.status(200).json({ success: true, studyPlan: study });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { weekIndex, taskIndex } = req.body;

    const study = await StudyPlan.findOne({ _id: id, user: req.user.id });
    if (!study) {
      return res.status(404).json({ success: false, message: "Study plan not found" });
    }

    if (
      study.studyPlan[weekIndex] &&
      study.studyPlan[weekIndex].dailyTasks[taskIndex]
    ) {
      study.studyPlan[weekIndex].dailyTasks[taskIndex].completed = true;
      
      // Recalculate progress
      let totalTasks = 0;
      let completedTasks = 0;
      
      study.studyPlan.forEach(week => {
        week.dailyTasks.forEach(task => {
          totalTasks++;
          if (task.completed) completedTasks++;
        });
      });

      study.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      await study.save();
      
      return res.status(200).json({ success: true, studyPlan: study });
    } else {
      return res.status(400).json({ success: false, message: "Invalid week or task index" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};