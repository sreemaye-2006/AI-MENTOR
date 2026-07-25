export default function GradientButton({
  children,
  ...props
}) {
  return (
    <button
      {...props}
      className="
      w-full
      py-3
      rounded-xl
      bg-gradient-to-r
      from-violet-600
      via-purple-600
      to-cyan-500
      font-semibold
      hover:scale-105
      transition-all
      duration-300
      shadow-lg
      shadow-violet-500/30
      "
    >
      {children}
    </button>
  );
}