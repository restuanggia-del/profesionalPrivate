"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import {
  BookOpen,
  Users,
  ClipboardList,
  Plus,
  BarChart2,
  ChevronRight,
  Star,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";

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

// ── Types ────────────────────────────────────────────────────────────────────
type User = { id: number; name: string; email: string; role: string };
type Analytics = {
  total_courses: number;
  total_students: number;
  total_quizzes: number;
  average_score: number;
};
type Course = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// ── Modal Buat Kelas ──────────────────────────────────────────────────────────
function CreateCourseModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/teacher/courses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, description }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Gagal membuat kelas");
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
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Buat Kelas Baru
        </h2>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kelas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Matematika Dasar"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang kelas ini..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
              {loading ? "Menyimpan..." : "Buat Kelas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal Buat Quiz ───────────────────────────────────────────────────────────
function CreateQuizModal({
  courses,
  onClose,
  onCreated,
}: {
  courses: Course[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
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
        body: JSON.stringify({ title, course_id: parseInt(courseId) }),
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
              placeholder="Contoh: UTS Matematika"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Kelas
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            >
              <option value="">-- Pilih kelas --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherPage() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  const fetchAll = async () => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      // Fetch user info
      const [meRes, analyticsRes, coursesRes] = await Promise.all([
        fetch(`${API}/api/me`, { headers: authHeaders() }),
        fetch(`${API}/api/teacher/dashboard/analytics`, {
          headers: authHeaders(),
        }),
        fetch(`${API}/api/teacher/courses`, { headers: authHeaders() }),
      ]);

      const [meData, analyticsData, coursesData] = await Promise.all([
        meRes.json(),
        analyticsRes.json(),
        coursesRes.json(),
      ]);

      if (!meRes.ok || !meData.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }

      setUser(meData.data);
      if (analyticsData.success) setAnalytics(analyticsData.data);
      if (coursesData.success) setCourses(coursesData.data || []);
    } catch {
      setError("Gagal memuat data. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard allow={["teacher"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Selamat datang, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola kelas, quiz, dan pantau perkembangan siswa Anda.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<BookOpen size={20} className="text-indigo-600" />}
              label="Total Kelas"
              value={analytics?.total_courses ?? 0}
              color="bg-indigo-50"
            />
            <StatCard
              icon={<Users size={20} className="text-emerald-600" />}
              label="Total Siswa"
              value={analytics?.total_students ?? 0}
              color="bg-emerald-50"
            />
            <StatCard
              icon={<ClipboardList size={20} className="text-purple-600" />}
              label="Total Quiz"
              value={analytics?.total_quizzes ?? 0}
              color="bg-purple-50"
            />
            <StatCard
              icon={<Star size={20} className="text-amber-500" />}
              label="Rata-rata Nilai"
              value={
                analytics
                  ? `${Number(analytics.average_score).toFixed(1)}`
                  : "0"
              }
              color="bg-amber-50"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setShowCreateCourse(true)}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl transition group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Buat Kelas</p>
                  <p className="text-xs text-indigo-200">Tambah kelas baru</p>
                </div>
                <ChevronRight
                  size={16}
                  className="ml-auto opacity-60 group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => setShowCreateQuiz(true)}
                className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-2xl transition group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ClipboardList size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Buat Quiz</p>
                  <p className="text-xs text-purple-200">Tambah quiz baru</p>
                </div>
                <ChevronRight
                  size={16}
                  className="ml-auto opacity-60 group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => (window.location.href = "/teacher/analytics")}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white p-5 rounded-2xl transition group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart2 size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Lihat Analitik</p>
                  <p className="text-xs text-emerald-200">Statistik lengkap</p>
                </div>
                <ChevronRight
                  size={16}
                  className="ml-auto opacity-60 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Daftar Kelas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Kelas Saya ({courses.length})
              </h2>
              <button
                onClick={() => setShowCreateCourse(true)}
                className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition"
              >
                <Plus size={16} />
                Tambah
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Belum ada kelas</p>
                <p className="text-gray-400 text-sm mt-1">
                  Klik tombol &quot;Buat Kelas&quot; untuk mulai
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                    onClick={() =>
                      (window.location.href = `/teacher/course/${course.id}`)
                    }
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                      <BookOpen size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {course.description || "Tidak ada deskripsi"}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-400">
                        {new Date(course.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-indigo-500 font-medium group-hover:gap-2 transition-all">
                        Detail <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showCreateCourse && (
          <CreateCourseModal
            onClose={() => setShowCreateCourse(false)}
            onCreated={fetchAll}
          />
        )}
        {showCreateQuiz && (
          <CreateQuizModal
            courses={courses}
            onClose={() => setShowCreateQuiz(false)}
            onCreated={fetchAll}
          />
        )}
      </div>
    </AuthGuard>
  );
}
