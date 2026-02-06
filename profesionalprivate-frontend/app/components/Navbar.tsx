"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { MENU_BY_PERMISSION } from "@/app/lib/permission";

type UserType = {
  name?: string;
  role: string;
  permissions?: string[];
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const cached = localStorage.getItem("user");

      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok && result.success) {
          setUser(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
        }
      } catch {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
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

  if (loading) {
    return (
      <nav className="px-6 py-4 bg-white shadow">
        <span className="text-gray-400">Loading menu...</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow text-black">
      <div className="font-bold text-lg">Profesional Private</div>

      <div className="flex gap-6 items-center">
        {MENU_BY_PERMISSION.filter((menu) =>
          (user?.permissions ?? []).includes(menu.permission),
        ).map((menu) => (
          <Link
            key={menu.permission}
            href={menu.href}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            {menu.label}
          </Link>
        ))}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition flex items-center justify-center"
          >
            <User size={20} className="text-blue-600 cursor-pointer" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg py-2 z-50">
              {user?.name && (
                <div className="px-4 py-2 text-sm text-gray-600 border-b">
                  {user.name}
                </div>
              )}

              <div className="px-4 py-2 hover:bg-red-50">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
