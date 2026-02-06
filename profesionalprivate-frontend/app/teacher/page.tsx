"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function TeacherPage() {
  return (
    <AuthGuard allow={["teacher"]}>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Teacher Dashboard 📘</h1>
      </div>
    </AuthGuard>
  );
}
