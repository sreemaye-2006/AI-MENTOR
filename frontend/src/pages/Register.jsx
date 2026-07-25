import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  Sliders,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  Star,
  Target,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

import FloatingBackground from "../components/FloatingBackground";
import { GlassCard } from "../components/GlassCards";
import InputField from "../components/InputField";
import GradientButton from "../components/GradientButton";

export default function Register() {
  const [step, setStep] = useState(1);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    semester: 3,
    currentRoleGoal: "Frontend Developer",
    currentSkillLevel: "Intermediate",
    dailyStudyHours: 2,
    knownSkills: "",
    weakSubjects: "",
    strongSubjects: "",
    targetDate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" || name === "dailyStudyHours" ? Number(value) : value
    }));
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!formData.currentRoleGoal || !formData.currentSkillLevel) {
      toast.error("Please fill in all goal fields");
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adapt fields to match the backend expectation
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      currentRoleGoal: formData.currentRoleGoal,
      currentSemester: Number(formData.semester),
      currentSkillLevel: formData.currentSkillLevel,
      knownSkills: formData.knownSkills ? formData.knownSkills.split(",").map(s => s.trim()) : [],
      weakSubjects: formData.weakSubjects ? formData.weakSubjects.split(",").map(s => s.trim()) : [],
      strongSubjects: formData.strongSubjects ? formData.strongSubjects.split(",").map(s => s.trim()) : [],
      dailyStudyTime: Number(formData.dailyStudyHours),
      targetDate: formData.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const res = await register(payload);
    if (res.success) {
      toast.success("Account created successfully! Welcome to MentorAI 🚀");
      navigate("/dashboard");
    } else {
      toast.error(res.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingBackground />

      <div className="w-full max-w-[420px] z-10">
        <GlassCard>
          {/* Professional Animated Logo */}
          <div className="text-center mb-5">
            <div className="relative w-14 h-14 mx-auto mb-3 group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-105">
                <Bot size={24} className="text-violet-400 group-hover:text-cyan-400 transition-colors duration-300" />
                <Sparkles size={10} className="absolute top-1.5 right-1.5 text-cyan-300 animate-pulse" />
              </div>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              Create Account
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Step {step} of 3 — Personalizing your mentor
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <InputField
                icon={User}
                type="text"
                name="name"
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <InputField
                icon={Mail}
                type="email"
                name="email"
                label="Email Address"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                icon={Lock}
                type="password"
                name="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <InputField
                icon={Lock}
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
          
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <InputField
                icon={GraduationCap}
                type="number"
                name="semester"
                label="Current Semester"
                placeholder="e.g. 3"
                value={formData.semester}
                onChange={handleChange}
                min="1"
                max="8"
                required
              />

              <InputField
                icon={Briefcase}
                type="text"
                name="currentRoleGoal"
                label="Target Role / Career Goal"
                placeholder="e.g. Frontend Developer"
                value={formData.currentRoleGoal}
                onChange={handleChange}
                required
              />

              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Current Skill Level</label>
                <div className="flex items-center bg-slate-900/60 rounded-xl border border-slate-700 px-4">
                  <Sliders size={18} className="text-violet-400 mr-3" />
                  <select
                    name="currentSkillLevel"
                    value={formData.currentSkillLevel}
                    onChange={handleChange}
                    className="bg-transparent flex-1 py-3 outline-none text-white appearance-none cursor-pointer"
                  >
                    <option value="Beginner" className="bg-slate-900 text-white">Beginner</option>
                    <option value="Intermediate" className="bg-slate-900 text-white">Intermediate</option>
                    <option value="Advanced" className="bg-slate-900 text-white">Advanced</option>
                  </select>
                </div>
              </div>

              <InputField
                icon={Clock}
                type="number"
                name="dailyStudyHours"
                label="Daily Study Commitment (Hours)"
                placeholder="e.g. 2"
                value={formData.dailyStudyHours}
                onChange={handleChange}
                min="1"
                max="24"
                required
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-white/10 bg-white/5 font-semibold hover:bg-white/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 text-white"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/25"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                icon={Star}
                type="text"
                name="knownSkills"
                label="Known Skills (comma separated)"
                placeholder="e.g. HTML, CSS, JavaScript"
                value={formData.knownSkills}
                onChange={handleChange}
                required
              />

              <InputField
                icon={Target}
                type="text"
                name="strongSubjects"
                label="Strong Subjects (comma separated)"
                placeholder="e.g. Web Design, Problem Solving"
                value={formData.strongSubjects}
                onChange={handleChange}
                required
              />

              <InputField
                icon={AlertTriangle}
                type="text"
                name="weakSubjects"
                label="Weak Subjects (comma separated)"
                placeholder="e.g. Algorithms, System Design"
                value={formData.weakSubjects}
                onChange={handleChange}
                required
              />

              <InputField
                icon={Calendar}
                type="date"
                name="targetDate"
                label="Target Date for Goal"
                value={formData.targetDate}
                onChange={handleChange}
                required
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl border border-white/10 bg-white/5 font-semibold hover:bg-white/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 text-white"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/25"
                >
                  {loading ? "Registering..." : "Complete Setup"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}