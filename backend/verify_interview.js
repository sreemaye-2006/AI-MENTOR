const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const randomNum = Math.floor(Math.random() * 1000000);
const testUser = {
  name: `Test Candidate ${randomNum}`,
  email: `candidate.${randomNum}@example.com`,
  password: "Password123!",
  currentRoleGoal: "Frontend Developer",
  currentSemester: 3,
  currentSkillLevel: "Intermediate",
  knownSkills: ["HTML", "CSS", "JavaScript"],
  weakSubjects: ["Redux", "TypeScript"],
  strongSubjects: ["React", "DOM Manipulation"],
  dailyStudyTime: 2,
  targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

async function run() {
  console.log("🚀 Starting End-to-End Interview Verification Test...");

  try {
    // 1. Register User
    console.log("\n--- Step 1: Registering User ---");
    const regRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
    if (!regRes.data.success || !regRes.data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    }
    console.log(`✅ Registration Successful for ${testUser.email}`);

    // 2. Log in User
    console.log("\n--- Step 2: Logging in User ---");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    if (!loginRes.data.success || !loginRes.data.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.data)}`);
    }
    const token = loginRes.data.token;
    console.log("✅ Login Successful. Token received.");

    const headers = { Authorization: `Bearer ${token}` };

    // 3. Start Interview
    console.log("\n--- Step 3: Starting Interview ---");
    const startRes = await axios.post(`${BASE_URL}/interview/start`, {}, { headers });
    if (!startRes.data.success || !startRes.data.interviewId) {
      throw new Error(`Start interview failed: ${JSON.stringify(startRes.data)}`);
    }
    const interviewId = startRes.data.interviewId;
    console.log(`✅ Interview Started. ID: ${interviewId}`);
    console.log(`Question 1: ${startRes.data.response}`);

    // 4. Answer all 5 questions
    let currentQuestionText = startRes.data.response;
    for (let q = 1; q <= 5; q++) {
      console.log(`\n--- Step 4.${q}: Submitting Answer to Question ${q} ---`);
      
      const sampleAnswers = [
        "Semantic HTML means using HTML markup that reinforces the semantics, or meaning, of the information in webpages and web applications rather than merely to define its look.",
        "CSS Grid is a two-dimensional layout system for the web. It lets you lay content out in rows and columns.",
        "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).",
        "React virtual DOM is a programming concept where an ideal, or virtual, representation of a UI is kept in memory and synced with the real DOM by a library such as ReactDOM (reconciliation).",
        "Async/await is a syntax for writing asynchronous code that behaves like synchronous code. It uses Promises under the hood."
      ];

      const answerText = sampleAnswers[q - 1];
      console.log(`Submitting: "${answerText}"`);

      const ansRes = await axios.post(
        `${BASE_URL}/interview/answer`,
        { answer: answerText },
        { headers }
      );

      if (!ansRes.data.success) {
        throw new Error(`Submit answer failed: ${JSON.stringify(ansRes.data)}`);
      }

      if (q < 5) {
        console.log(`✅ Answer accepted. Received Question ${q + 1}: ${ansRes.data.response}`);
        currentQuestionText = ansRes.data.response;
      } else {
        console.log("✅ Answer 5 accepted. Final score & feedback received!");
        
        // 5. Confirm final score and feedback are returned
        const evalData = ansRes.data;
        if (evalData.totalScore === undefined || !evalData.overallFeedback) {
          throw new Error(`Final score/feedback missing: ${JSON.stringify(evalData)}`);
        }
        console.log("\n--- Final Score & Feedback: ---");
        console.log(`Total Score: ${evalData.totalScore}/100`);
        console.log(`Strengths: ${JSON.stringify(evalData.strengths)}`);
        console.log(`Weaknesses: ${JSON.stringify(evalData.weaknesses)}`);
        console.log(`Overall Feedback: ${evalData.overallFeedback}`);
        console.log(`Recommendation: ${evalData.recommendation}`);
      }
    }

    // 6. Verify report is saved in MongoDB using single-report API
    console.log("\n--- Step 5: Checking single-report API ---");
    const singleRes = await axios.get(`${BASE_URL}/interview/${interviewId}`, { headers });
    if (!singleRes.data.user) {
      throw new Error(`Single report check failed: ${JSON.stringify(singleRes.data)}`);
    }
    console.log(`✅ Single-report API returned the saved document correctly:`);
    console.log(`Saved Interview ID: ${singleRes.data._id}`);
    console.log(`Saved Interview Score: ${singleRes.data.totalScore}`);
    console.log(`Saved Interview Questions count: ${singleRes.data.questions.length}`);

    // 7. Check history API
    console.log("\n--- Step 6: Checking History API ---");
    const historyRes = await axios.get(`${BASE_URL}/interview/history`, { headers });
    if (!Array.isArray(historyRes.data) || historyRes.data.length === 0) {
      throw new Error(`History API failed or returned empty list: ${JSON.stringify(historyRes.data)}`);
    }
    const foundReport = historyRes.data.find(item => item._id === interviewId);
    if (!foundReport) {
      throw new Error(`Could not find the interview report in history list.`);
    }
    console.log(`✅ History API returned the saved report correctly. List size: ${historyRes.data.length}`);

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    process.exit(0);

  } catch (err) {
    console.error("\n❌ Test failed with error:", err.message);
    if (err.response) {
      console.error("Response data:", JSON.stringify(err.response.data));
    }
    process.exit(1);
  }
}

run();
