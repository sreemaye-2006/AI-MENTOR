const axios = require('axios');

async function testFlow() {
    try {
        console.log("Registering user...");
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Test User " + Date.now(),
            email: "test" + Date.now() + "@example.com",
            password: "password123",
            currentRoleGoal: "Frontend Engineer",
            currentSemester: 5,
            currentSkillLevel: "Intermediate",
            knownSkills: ["HTML", "CSS", "JS"],
            weakSubjects: ["Algorithms"],
            strongSubjects: ["UI/UX"],
            dailyStudyTime: 2,
            targetDate: "2026-08-30T00:00:00Z"
        });
        const token = regRes.data.token;
        console.log("User registered! Token received.");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("\nTesting Study Plan Generation...");
        const studyRes = await axios.post('http://localhost:5000/api/study/generate', {}, config);
        console.log("Study Plan Success:", studyRes.data.success);

        console.log("\nTesting Roadmap Generation...");
        const roadmapRes = await axios.post('http://localhost:5000/api/roadmap/generate', {}, config);
        console.log("Roadmap Success:", roadmapRes.data.success);

        console.log("\nTesting Performance Generation...");
        const perfRes = await axios.post('http://localhost:5000/api/performance/generate', {}, config);
        console.log("Performance Success:", perfRes.data.success);

        console.log("\nTesting Motivation Generation...");
        const motRes = await axios.post('http://localhost:5000/api/motivation/generate', {}, config);
        console.log("Motivation Success:", motRes.data.success);

        console.log("\nTesting Interview Start...");
        const intRes = await axios.post('http://localhost:5000/api/interview/start', {}, config);
        console.log("Interview Start Success:", intRes.data.success);
        
        console.log("\nAll APIs called successfully!");
    } catch (e) {
        console.error("Error during test:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
}

testFlow();
