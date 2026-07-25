import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { GlassCard } from "../components/GlassCards";
import { Map, CheckCircle2, Circle, Lock, Play, ArrowDown, ExternalLink, Loader, ArrowRight, BookOpen, Link as LinkIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getRoadmap, generateRoadmap } from "../services/roadmapServices";
import { toast } from "react-hot-toast";

export default function Roadmap() {
  const { user } = useAuthStore();
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await getRoadmap();
      if (res.data && res.data.roadmap) {
        setRoadmapData(res.data.roadmap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      toast.loading("Generating your personalized roadmap...", { id: "gen" });
      const res = await generateRoadmap();
      if (res.data && res.data.roadmap) {
        setRoadmapData(res.data.roadmap);
        toast.success("Roadmap generated successfully!", { id: "gen" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate roadmap.", { id: "gen" });
    } finally {
      setGenerating(false);
    }
  };

  const exportRoadmap = () => {
    if (!roadmapData || !roadmapData.roadmapSteps) {
      toast.error("No roadmap to export!");
      return;
    }
    let content = `# Career Roadmap: ${user?.currentRoleGoal || "Professional"}\n\n`;
    roadmapData.roadmapSteps.forEach(step => {
      content += `## Step ${step.stepNumber}: ${step.title}\n`;
      content += `${step.description}\n\n`;
      if (step.resources && step.resources.length > 0) {
        content += `### Resources:\n`;
        step.resources.forEach(res => {
          content += `- [${res.title}](${res.url})\n`;
        });
        content += `\n`;
      }
    });

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-roadmap.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Roadmap exported!");
  };

  const toggleStep = (index) => {
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);
    }
  };

  const steps = roadmapData?.roadmapSteps || [];

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Map className="text-violet-400" size={32} />
            Career Roadmap
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Your personalized path to becoming a {user?.currentRoleGoal || "Professional"}. Follow the steps to ensure you master every required skill.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-violet-500/25 hover:scale-105 transition-all disabled:opacity-50"
          >
            {generating ? <Loader className="animate-spin" size={18} /> : "Generate New Roadmap"} 
          </button>
          <button 
            onClick={exportRoadmap}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-semibold text-slate-300 hover:bg-white/10 transition-all">
            <ExternalLink size={18} /> Export
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Continuous vertical line for the roadmap */}
        {steps.length > 0 && (
          <>
            <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-violet-600 via-cyan-500 to-slate-800 -translate-x-1/2 rounded-full hidden md:block" />
            <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-gradient-to-b from-violet-600 via-cyan-500 to-slate-800 -translate-x-1/2 rounded-full md:hidden" />
          </>
        )}

        {loading ? (
           <div className="flex justify-center p-10"><Loader className="animate-spin text-violet-500" size={32} /></div>
        ) : steps.length === 0 ? (
           <GlassCard className="p-8 text-center text-slate-400">
              No roadmap found. Click 'Generate New Roadmap' to get started!
           </GlassCard>
        ) : (
          <div className="space-y-6 md:space-y-12 relative z-10">
            {steps.map((node, index) => {
              const isEven = index % 2 === 0;
              // Placeholder logic for status since it's dynamic
              const isCompleted = index === 0; // Just as an example, first step complete
              const isInProgress = index === 1; // Second step in progress
              const isLocked = false; // Just show all steps for now so they can view resources
              const isExpanded = expandedStep === index;

              return (
                <div key={index} className={`flex flex-col md:flex-row items-start w-full ${isEven ? "md:flex-row-reverse" : ""}`}>
                  
                  {/* Desktop layout spacing */}
                  <div className="hidden md:block md:w-1/2" />
                  
                  {/* Node Icon */}
                  <div className="absolute left-[20px] md:static md:w-auto md:mx-6 flex-shrink-0 z-20 mt-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl
                      ${isCompleted ? "bg-green-500 text-white" : 
                        isInProgress ? "bg-violet-500 text-white animate-pulse" : 
                        "bg-slate-800 text-slate-500"}
                    `}>
                      {isCompleted ? <CheckCircle2 size={20} /> : 
                       isInProgress ? <Play size={16} className="ml-1" /> : 
                       <Lock size={16} />}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full pl-[70px] md:pl-0 md:w-1/2 flex">
                    <GlassCard className={`
                      w-full transition-all duration-300
                      ${isInProgress ? "border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]" : ""}
                      ${isLocked ? "opacity-60 grayscale" : "hover:shadow-lg"}
                      ${isEven ? "md:mr-6" : "md:ml-6"}
                    `}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-lg font-bold ${isCompleted ? "text-green-400" : isInProgress ? "text-violet-400" : "text-white"}`}>
                          Step {node.stepNumber}: {node.title}
                        </h3>
                        {isCompleted && <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full font-medium">Done</span>}
                        {isInProgress && <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full font-medium border border-violet-500/30">Current</span>}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        {node.description}
                      </p>
                      
                      {!isLocked && (
                        <button 
                          onClick={() => toggleStep(index)}
                          className={`
                          w-full py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2
                          ${isCompleted ? "bg-white/5 hover:bg-white/10 text-slate-300" : "bg-violet-600 hover:bg-violet-700 text-white"}
                        `}>
                          {isExpanded ? (
                            <>Hide Resources <ArrowDown size={16} className="rotate-180" /></>
                          ) : (
                            <>{isCompleted ? "Review Material" : "View Resources"} <ArrowDown size={16} /></>
                          )}
                        </button>
                      )}

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
                            <BookOpen size={16} className="text-violet-400" /> 
                            Learning Materials
                          </h4>
                          {(() => {
                            const displayResources = node.resources?.length > 0 ? node.resources : roadmapData?.learningResources || [];
                            return displayResources.length > 0 ? (
                              displayResources.map((resource, resIdx) => (
                                <a 
                                  key={resIdx}
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex items-start gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors group"
                                >
                                  <div className="mt-0.5 bg-slate-700/50 p-1.5 rounded-md group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                                    <LinkIcon size={14} />
                                  </div>
                                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{resource.title}</span>
                                </a>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500 italic">No resources available at the moment.</p>
                            );
                          })()}
                        </div>
                      )}
                    </GlassCard>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
