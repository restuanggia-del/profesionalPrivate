"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "../components/Navbar";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function StudentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session not found. Please login.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setError("Session expired. Please login again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
          return;
        }

        setUser(result.data);
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthGuard allow={["student"]}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
          Loading student data...
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">
          {error}
        </div>
      ) : (
        <>
          <Navbar />

          <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
              <div className="col-span-1 flex flex-col gap-8">
                <div className="bg-gradient-to-br from-blue-500 to-sky-500 text-white p-8 rounded-3xl shadow-lg">
                  <h1 className="text-2xl font-bold mb-6">
                    Student Dashboard 🎓
                  </h1>
                  {user && (
                    <div className="space-y-2 text-lg">
                      <p>
                        <b>Name:</b> {user.name}
                      </p>
                      <p>
                        <b>Email:</b> {user.email}
                      </p>
                      <p>
                        <b>Role:</b> {user.role}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-sky-400 text-white p-10 rounded-3xl shadow-lg text-center">
                  Layout 2
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-blue-400 to-sky-500 text-white p-10 rounded-3xl shadow-lg flex items-center justify-center text-xl">
                Layout 3
              </div>
            </div>
          </div>
        </>
      )}
    </AuthGuard>
  );
}
