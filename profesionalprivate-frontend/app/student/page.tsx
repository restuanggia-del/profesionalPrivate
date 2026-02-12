"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "../components/Navbar";
import UserAvatar from "@/app/components/UserAvatar";
import CourseCard from "@/app/components/CourseCard";
import AnimatedCard from "@/app/components/AnimatedCard";
import SkeletonCard from "@/app/components/SkeletonCard";

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
              <div className="flex flex-col gap-8">
                <AnimatedCard>
                  <div className="bg-gradient-to-br from-blue-500 to-sky-500 text-white p-8 rounded-3xl">
                    {user && (
                      <>
                        <UserAvatar name={user.name} />

                        <h1 className="text-2xl font-bold mt-4">
                          Student Dashboard 🎓
                        </h1>

                        <div className="mt-4 space-y-1">
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
                      </>
                    )}

                    {loading && <SkeletonCard />}
                  </div>
                </AnimatedCard>

                <AnimatedCard>
                  <div className="bg-gradient-to-br from-blue-400 to-sky-400 text-white p-8 rounded-3xl">
                    <h2 className="font-semibold mb-3">Quick Stats</h2>
                    <p>📚 Active Courses: 3</p>
                    <p>✅ Completed Lessons: 12</p>
                    <p>⏳ Pending Tasks: 2</p>
                  </div>
                </AnimatedCard>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-blue-400 to-sky-500 text-white p-8 rounded-3xl">
                <h2 className="text-xl font-bold mb-6">Continue Learning</h2>

                <div className="grid grid-cols-2 gap-6">
                  {loading ? (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  ) : (
                    <>
                      <CourseCard title="React Basics" progress={70} />
                      <CourseCard title="Next.js Mastery" progress={40} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthGuard>
  );
}
