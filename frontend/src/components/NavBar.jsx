import { Bell, Search, Menu, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function NavBar() {
  const { user } = useAuthStore();

  return (
    <header className="h-20 px-4 md:px-8 flex items-center justify-between backdrop-blur-md bg-slate-900/30 border-b border-white/10 sticky top-0 z-20">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
          <Menu size={24} />
        </button>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 rounded-full px-4 py-2 w-full focus-within:border-violet-500/50 focus-within:bg-slate-800 transition-all duration-300">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for mentors, topics..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
            <p className="text-xs text-slate-400">Pro Member</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <User size={20} className="text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
