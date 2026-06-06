"use client";

import { useParams, useRouter } from "next/navigation";

export default function LessonDetail() {
  const { lessonId } = useParams();
  const router = useRouter();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Lesson {lessonId}</h1>

      <button
        onClick={() => router.back()}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
}
