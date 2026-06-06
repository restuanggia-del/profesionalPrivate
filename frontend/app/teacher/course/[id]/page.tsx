"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import {
  BookOpen,
  ClipboardList,
  Plus,
  ArrowLeft,
  FileText,
  Trash2,
  ChevronRight,
  Pencil,
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
  created_at: string;
};
type Lesson = {
  id: number;
  title: string;
  content: string;
  course_id: number;
  created_at: string;
};
type Quiz = {
  id: number;
  title: string;
  course_id: number;
  created_at: string;
  questions: { id: number }[];
};

function AddLessonModal({
  courseId,
  onClose,
  onCreated,
}: {
  courseId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/teacher/lessons`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, content, course_id: courseId }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Gagal menambah materi");
        return;
      }
      onCreated();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah Materi</h2>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Materi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengenalan Microsoft Word"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Isi Materi
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi materi di sini..."
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Tambah Materi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddQuizModal({
  courseId,
  onClose,
  onCreated,
}: {
  courseId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/teacher/quizzes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, course_id: courseId }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Gagal membuat quiz");
        return;
      }
      onCreated();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Buat Quiz Baru</h2>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Quiz
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: UTS Komputer"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Buat Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditLessonModal({
  lesson,
  onClose,
  onUpdated,
}: {
  lesson: Lesson;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/teacher/lessons/${lesson.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Gagal memperbarui materi");
        return;
      }
      onUpdated();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Materi</h2>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Materi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Isi Materi
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Materi?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Materi yang dihapus tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lessons" | "quizzes">("lessons");
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
  const [showAddQuiz, setShowAddQuiz] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch course list
      const courseRes = await fetch(`${API}/api/teacher/courses`, {
        headers: authHeaders(),
      });
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        if (courseData.success && Array.isArray(courseData.data)) {
          const found = courseData.data.find((c: Course) => c.id === courseId);
          if (found) setCourse(found);
        }
      }

      // Fetch lessons
      const lessonsRes = await fetch(
        `${API}/api/teacher/courses/${courseId}/lessons`,
        { headers: authHeaders() },
      );
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        if (lessonsData.success) setLessons(lessonsData.data || []);
      }

      // Fetch quizzes
      try {
        const quizzesRes = await fetch(
          `${API}/api/teacher/quizzes?course_id=${courseId}`,
          { headers: authHeaders() },
        );
        if (quizzesRes.ok) {
          const quizzesData = await quizzesRes.json();
          if (quizzesData.success) setQuizzes(quizzesData.data || []);
        }
      } catch {
        setQuizzes([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard allow={["teacher"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => router.push("/teacher")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Kembali</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-indigo-600" />
            </div>
            <span className="font-semibold text-gray-800">
              {course?.title || "Detail Kelas"}
            </span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Header kelas */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-indigo-200 mt-1 text-sm">
              {course?.description || "Tidak ada deskripsi"}
            </p>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {lessons.length} Materi
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
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "lessons"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText size={15} />
              Materi ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "quizzes"
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ClipboardList size={15} />
              Quiz ({quizzes.length})
            </button>
          </div>

          {/* Tab: Materi */}
          {activeTab === "lessons" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">Daftar Materi</h2>
                <button
                  onClick={() => setShowAddLesson(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  <Plus size={15} />
                  Tambah Materi
                </button>
              </div>

              {lessons.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <FileText size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada materi</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Klik tombol &quot;Tambah Materi&quot; untuk mulai
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 group hover:shadow-md transition"
                    >
                      <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                          {lesson.content}
                        </p>
                        <p className="text-xs text-gray-300 mt-2">
                          {new Date(lesson.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                        <button
                          onClick={() => setEditingLesson(lesson)}
                          className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit materi"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingLessonId(lesson.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Hapus materi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Quiz */}
          {activeTab === "quizzes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">Daftar Quiz</h2>
                <button
                  onClick={() => setShowAddQuiz(true)}
                  className="flex items-center gap-1.5 bg-purple-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-purple-700 transition"
                >
                  <Plus size={15} />
                  Buat Quiz
                </button>
              </div>

              {quizzes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <ClipboardList
                    size={36}
                    className="text-gray-300 mx-auto mb-3"
                  />
                  <p className="text-gray-500 font-medium">Belum ada quiz</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Klik tombol &quot;Buat Quiz&quot; untuk mulai
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      onClick={() => router.push(`/teacher/quiz/${quiz.id}`)}
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
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddLesson && (
          <AddLessonModal
            courseId={courseId}
            onClose={() => setShowAddLesson(false)}
            onCreated={fetchData}
          />
        )}
        {showAddQuiz && (
          <AddQuizModal
            courseId={courseId}
            onClose={() => setShowAddQuiz(false)}
            onCreated={fetchData}
          />
        )}

        {/* Modal Edit Materi */}
        {editingLesson && (
          <EditLessonModal
            lesson={editingLesson}
            onClose={() => setEditingLesson(null)}
            onUpdated={fetchData}
          />
        )}

        {/* Konfirmasi Hapus */}
        {deletingLessonId !== null && (
          <ConfirmDeleteModal
            onClose={() => setDeletingLessonId(null)}
            onConfirm={async () => {
              await fetch(`${API}/api/teacher/lessons/${deletingLessonId}`, {
                method: "DELETE",
                headers: authHeaders(),
              });
              setDeletingLessonId(null);
              fetchData();
            }}
          />
        )}
      </div>
    </AuthGuard>
  );
}
