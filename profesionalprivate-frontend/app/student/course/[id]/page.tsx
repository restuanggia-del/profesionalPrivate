"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";

type Course = {
  id: number;
  title: string;
  description: string;
  progress: number;
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/student/course/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();
      setCourse(result.data);
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  return (
    <AuthGuard allow={["student"]}>
      {" "}
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-10 text-black">
        {loading ? (
          <p>Loading...</p>
        ) : course ? (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
            <h1 className="text-3xl font-bold">{course.title}</h1>

            <p className="mt-4 text-gray-700">
              {course.description || "No description available"}
            </p>

            <div className="mt-6">
              <p className="font-semibold">Progress</p>

              <div className="bg-gray-200 h-3 rounded mt-2">
                <div
                  className="bg-blue-500 h-3 rounded"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p>Course not found</p>
        )}
      </div>
    </AuthGuard>
  );
}
