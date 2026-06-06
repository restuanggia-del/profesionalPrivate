"use client";

export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-white/30 rounded-full h-3">
      <div
        className="bg-white h-3 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
