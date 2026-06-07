"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";
import {
  Users,
  BookOpen,
  Award,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCog,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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

type Stats = {
  users: number;
  students: number;
  teachers: number;
  courses: number;
  certificates: number;
};
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
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

function ChangeRoleModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Gagal mengubah role");
        return;
      }
      onDone();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Ganti Role</h2>
        <p className="text-sm text-gray-500 mb-6">
          User: <span className="font-medium text-gray-700">{user.name}</span>
        </p>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Baru
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
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
              className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl hover:bg-rose-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SuspendModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/admin/users/${user.id}/suspend`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      onDone();
      onClose();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Suspend User?</h2>
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-medium text-gray-700">{user.name}</span> tidak
          akan bisa login setelah disuspend.
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Fitur aktifkan kembali bisa ditambahkan nanti.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSuspend}
            disabled={loading}
            className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Ya, Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    student: "bg-blue-100 text-blue-700",
    teacher: "bg-indigo-100 text-indigo-700",
    admin: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[role] || "bg-gray-100 text-gray-600"}`}
    >
      {role}
    </span>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleModal, setRoleModal] = useState<User | null>(null);
  const [suspendModal, setSuspendModal] = useState<User | null>(null);

  const limit = 10;

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/admin/dashboard`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {}
  };

  const fetchUsers = async (p = page) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/admin/users?page=${p}&limit=${limit}`,
        { headers: authHeaders() },
      );
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.data || []);
        setTotal(data.data.total || 0);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers(1);
  }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchUsers(p);
  };

  const totalPages = Math.ceil(total / limit);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AuthGuard allow={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard ⚙️
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola semua pengguna dan pantau statistik aplikasi.
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                icon={<Users size={20} className="text-rose-600" />}
                label="Total User"
                value={stats.users}
                color="bg-rose-50"
              />
              <StatCard
                icon={<GraduationCap size={20} className="text-blue-600" />}
                label="Siswa"
                value={stats.students}
                color="bg-blue-50"
              />
              <StatCard
                icon={<UserCog size={20} className="text-indigo-600" />}
                label="Guru"
                value={stats.teachers}
                color="bg-indigo-50"
              />
              <StatCard
                icon={<BookOpen size={20} className="text-emerald-600" />}
                label="Total Kelas"
                value={stats.courses}
                color="bg-emerald-50"
              />
              <StatCard
                icon={<Award size={20} className="text-amber-500" />}
                label="Sertifikat"
                value={stats.certificates}
                color="bg-amber-50"
              />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-semibold text-gray-700">
                Daftar Pengguna ({total})
              </h2>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari nama / email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-400 w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Bergabung</th>
                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        Tidak ada user ditemukan
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold text-sm shrink-0">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {u.name}
                              </p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-6 py-4">
                          {u.is_active ? (
                            <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                              <CheckCircle2 size={13} /> Aktif
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                              <XCircle size={13} /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {new Date(u.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setRoleModal(u)}
                              className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition font-medium"
                            >
                              <ShieldCheck size={13} /> Ganti Role
                            </button>
                            {u.is_active && (
                              <button
                                onClick={() => setSuspendModal(u)}
                                className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition font-medium"
                              >
                                <ShieldOff size={13} /> Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Halaman {page} dari {totalPages} ({total} user)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                          p === page
                            ? "bg-rose-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {roleModal && (
          <ChangeRoleModal
            user={roleModal}
            onClose={() => setRoleModal(null)}
            onDone={() => {
              fetchUsers(page);
              fetchStats();
            }}
          />
        )}
        {suspendModal && (
          <SuspendModal
            user={suspendModal}
            onClose={() => setSuspendModal(null)}
            onDone={() => {
              fetchUsers(page);
              fetchStats();
            }}
          />
        )}
      </div>
    </AuthGuard>
  );
}
