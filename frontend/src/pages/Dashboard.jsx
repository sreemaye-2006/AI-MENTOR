import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import MotivationCard from "../components/MotivationCard";
import { useAuthStore } from "../store/authStore";
import { getStudyPlan } from "../services/studyServices";
import { getHistory } from "../services/interviewServices";
import { getPerformance } from "../services/performanceServices";

import {
  BookOpen,
  Mic,
  TrendingUp,
  Flame,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  
  const [studyData, setStudyData] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studyRes, historyRes, perfRes] = await Promise.all([
          getStudyPlan().catch(() => ({ data: { studyPlan: null } })),
          getHistory().catch(() => ({ data: [] })),
          getPerformance().catch(() => ({ data: { performance: null } }))
        ]);

        if (studyRes?.data?.studyPlan) setStudyData(studyRes.data.studyPlan);
        if (historyRes?.data) setInterviewHistory(historyRes.data);
        if (perfRes?.data?.performance) setPerformanceData(perfRes.data.performance);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const cards = useMemo(() => {
    // 1. Study Progress
    let progress = 0;
    if (studyData?.progress) {
      progress = studyData.progress;
    } else if (studyData?.studyPlan) {
      // Calculate from tasks if progress field isn't perfectly updated
      let total = 0, completed = 0;
      studyData.studyPlan.forEach(week => {
        week.dailyTasks?.forEach(task => {
          total++;
          if (task.completed) completed++;
        });
      });
      progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    // 2. Interview Score
    let interviewScore = 0;
    if (performanceData?.averageInterviewScore) {
      interviewScore = performanceData.averageInterviewScore;
    } else if (interviewHistory.length > 0) {
      interviewScore = Math.round(interviewHistory.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / interviewHistory.length);
    }

    // 3. Career Readiness
    let careerReadiness = 0;
    if (performanceData?.roleReadiness) {
      careerReadiness = performanceData.roleReadiness;
    } else {
      careerReadiness = Math.round((progress + interviewScore) / 2);
    }

    // 4. Learning Streak
    let streak = 0;
    if (user?.lastStudySession) {
      const lastSession = new Date(user.lastStudySession);
      const today = new Date();
      const diffTime = Math.abs(today - lastSession);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      streak = diffDays <= 1 ? (user.dailyStudyTime > 0 ? user.dailyStudyTime * 2 : 1) : 0;
    } else {
       streak = 1; // Default to 1 if just registered
    }

    return [
      {
        title: "Study Progress",
        value: `${progress}%`,
        icon: <BookOpen size={35} />,
        color: "from-violet-600 to-purple-700",
      },
      {
        title: "Interview Score",
        value: `${interviewScore}%`,
        icon: <Mic size={35} />,
        color: "from-cyan-500 to-blue-600",
      },
      {
        title: "Career Readiness",
        value: `${careerReadiness}%`,
        icon: <TrendingUp size={35} />,
        color: "from-green-500 to-emerald-600",
      },
      {
        title: "Learning Streak",
        value: `${streak} Days`,
        icon: <Flame size={35} />,
        color: "from-orange-500 to-red-500",
      },
    ];
  }, [user, studyData, interviewHistory, performanceData]);

  return (
    <DashboardLayout>
      <WelcomeBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2">
          <ProgressChart />
        </div>
        <MotivationCard />
      </div>
    </DashboardLayout>
  );
}