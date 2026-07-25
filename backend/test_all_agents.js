const axios = require("axios");
require("dotenv").config();

async function test(agentId, name) {
  console.log(`\nTesting ${name}: ${agentId}`);

  try {
    const response = await axios.post(
      process.env.LYZR_BASE_URL,
      {
        user_id: "test@example.com",
        agent_id: agentId,
        session_id: `test-session-${name.toLowerCase()}-123`,
        message: "hello"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_API_KEY,
        },
      }
    );
    console.log(`✅ ${name} Success!`);
    console.log("Response preview:", response.data.response ? response.data.response.substring(0, 150) + "..." : response.data);
  } catch (error) {
    console.error(`❌ ${name} Error:`, error.response?.status, error.response?.data || error.message);
  }
}

async function run() {
  await test(process.env.STUDY_AGENT_ID, "STUDY_AGENT");
  await test(process.env.INTERVIEW_AGENT_ID, "INTERVIEW_AGENT");
  await test(process.env.PERFORMANCE_AGENT_ID, "PERFORMANCE_AGENT");
  await test(process.env.ROADMAP_AGENT_ID, "ROADMAP_AGENT");
  await test(process.env.MOTIVATION_AGENT_ID, "MOTIVATION_AGENT");
}

run();
