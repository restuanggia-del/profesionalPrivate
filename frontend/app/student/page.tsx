"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  ChevronRight,
  Plus,
  Award,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

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

type User = { id: number; name: string; email: string; role: string };
type Course = { id: number; title: string; progress: number };

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div
        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function JoinCourseModal({
  onClose,
  onJoined,
}: {
  onClose: () => void;
  onJoined: () => void;
}) {
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API}/api/student/join`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ course_id: parseInt(courseId) }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Gagal bergabung ke kelas");
        return;
      }
      setSuccess("Berhasil bergabung ke kelas!");
      setTimeout(() => {
        onJoined();
        onClose();
      }, 1000);
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Gabung Kelas</h2>
        <p className="text-sm text-gray-500 mb-6">
          Masukkan ID kelas yang diberikan oleh guru Anda.
        </p>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Kelas
            </label>
            <input
              type="number"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Contoh: 2"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-3">
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
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Gabung"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  const fetchAll = async () => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const [meRes, coursesRes] = await Promise.all([
        fetch(`${API}/api/me`, { headers: authHeaders() }),
        fetch(`${API}/api/student/courses`, { headers: authHeaders() }),
      ]);

      const [meData, coursesData] = await Promise.all([
        meRes.json(),
        coursesRes.json(),
      ]);

      if (!meRes.ok || !meData.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return;
      }

      setUser(meData.data);
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

  const totalCourses = courses.length;
  const avgProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + (c.progress || 0), 0) /
            courses.length,
        )
      : 0;
  const completedCourses = courses.filter((c) => c.progress >= 100).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard allow={["student"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Halo, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Semangat belajar hari ini!</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/student/certificates")}
                className="flex items-center gap-2 border border-amber-400 text-amber-600 px-4 py-2.5 rounded-xl hover:bg-amber-50 transition text-sm font-medium"
              >
                <Award size={16} />
                Sertifikat
              </button>
              <button
                onClick={() => setShowJoin(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium"
              >
                <Plus size={16} />
                Gabung Kelas
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<BookOpen size={20} className="text-blue-600" />}
              label="Kelas Diikuti"
              value={totalCourses}
              color="bg-blue-50"
            />
            <StatCard
              icon={<TrendingUp size={20} className="text-emerald-600" />}
              label="Rata-rata Progres"
              value={`${avgProgress}%`}
              color="bg-emerald-50"
            />
            <StatCard
              icon={<Award size={20} className="text-amber-500" />}
              label="Kelas Selesai"
              value={completedCourses}
              color="bg-amber-50"
            />
          </div>

          {/* Daftar Kelas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Kelas Saya ({totalCourses})
              </h2>
              <button
                onClick={() => setShowJoin(true)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition"
              >
                <Plus size={15} />
                Gabung Kelas Baru
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  Belum ada kelas yang diikuti
                </p>
                <p className="text-gray-400 text-sm mt-1 mb-4">
                  Gabung kelas dengan memasukkan ID kelas dari guru Anda
                </p>
                <button
                  onClick={() => setShowJoin(true)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm"
                >
                  Gabung Kelas Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() =>
                      (window.location.href = `/student/course/${course.id}`)
                    }
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen size={18} className="text-blue-600" />
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          course.progress >= 100
                            ? "bg-green-100 text-green-600"
                            : course.progress > 0
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {course.progress >= 100
                          ? "Selesai"
                          : course.progress > 0
                            ? "Dalam Progress"
                            : "Belum Mulai"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition line-clamp-2 mb-3">
                      {course.title}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progres</span>
                        <span className="font-semibold text-gray-700">
                          {course.progress || 0}%
                        </span>
                      </div>
                      <ProgressBar value={course.progress || 0} />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <ClipboardList size={13} />
                        <span>ID Kelas: {course.id}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-blue-500 font-medium group-hover:gap-2 transition-all">
                        Buka <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showJoin && (
          <JoinCourseModal
            onClose={() => setShowJoin(false)}
            onJoined={fetchAll}
          />
        )}
      </div>
    </AuthGuard>
  );
}
