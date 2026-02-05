"use client";

import { useEffect, useState } from "react";

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
    <div className="min-h-screen p-10 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {user && (
        <div className="bg-white p-6 rounded-xl shadow border max-w-md">
          <p className="mb-2">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>
      )}
    </div>
  );
}
