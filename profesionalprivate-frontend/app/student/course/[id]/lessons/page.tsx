"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
};

export default function LessonsPage() {
  const { id } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/student/courses/${id}/lessons`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await res.json();
    setLessons(result.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const progress =
    lessons.length === 0
      ? 0
      : Math.round(
          (lessons.filter((l) => l.completed).length / lessons.length) * 100,
        );

  const toggleComplete = async (lessonId: number) => {
    const token = localStorage.getItem("token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/student/lessons/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_id: lessonId,
        }),
      },
    );

    fetchLessons();
  };

  return (
    <AuthGuard allow={["student"]}>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-10 text-black">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
          <div className="mb-6">
            <p className="mb-2 font-medium">Progress: {progress}%</p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">Course Lessons</h1>

          {loading ? (
            <p>Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p>No lessons available</p>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition ${
                    lesson.completed
                      ? "bg-green-50 border-green-300"
                      : "bg-white"
                  }`}
                >
                  <span>{lesson.title}</span>

                  <input
                    type="checkbox"
                    checked={lesson.completed}
                    onChange={() => toggleComplete(lesson.id)}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
