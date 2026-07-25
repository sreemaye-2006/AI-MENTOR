import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Bot
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

import FloatingBackground from "../components/FloatingBackground";
import { GlassCard } from "../components/GlassCards";
import InputField from "../components/InputField";
import GradientButton from "../components/GradientButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await login({ email, password });
    if (res.success) {
      toast.success("Welcome back to MentorAI! 🚀");
      navigate("/dashboard");
    } else {
      toast.error(res.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingBackground />

      <GlassCard className="w-full max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Professional Animated Logo */}
          <div className="text-center mb-5">
            <div className="relative w-16 h-16 mx-auto mb-4 group">
              {/* Outer soft glowing aura */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Inner container */}
              <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-105">
                <Bot size={28} className="text-violet-400 group-hover:text-cyan-400 transition-colors duration-300" />
                <Sparkles size={14} className="absolute top-2 right-2 text-cyan-300 animate-pulse" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              MentorAI
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Your Personal AI Career Mentor
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              icon={Mail}
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <InputField
                icon={Lock}
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <GradientButton type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </GradientButton>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Register
            </Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}