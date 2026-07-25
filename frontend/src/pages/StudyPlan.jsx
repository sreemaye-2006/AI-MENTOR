import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { GlassCard } from "../components/GlassCards";
import { BookOpen, CheckCircle, Circle, ArrowRight, Play, Calendar, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getStudyPlan, generateStudyPlan, markTaskComplete } from "../services/studyServices";
import { toast } from "react-hot-toast";

export default function StudyPlan() {
  const { user } = useAuthStore();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await getStudyPlan();
      if (res.data && res.data.studyPlan) {
        setPlanData(res.data.studyPlan);
      }
    } catch (error) {
      console.error(error);
      // No plan found, that's okay
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      toast.loading("Generating your personalized plan...", { id: "gen" });
      const res = await generateStudyPlan();
      if (res.data && res.data.studyPlan) {
        setPlanData(res.data.studyPlan);
        toast.success("Plan generated successfully!", { id: "gen" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate plan.", { id: "gen" });
    } finally {
      setGenerating(false);
    }
  };

  const toggleWeek = (weekIndex) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekIndex]: !prev[weekIndex]
    }));
  };

  const handleTaskComplete = async (weekIndex, taskIndex) => {
    if (!planData || !planData._id) return;
    try {
      // Optimistically update
      const newPlanData = { ...planData };
      newPlanData.studyPlan[weekIndex].dailyTasks[taskIndex].completed = true;
      setPlanData(newPlanData);
      
      const res = await markTaskComplete(planData._id, weekIndex, taskIndex);
      if (res.data && res.data.studyPlan) {
        setPlanData(res.data.studyPlan);
      }
      toast.success("Task marked as complete!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark task complete");
      // Revert optimism if we want, or just re-fetch
      fetchPlan();
    }
  };

  let completedCount = 0;
  let totalTasks = 0;

  if (planData && planData.studyPlan) {
    planData.studyPlan.forEach(week => {
      week.dailyTasks?.forEach(task => {
        totalTasks++;
        if (task.completed) completedCount++;
      });
    });
  }

  const progressPercent = planData?.progress || (totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100));

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Study Plan</h1>
          <p className="text-slate-400">Targeting: {user?.currentRoleGoal || "Frontend Developer"} by {user?.targetDate ? new Date(user.targetDate).toLocaleDateString() : "Next Month"}</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-violet-500/25 hover:scale-105 transition-all disabled:opacity-50"
        >
          {generating ? <Loader className="animate-spin" size={18} /> : "Generate New Plan"} 
          {!generating && <ArrowRight size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <div className="flex justify-center p-10"><Loader className="animate-spin text-violet-500" size={32} /></div>
          ) : planData?.studyPlan?.length > 0 ? (
            planData.studyPlan.map((week, weekIdx) => {
              const isExpanded = expandedWeeks[weekIdx];
              const weekCompleted = week.dailyTasks?.length > 0 && week.dailyTasks.every(t => t.completed);
              
              return (
                <GlassCard key={weekIdx} className="group transition-colors p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleWeek(weekIdx)}>
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 
                        ${weekCompleted ? "bg-green-500/20 border-green-500 text-green-400" : 
                          isExpanded ? "bg-violet-500/20 border-violet-500 text-violet-400" : 
                          "bg-slate-800 border-slate-600 text-slate-500"}
                      `}>
                        {weekCompleted ? <CheckCircle size={20} /> : <Calendar size={20} />}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${weekCompleted ? "text-slate-300 line-through" : "text-white"}`}>
                          Week {week.week}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                          Topics: {week.topics?.join(", ") || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        {isExpanded ? (
                          <><ChevronUp size={16} /> Hide Tasks</>
                        ) : (
                          <><Play size={16} /> Start</>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pl-14 pr-4 space-y-3 border-t border-white/5 pt-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Daily Tasks</h4>
                      {week.dailyTasks?.map((task, taskIdx) => (
                        <div 
                          key={taskIdx} 
                          className={`flex items-center gap-3 p-3 rounded-lg border ${task.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800/50 border-slate-700'} transition-all`}
                        >
                          <button 
                            disabled={task.completed}
                            onClick={() => handleTaskComplete(weekIdx, taskIdx)}
                            className={`flex-shrink-0 ${task.completed ? 'text-green-400' : 'text-slate-400 hover:text-violet-400'} transition-colors`}
                          >
                            {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                          </button>
                          <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {task.task}
                          </span>
                        </div>
                      ))}
                      {(!week.dailyTasks || week.dailyTasks.length === 0) && (
                        <p className="text-slate-500 text-sm">No tasks assigned for this week.</p>
                      )}
                    </div>
                  )}
                </GlassCard>
              );
            })
          ) : (
             <GlassCard className="p-8 text-center text-slate-400">
                No study plan found. Click 'Generate New Plan' to get started!
             </GlassCard>
          )}
        </div>

        <div className="space-y-6">
          <GlassCard className="text-center p-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 p-1 mb-4">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <BookOpen size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Plan Progress</h2>
            <p className="text-slate-400 mb-6">{completedCount} of {totalTasks} tasks completed</p>
            
            <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-3 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-sm text-slate-500 text-right">{progressPercent}% Complete</p>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
