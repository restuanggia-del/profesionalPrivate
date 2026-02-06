"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard allow={["admin"]}>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Admin Dashboard ⚙️</h1>
      </div>
    </AuthGuard>
  );
}
