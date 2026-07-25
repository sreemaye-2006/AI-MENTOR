import { motion } from "framer-motion";
import { GlassCard } from "./GlassCards";

export default function StatCard({ title, value, icon, color }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer h-full">
      <GlassCard className="h-full flex flex-col justify-between">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">
            {title}
          </h3>
          <p className="text-white text-3xl font-bold">
            {value}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}