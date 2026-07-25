import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Mic,
  TrendingUp,
  Target,
  Flame,
  Bot,
  LogOut
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Study Plan", path: "/study-plan", icon: BookOpen },
  { name: "Interview Prep", path: "/interview", icon: Mic },
  { name: "Performance", path: "/performance", icon: TrendingUp },
  { name: "Roadmap", path: "/roadmap", icon: Target },
  { name: "Motivation", path: "/motivation", icon: Flame },
];

export default function SideBar() {
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 hidden lg:flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-white">
          <Bot size={24} className="text-violet-400" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          MentorAI
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-violet-400" : ""} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
