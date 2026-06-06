"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Login failed");
        return;
      }

      const token = result.data.token;
      const role = result.data.user.role;
      const permissions = result.data.user.permissions || [];

      document.cookie = `token=${token}; path=/`;
      document.cookie = `role=${role}; path=/`;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", JSON.stringify(permissions));

      if (role === "admin") router.push("/admin");
      else if (role === "teacher") router.push("/teacher");
      else router.push("/student");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 px-4">
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-md
          bg-white/95 backdrop-blur
          p-8 rounded-2xl
          shadow-2xl
        "
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Log In
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="
                w-full border rounded-lg px-4 py-2
                text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full border rounded-lg px-4 py-2
                text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 text-white py-2 rounded-lg
              cursor-pointer
              hover:bg-blue-700
              active:scale-[0.98]
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-700">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="
              text-blue-600 font-medium
              cursor-pointer
              hover:text-blue-800
              transition
            "
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
