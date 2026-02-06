"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

type User = {
  role: string;
  permissions: string[];
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
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
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

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

      <div className="flex gap-4 items-center">
        {user?.permissions?.includes("student.dashboard") && (
          <Link href="/student">Dashboard</Link>
        )}

        {user?.permissions?.includes("student.course") && (
          <Link href="/student/course">Course</Link>
        )}

        {user?.permissions?.includes("admin.dashboard") && (
          <Link href="/admin">Admin</Link>
        )}

        <LogoutButton />
      </div>
    </nav>
  );
}
