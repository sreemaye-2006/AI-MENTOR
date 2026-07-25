export default function InputField({
  icon: Icon,
  label,
  ...props
}) {
  return (
    <div className="mb-4">

      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <div className="flex items-center bg-slate-900/60 rounded-xl border border-slate-700 px-4">

        <Icon
          size={18}
          className="text-violet-400"
        />

        <input
          {...props}
          className="bg-transparent flex-1 py-3 px-3 outline-none text-white placeholder:text-gray-500"
        />

      </div>

    </div>
  );
}   