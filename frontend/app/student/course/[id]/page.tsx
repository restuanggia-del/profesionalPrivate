"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle2,
  Circle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}
function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
}

type Course = {
  id: number;
  title: string;
  description: string;
  progress: number;
};
type Lesson = {
  id: number;
  title: string;
  content: string;
  completed: boolean;
};
type Quiz = { id: number; title: string; questions: { id: number }[] };

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lessons" | "quizzes">("lessons");
  const [completing, setCompleting] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [courseRes, lessonsRes, quizzesRes] = await Promise.all([
        fetch(`${API}/api/student/course/${courseId}`, {
          headers: authHeaders(),
        }),
        fetch(`${API}/api/student/courses/${courseId}/lessons`, {
          headers: authHeaders(),
        }),
        fetch(`${API}/api/teacher/quizzes?course_id=${courseId}`, {
          headers: authHeaders(),
        }),
      ]);

      if (courseRes.ok) {
        const d = await courseRes.json();
        if (d.success) setCourse(d.data);
      }
      if (lessonsRes.ok) {
        const d = await lessonsRes.json();
        if (d.success) setLessons(d.data || []);
      }
      // Quiz — boleh gagal
      try {
        if (quizzesRes.ok) {
          const d = await quizzesRes.json();
          if (d.success) setQuizzes(d.data || []);
        }
      } catch {
        setQuizzes([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleComplete = async (lessonId: number, current: boolean) => {
    if (current) return; // sudah selesai, tidak bisa un-complete
    setCompleting(lessonId);
    try {
      await fetch(`${API}/api/student/lessons/complete`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ lesson_id: lessonId }),
      });
      // Update local state
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)),
      );
      // Recalculate progress
      const updated = lessons.map((l) =>
        l.id === lessonId ? { ...l, completed: true } : l,
      );
      const pct = Math.round(
        (updated.filter((l) => l.completed).length / updated.length) * 100,
      );
      setCourse((prev) => (prev ? { ...prev, progress: pct } : prev));
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(null);
    }
  };

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : course?.progress || 0;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat kelas...</p>
        </div>
      </div>
    );

  return (
    <AuthGuard allow={["student"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => router.push("/student")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Kembali</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800">
              {course?.title || "Detail Kelas"}
            </span>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* Header kelas */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-blue-200 mt-1 text-sm">
              {course?.description || "Tidak ada deskripsi"}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200 flex items-center gap-1.5">
                  <TrendingUp size={14} /> Progres Belajar
                </span>
                <span className="font-bold text-lg">{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-white h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {completedCount}/{lessons.length} Materi
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {quizzes.length} Quiz
              </span>
            </div>
          </div>

          {/* Tab */}
          <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === "lessons" ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
            >
              <FileText size={15} /> Materi ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === "quizzes" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
            >
              <ClipboardList size={15} /> Quiz ({quizzes.length})
            </button>
          </div>

          {/* Tab: Materi */}
          {activeTab === "lessons" && (
            <div className="space-y-3">
              {lessons.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <FileText size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada materi di kelas ini</p>
                </div>
              ) : (
                lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    onClick={() =>
                      router.push(
                        `/student/course/${courseId}/lessons/${lesson.id}`,
                      )
                    }
                    className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition group ${lesson.completed ? "border-green-200 bg-green-50/30" : "border-gray-100"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${lesson.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {lesson.completed ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold ${lesson.completed ? "text-green-700" : "text-gray-800"}`}
                      >
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">
                        {lesson.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.completed ? (
                        <span className="text-xs text-green-600 font-medium bg-green-100 px-2.5 py-1 rounded-full">
                          Selesai
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComplete(lesson.id, lesson.completed);
                          }}
                          disabled={completing === lesson.id}
                          className="text-xs text-blue-600 font-medium bg-blue-100 px-2.5 py-1 rounded-full hover:bg-blue-200 transition disabled:opacity-50"
                        >
                          {completing === lesson.id ? "..." : "Tandai Selesai"}
                        </button>
                      )}
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-blue-400 transition"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab: Quiz */}
          {activeTab === "quizzes" && (
            <div className="space-y-3">
              {quizzes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <ClipboardList
                    size={36}
                    className="text-gray-300 mx-auto mb-3"
                  />
                  <p className="text-gray-500">Belum ada quiz di kelas ini</p>
                </div>
              ) : (
                quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition group"
                  >
                    <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <ClipboardList size={16} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {quiz.questions?.length || 0} soal
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2.5 py-1 rounded-full">
                        Kerjakan
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-purple-400 transition"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
