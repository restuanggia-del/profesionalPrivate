"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  User,
  LogOut,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";

// ── Konfirmasi Logout ─────────────────────────────────────────────────────────
function LogoutConfirmModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Keluar dari Aplikasi?
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Kamu yakin ingin keluar? Kamu perlu login kembali untuk mengakses
          aplikasi.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition font-medium"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  student: {
    label: "Student",
    color: "text-blue-600",
    bg: "bg-blue-600",
    dot: "bg-blue-400",
  },
  teacher: {
    label: "Teacher",
    color: "text-indigo-600",
    bg: "bg-indigo-600",
    dot: "bg-indigo-400",
  },
  admin: {
    label: "Admin",
    color: "text-rose-600",
    bg: "bg-rose-600",
    dot: "bg-rose-400",
  },
};

const ROLE_MENUS: Record<string, { label: string; href: string }[]> = {
  student: [{ label: "Dashboard", href: "/student" }],
  teacher: [{ label: "Dashboard", href: "/teacher" }],
  admin: [{ label: "Dashboard", href: "/admin" }],
};

type UserType = { id: number; name: string; email: string; role: string };

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    // Ambil dari localStorage dulu (sudah di-cache AuthGuard)
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.replace("/login");
  };

  const role = user?.role || "student";
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const menus = ROLE_MENUS[role] || [];
  const initials = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <>
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center h-16 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className={`w-8 h-8 ${cfg.bg} rounded-lg flex items-center justify-center`}
            >
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-base">
              ProfesionalPrivate
            </span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Role badge */}
          <span
            className={`text-sm font-semibold ${cfg.color} hidden sm:block`}
          >
            {cfg.label}
          </span>

          {/* Menu links */}
          <div className="flex items-center gap-1 ml-2">
            {menus.map((menu) => {
              const active =
                pathname === menu.href || pathname.startsWith(menu.href + "/");
              return (
                <a
                  key={menu.href}
                  href={menu.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? `${cfg.color} bg-gray-100`
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {menu.label}
                </a>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition group"
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 ${cfg.bg} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {initials}
              </div>

              {/* Nama & role */}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight max-w-[120px] truncate">
                  {user?.name || "..."}
                </p>
                <p className="text-xs text-gray-400 leading-tight max-w-[120px] truncate">
                  {user?.email || ""}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {/* Header dropdown */}
                <div className={`px-5 py-4 ${cfg.bg} text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{user?.name}</p>
                      <p className="text-xs opacity-75 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="ml-auto opacity-60 hover:opacity-100 transition shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-medium opacity-90 capitalize">
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  {menus.map((menu) => (
                    <a
                      key={menu.href}
                      href={menu.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <BookOpen size={15} className="text-gray-400" />
                      {menu.label}
                    </a>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mx-3" />

                {/* Logout */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowLogout(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition font-medium"
                  >
                    <LogOut size={15} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal konfirmasi logout */}
      {showLogout && (
        <LogoutConfirmModal
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
