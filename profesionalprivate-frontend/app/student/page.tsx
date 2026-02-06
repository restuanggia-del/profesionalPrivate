"use client";

import { useEffect, useState } from "react";
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
        localStorage.removeItem("role");
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
        if (result.data.role !== "student") {
          window.location.href = "/login";
          return;
        }
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        Loading student data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">
              Student Dashboard 🎓
            </h1>
          </div>

          {/* Profile Card */}
          {user && (
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Profile</h2>

              <div className="space-y-2 text-black">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
