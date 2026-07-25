import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { GlassCard } from "../components/GlassCards";
import ProgressChart from "../components/ProgressChart";
import { Activity, Target, Zap, Clock, BrainCircuit, Loader, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getPerformance, generatePerformance } from "../services/performanceServices";
import { toast } from "react-hot-toast";

export default function Performance() {
  const { user } = useAuthStore();
  const [perfData, setPerfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const res = await getPerformance();
      if (res.data && res.data.performance) {
        setPerfData(res.data.performance);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      toast.loading("Analyzing your performance...", { id: "gen" });
      const res = await generatePerformance();
      if (res.data && res.data.performance) {
        setPerfData(res.data.performance);
        toast.success("Performance generated successfully!", { id: "gen" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze performance.", { id: "gen" });
    } finally {
      setGenerating(false);
    }
  };

  const topicsAccuracy = [
    ...(perfData?.strongestSkills || []).map(skill => ({ topic: skill, accuracy: 90, color: "bg-green-500", weak: false })),
    ...(perfData?.weakestSkills || []).map(skill => ({ topic: skill, accuracy: 40, color: "bg-red-500", weak: true }))
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
          <p className="text-slate-400">Deep dive into your learning metrics and identify areas for improvement.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Last 30 Days</span>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-violet-500/25 hover:scale-105 transition-all disabled:opacity-50"
          >
            {generating ? <Loader className="animate-spin" size={18} /> : "Update Analytics"} 
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader className="animate-spin text-violet-500" size={32} /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GlassCard className="flex items-center gap-4 p-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Target size={28} className="text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">Role Readiness</p>
                <h3 className="text-3xl font-bold text-white">{perfData?.roleReadiness || 0}%</h3>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 p-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Activity size={28} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">Study Completion</p>
                <h3 className="text-3xl font-bold text-white">{perfData?.studyCompletion || 0}%</h3>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 p-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Zap size={28} className="text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">Avg Interview Score</p>
                <h3 className="text-3xl font-bold text-white">{perfData?.averageInterviewScore || 0}</h3>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="h-[400px]">
                <ProgressChart />
              </div>
            </div>

            <div className="space-y-6">
              <GlassCard className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <BrainCircuit size={24} className="text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Topic Mastery</h2>
                </div>
                
                <div className="space-y-6 flex-1">
                  {topicsAccuracy.length > 0 ? topicsAccuracy.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300 font-medium">{item.topic}</span>
                        <span className="text-white font-bold">{item.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 border border-white/5 overflow-hidden">
                        <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.accuracy}%` }}></div>
                      </div>
                      {item.weak && (
                        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                          Needs improvement. Try generating a study plan for this.
                        </p>
                      )}
                    </div>
                  )) : (
                    <p className="text-slate-400 text-sm">No topics analyzed yet.</p>
                  )}
                </div>
                
                {perfData?.improvementSuggestions?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Suggestions:</h3>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                      {perfData.improvementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
