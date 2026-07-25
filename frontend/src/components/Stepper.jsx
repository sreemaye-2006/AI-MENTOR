export default function Stepper({ step }) {
  return (
    <div className="flex justify-center items-center gap-4 my-6">

      <div
        className={`h-3 w-24 rounded-full ${
          step >= 1
            ? "bg-purple-500"
            : "bg-gray-700"
        }`}
      />

      <div
        className={`h-3 w-24 rounded-full ${
          step >= 2
            ? "bg-blue-500"
            : "bg-gray-700"
        }`}
      />

    </div>
  );
}