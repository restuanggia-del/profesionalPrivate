"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";
import CourseCard from "@/app/components/CourseCard";
import SkeletonCard from "@/app/components/SkeletonCard";

type Course = {
  id: number;
  title: string;
  progress: number;
};

export default function StudentCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/student/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
          setError("Failed to load courses");
          return;
        }

        setCourses(result.data);
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <AuthGuard allow={["student"]}>
      {" "}
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-black">My Courses 📚</h1>

          {loading ? (
            <div className="grid grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-600">No courses enrolled yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  progress={course.progress}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
