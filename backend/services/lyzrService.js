const axios = require("axios");

const callLyzrAgent = async (
  agentId,
  userId,
  sessionId,
  message
) => {
  try {
    const response = await axios.post(
      process.env.LYZR_BASE_URL,
      {
        user_id: userId,
        agent_id: agentId,
        session_id: sessionId,
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  callLyzrAgent,
};