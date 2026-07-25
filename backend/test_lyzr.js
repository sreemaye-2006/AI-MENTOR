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
    console.log("Lyzr success:", response.data);
  } catch (error) {
    console.error("Lyzr error status:", error.response?.status);
    console.error("Lyzr error body:", error.response?.data);
  }
}

async function run() {
  await test(process.env.INTERVIEW_AGENT_ID, "INTERVIEW_AGENT_ID_ORIGINAL");
  await test("6a6447744adac5b394f74471", "INTERVIEW_AGENT_ID_TRUNCATED");
  await test(process.env.STUDY_AGENT_ID, "STUDY_AGENT_ID");
}

run();
