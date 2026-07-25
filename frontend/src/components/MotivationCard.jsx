import { Quote } from "lucide-react";
import { GlassCard } from "./GlassCards";

export default function MotivationCard() {
  return (
    <GlassCard className="h-full flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 text-violet-500/10 group-hover:text-violet-500/20 transition-colors duration-500">
        <Quote size={120} />
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6">
          <Quote className="text-violet-400" size={24} />
        </div>

        <h2 className="text-xl font-bold text-white mb-4">
          Today's Motivation
        </h2>

        <p className="text-slate-300 leading-relaxed text-lg italic">
          "Small progress every day is better than perfection once a month."
        </p>
      </div>
      
      <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
        <p className="text-sm text-slate-400 font-medium">Keep up the great work!</p>
      </div>
    </GlassCard>
  );
}