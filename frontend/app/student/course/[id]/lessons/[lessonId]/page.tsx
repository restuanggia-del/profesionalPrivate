"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import { ArrowLeft, CheckCircle2, BookOpen, Clock } from "lucide-react";

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

type Lesson = {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  created_at: string;
};

export default function LessonDetailPage() {
  const { id, lessonId } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        // Ambil semua lessons lalu filter by ID
        const res = await fetch(`${API}/api/student/courses/${id}/lessons`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          const found = (data.data || []).find(
            (l: Lesson) => l.id === Number(lessonId),
          );
          if (found) {
            setLesson(found);
            setDone(found.completed);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id, lessonId]);

  const handleComplete = async () => {
    if (done) return;
    setCompleting(true);
    try {
      await fetch(`${API}/api/student/lessons/complete`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ lesson_id: Number(lessonId) }),
      });
      setDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <AuthGuard allow={["student"]}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => router.push(`/student/course/${id}`)}
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
            <span className="font-semibold text-gray-800 line-clamp-1">
              {lesson?.title || "Materi"}
            </span>
          </div>
          {done && (
            <span className="ml-auto flex items-center gap-1.5 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> Selesai
            </span>
          )}
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <h1 className="text-2xl font-bold">{lesson?.title}</h1>
              {lesson?.created_at && (
                <p className="text-blue-200 text-sm mt-2 flex items-center gap-1.5">
                  <Clock size={13} />
                  {new Date(lesson.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Isi materi */}
            <div className="p-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {lesson?.content || "Tidak ada konten"}
                </p>
              </div>

              {/* Tombol selesai */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                {done ? (
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                    <CheckCircle2 size={20} />
                    <p className="font-medium">
                      Materi ini sudah kamu selesaikan!
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {completing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Tandai Selesai
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => router.push(`/student/course/${id}`)}
                  className="w-full mt-3 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                >
                  Kembali ke Daftar Materi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
