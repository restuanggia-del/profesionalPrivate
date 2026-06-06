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
    <nav className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-bold leading-tight">
          Profesional
          <br />
          Private
        </div>
        <div className="flex gap-10 items-center font-medium">
          {MENU_BY_PERMISSION.filter((menu) =>
            (user?.permissions ?? []).includes(menu.permission),
          ).map((menu) => (
            <Link
              key={menu.permission}
              href={menu.href}
              className="hover:opacity-80 transition"
            >
              {menu.label}
            </Link>
          ))}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center cursor-pointer"
            >
              <User size={22} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl p-5 text-center z-50">
                {user?.name && (
                  <div className="text-gray-800 font-semibold mb-4">
                    {user.name}
                  </div>
                )}

                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
