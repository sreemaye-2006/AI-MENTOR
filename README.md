<div align="center">
  <img src="./frontend/public/vite.svg" alt="AI-Mentor Logo" width="120" />
  
  # 🚀 AI-MENTOR

  **Your Intelligent Career & Learning Companion**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Lyzr AI](https://img.shields.io/badge/Lyzr_AI-8B5CF6?style=for-the-badge&logo=ai&logoColor=white)](https://lyzr.ai/)

  <p align="center">
    A comprehensive AI-driven platform designed to personalize your career growth, study plans, and interview preparation.
  </p>
</div>

<hr />

## ✨ Features

- 🗺️ **AI Career Roadmap**: Generate a highly personalized step-by-step career path based on your current skills and target role, complete with curated learning resources.
- 📚 **Smart Study Plans**: Dynamic schedules tailored to your pace, identifying missing skills and tracking study completion.
- 🎙️ **Interactive AI Interviews**: Practice with an intelligent agent that evaluates your answers, provides instant feedback, and tracks your average interview score.
- 📊 **Performance Analytics**: Visual dashboards using Recharts to track your role readiness, strongest/weakest skills, and priority topics.
- 💡 **Motivational Coach**: Get personalized AI-generated motivation based on your recent progress and struggles to keep you moving forward.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS for a highly responsive, glassmorphism UI
- **State Management**: Zustand
- **Icons**: Lucide React
- **Data Fetching**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

### AI Integration
- **Lyzr API**: Leverages advanced Lyzr agents for roadmap generation, motivational coaching, interview evaluation, and study planning.
- Have used 5 lyzr AI's
- SkillPath Coach Ai
- My AI Internview
- Perfromance AI
- Career Navigator
- Progress and Thrive monitor

---

## 📸 Screenshots

*(Replace the placeholder image paths below with actual screenshots of the application)*

### 🏠 Dashboard
![Dashboard View](./frontend/public/dashboard-placeholder.png)
*A sleek, glassmorphic dashboard tracking your overall progress, role readiness, and quick actions.*

### 🗺️ Career Roadmap
![Roadmap View](./frontend/public/roadmap-placeholder.png)
*Detailed step-by-step roadmap tailored to your target role, with integrated learning materials.*

### 🎙️ AI Interview Simulator
![Interview View](./frontend/public/interview-placeholder.png)
*Real-time AI interviewing with dynamic feedback and scoring metrics.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas cluster)
- [Lyzr API Keys](https://lyzr.ai)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sreemaye-2006/AI-MENTOR.git
   cd AI-MENTOR
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     LYZR_API_KEY=your_lyzr_api_key
     ROADMAP_AGENT_ID=your_lyzr_roadmap_agent_id
     INTERVIEW_AGENT_ID=your_lyzr_interview_agent_id
     STUDY_AGENT_ID=your_lyzr_study_agent_id
     MOTIVATION_AGENT_ID=your_lyzr_motivation_agent_id
     ```
   - Start the backend server:
     ```bash
     npm start
     # or for development: npm run dev
     ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` to see the application in action.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sreemaye-2006/AI-MENTOR/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Contributors

- **Katukojwala Sreemaye**
- **Jakkula Rithvika**

---

---

<div align="center">
  <i>Built with ❤️ for learners everywhere.</i>
</div>
