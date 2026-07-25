import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

export default function WelcomeBanner() {
  const { user } = useAuthStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden mb-8 group"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 opacity-90" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent" />
      
      {/* Animated glowing orb behind sparkles */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/30 rounded-full blur-3xl group-hover:bg-cyan-400/50 transition-colors duration-700" />

      <div className="relative p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-300" />
            <span>Pro Plan Active</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome back, {user?.name?.split(' ')[0] || 'Friend'} 👋
          </h1>
          
          <p className="text-lg text-white/80 max-w-xl">
            Ready to become a Frontend Developer? You have 3 tasks pending for today to keep your streak alive!
          </p>
          
          <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            Start Learning
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="hidden md:flex w-24 h-24 rounded-3xl bg-white/10 border border-white/20 items-center justify-center backdrop-blur-md shadow-2xl rotate-3 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
          <Sparkles size={48} className="text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]" />
        </div>
      </div>
    </motion.div>
  );
}