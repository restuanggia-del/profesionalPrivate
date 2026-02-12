"use client";

import AnimatedCard from "./AnimatedCard";
import ProgressBar from "./ProgressBar";

type Props = {
  title: string;
  progress: number;
};

export default function CourseCard({ title, progress }: Props) {
  return (
    <AnimatedCard>
      <div className="bg-white text-black p-6 rounded-3xl cursor-pointer hover:shadow-xl transition">
        <h3 className="font-semibold mb-3">{title}</h3>

        <ProgressBar value={progress} />

        <p className="text-sm mt-2 text-gray-600">Progress: {progress}%</p>
      </div>
    </AnimatedCard>
  );
}
