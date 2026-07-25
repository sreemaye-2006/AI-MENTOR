import { motion } from "framer-motion";

// Helper to render glowing sparkles/stars
function Sparkle({ className, delay = 0, duration = 3 }) {
  return (
    <motion.div
      initial={{ opacity: 0.2, scale: 0.8 }}
      animate={{
        opacity: [0.2, 1, 0.2],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute w-1.5 h-1.5 rounded-full bg-blue-200 shadow-[0_0_6px_#93c5fd,0_0_12px_#ffffff] ${className}`}
    />
  );
}

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-[#020b24]">
      {/* Deep blue rich gradient base */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#020718] via-[#03123a] to-[#010920]" />

      {/* Left side overlapping circles cluster */}
      <div className="absolute top-0 bottom-0 left-0 w-1/3 pointer-events-none">
        {/* Large faint background circles */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#031d5b]/30 blur-xl top-[10%] left-[-150px]" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#031644]/50 border border-blue-900/10 top-[40%] left-[-100px]" />
        
        {/* Crisp overlapping blue circles (matching the image) */}
        <div className="absolute w-44 h-44 rounded-full bg-[#0d59fc] opacity-90 shadow-[0_0_30px_rgba(13,89,252,0.3)] top-[50%] left-[-40px]" />
        <div className="absolute w-36 h-36 rounded-full bg-[#004ee3] opacity-80 top-[35%] left-[-80px]" />
        <div className="absolute w-28 h-28 rounded-full bg-[#1b6aff] opacity-95 shadow-[0_0_20px_rgba(27,106,255,0.4)] top-[65%] left-[-10px]" />
        <div className="absolute w-24 h-24 rounded-full bg-[#0042c4] opacity-85 top-[20%] left-[-30px]" />
        <div className="absolute w-20 h-20 rounded-full bg-[#1a62eb] opacity-90 top-[78%] left-[-30px]" />
        <div className="absolute w-16 h-16 rounded-full bg-[#0848c4] opacity-85 top-[85%] left-[-10px]" />
      </div>

      {/* Right side overlapping circles cluster */}
      <div className="absolute top-0 bottom-0 right-0 w-1/3 pointer-events-none">
        {/* Large faint background circles */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#031d5b]/20 blur-xl bottom-[10%] right-[-180px]" />
        <div className="absolute w-[380px] h-[380px] rounded-full bg-[#031644]/40 border border-blue-900/10 bottom-[35%] right-[-120px]" />

        {/* Crisp overlapping blue circles (matching the image) */}
        <div className="absolute w-40 h-40 rounded-full bg-[#0051ee] opacity-85 shadow-[0_0_25px_rgba(0,81,238,0.3)] top-[25%] right-[-60px]" />
        <div className="absolute w-32 h-32 rounded-full bg-[#1c6bff] opacity-90 top-[40%] right-[-30px]" />
        <div className="absolute w-28 h-28 rounded-full bg-[#0243be] opacity-80 top-[15%] right-[-80px]" />
        <div className="absolute w-24 h-24 rounded-full bg-[#0055ff] opacity-95 shadow-[0_0_20px_rgba(0,85,255,0.4)] top-[60%] right-[-10px]" />
        <div className="absolute w-20 h-20 rounded-full bg-[#0039a6] opacity-75 top-[70%] right-[-50px]" />
      </div>

      {/* Glowing Star Particles (scattered as in user's image) */}
      <Sparkle className="top-[10%] left-[25%]" delay={0.2} duration={4} />
      <Sparkle className="top-[25%] left-[15%]" delay={1.5} duration={3} />
      <Sparkle className="top-[45%] left-[20%]" delay={0.8} duration={5} />
      <Sparkle className="top-[60%] left-[30%]" delay={2.3} duration={4.5} />
      <Sparkle className="top-[80%] left-[18%]" delay={0.5} duration={3.5} />
      <Sparkle className="top-[90%] left-[35%]" delay={1.8} duration={4} />
      
      <Sparkle className="top-[15%] right-[20%]" delay={0.9} duration={3.2} />
      <Sparkle className="top-[30%] right-[32%]" delay={2.1} duration={4.8} />
      <Sparkle className="top-[55%] right-[25%]" delay={1.2} duration={3.6} />
      <Sparkle className="top-[75%] right-[18%]" delay={0.3} duration={5} />
      <Sparkle className="top-[85%] right-[28%]" delay={1.7} duration={4.2} />

      {/* Center ambient lighting to emphasize the login/register forms */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#020718_90%)] opacity-85" />
    </div>
  );
}
