import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { GlassCard } from "../components/GlassCards";
import { Quote, Flame, Trophy, Crown, Target, Heart, Loader, Sparkles } from "lucide-react";
import { getMotivation, generateMotivation } from "../services/motivationServices";
import { toast } from "react-hot-toast";

const achievements = [
  { id: 1, title: "First Step", desc: "Completed your first study session", icon: Trophy, unlocked: true, color: "text-yellow-400", bg: "bg-yellow-400/20" },
  { id: 2, title: "On Fire", desc: "Maintained a 7-day learning streak", icon: Flame, unlocked: true, color: "text-orange-500", bg: "bg-orange-500/20" },
  { id: 3, title: "Perfectionist", desc: "Scored 100% in a mock interview", icon: Crown, unlocked: false, color: "text-slate-500", bg: "bg-slate-800" },
  { id: 4, title: "Target Locked", desc: "Completed 50% of your roadmap", icon: Target, unlocked: false, color: "text-slate-500", bg: "bg-slate-800" },
];

export default function Motivation() {
  const [motivationData, setMotivationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchMotivation = async () => {
    try {
      setLoading(true);
      const res = await getMotivation();
      if (res.data && res.data.motivation) {
        setMotivationData(res.data.motivation);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivation();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      toast.loading("Finding inspiration...", { id: "gen" });
      const res = await generateMotivation();
      if (res.data && res.data.motivation) {
        setMotivationData(res.data.motivation);
        toast.success("Feeling inspired!", { id: "gen" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate motivation.", { id: "gen" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Motivation Center</h1>
          <p className="text-slate-400">Track your milestones and stay inspired on your learning journey.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-400 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/25 hover:scale-105 transition-all disabled:opacity-50"
        >
          {generating ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} />} 
          Inspire Me
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <GlassCard className="h-full flex flex-col justify-center relative overflow-hidden group p-8 md:p-12">
            <div className="absolute -right-10 -bottom-10 text-violet-500/10 group-hover:text-violet-500/20 transition-colors duration-700">
              <Quote size={200} />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-8">
                <Quote className="text-violet-400" size={32} />
              </div>

              {loading ? (
                 <div className="flex justify-center p-10"><Loader className="animate-spin text-violet-500" size={32} /></div>
              ) : (
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed whitespace-pre-wrap">
                  {motivationData?.message || "\"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.\""}
                </h2>
              )}
              
              {!motivationData && !loading && (
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                    <span className="text-slate-300 font-bold text-lg">SJ</span>
                  </div>
                  <div>
                    <p className="text-lg text-white font-semibold">Steve Jobs</p>
                    <p className="text-sm text-slate-400">Co-founder of Apple</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="text-center p-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Flame aura */}
              <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-full border-4 border-orange-500/30 flex flex-col items-center justify-center bg-slate-900 shadow-2xl">
                <Flame size={40} className="text-orange-500 mb-1" />
                <span className="text-3xl font-bold text-white">15</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Day Streak!</h3>
            <p className="text-slate-400">You're unstoppable. Come back tomorrow to keep the flame alive.</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-center gap-3">
              <Heart size={24} className="text-pink-500" />
              <h3 className="text-lg font-bold text-white">Daily Wellness</h3>
            </div>
            <p className="text-sm text-center text-slate-400 mt-4">
              Remember to take breaks. A 5-minute walk can improve focus by 30%.
            </p>
          </GlassCard>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy size={24} className="text-yellow-400" /> Your Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((badge) => {
          const Icon = badge.icon;
          return (
            <GlassCard key={badge.id} className={`flex flex-col items-center text-center p-6 ${!badge.unlocked ? "opacity-60 grayscale hover:grayscale-0 transition-all" : ""}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${badge.bg}`}>
                <Icon size={32} className={badge.color} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{badge.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{badge.desc}</p>
              {!badge.unlocked && (
                <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 font-medium border border-white/5">
                  Locked
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
