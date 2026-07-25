export default function GlassCards({ children, className = "" }) {
  return (
    <div
      className={`
      rounded-2xl
      border border-white/10
      bg-slate-900/40
      backdrop-blur-xl
      p-6
      shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      hover:shadow-[0_8px_32px_0_rgba(139,92,246,0.15)]
      transition-all
      duration-300
      ${className}
      `}
    >
      {children}
    </div>
  );
}

export { GlassCards as GlassCard };