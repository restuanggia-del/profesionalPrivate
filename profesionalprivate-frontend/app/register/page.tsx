"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Password tidak sama");
      return;
    }

    setLoading(true);

    // TODO: hubungkan ke API register kamu
    setTimeout(() => {
      setLoading(false);
      alert("Register berhasil (dummy)");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 px-4">
      <form
        onSubmit={handleRegister}
        className="
          w-full max-w-md
          bg-white/95 backdrop-blur
          p-8 rounded-2xl
          shadow-2xl
        "
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Register
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

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Loading..." : "Daftar"}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-700">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="
              text-blue-600 font-medium
              cursor-pointer
              hover:text-blue-800
              transition
            "
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
