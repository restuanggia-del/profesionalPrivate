"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  BookOpen,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}
function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
}

type Question = {
  id: number;
  quiz_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

type Quiz = {
  id: number;
  title: string;
  course_id: number;
  questions: Question[];
};

function AddQuestionModal({
  quizId,
  onClose,
  onCreated,
}: {
  quizId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answer, setAnswer] = useState<"A" | "B" | "C" | "D" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const options = [
    { key: "A" as const, value: optionA, set: setOptionA, label: "Pilihan A" },
    { key: "B" as const, value: optionB, set: setOptionB, label: "Pilihan B" },
    { key: "C" as const, value: optionC, set: setOptionC, label: "Pilihan C" },
    { key: "D" as const, value: optionD, set: setOptionD, label: "Pilihan D" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) {
      setError("Pilih jawaban yang benar");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/teacher/questions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          quiz_id: quizId,
          question,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          answer,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Gagal menambah soal");
        return;
      }
      onCreated();
      onClose();
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl my-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah Soal</h2>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pertanyaan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pertanyaan
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tulis pertanyaan di sini..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required
            />
          </div>

          {/* Pilihan jawaban */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilihan Jawaban{" "}
              <span className="text-gray-400 font-normal">
                (klik untuk tandai jawaban benar)
              </span>
            </label>
            <div className="space-y-2">
              {options.map((opt) => (
                <div key={opt.key} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAnswer(opt.key)}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                      answer === opt.key
                        ? "bg-green-500 text-white shadow-md scale-110"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {opt.key}
                  </button>
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) => opt.set(e.target.value)}
                    placeholder={opt.label}
                    className={`flex-1 border rounded-xl px-4 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 transition ${
                      answer === opt.key
                        ? "border-green-400 focus:ring-green-400 bg-green-50"
                        : "border-gray-200 focus:ring-purple-400"
                    }`}
                    required
                  />
                  {answer === opt.key && (
                    <CheckCircle2
                      size={18}
                      className="text-green-500 shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
            {answer && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Jawaban benar: Pilihan {answer}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Tambah Soal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Soal?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Soal yang dihapus tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${API}/api/teacher/quizzes/${quizId}`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setQuiz(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleDeleteQuestion = async (questionId: number) => {
    await fetch(`${API}/api/teacher/questions/${questionId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setDeletingId(null);
    fetchQuiz();
  };

  const optionLabel = (q: Question, key: string) => {
    const map: Record<string, string> = {
      A: q.option_a,
      B: q.option_b,
      C: q.option_c,
      D: q.option_d,
    };
    const raw = map[key] || "";
    // Strip prefix jika huruf pertama sama dengan key (A/B/C/D)
    if (raw.length > 1 && raw[0].toUpperCase() === key) {
      return raw.slice(1);
    }
    return raw;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard allow={["teacher"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Kembali</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClipboardList size={14} className="text-purple-600" />
            </div>
            <span className="font-semibold text-gray-800">
              {quiz?.title || "Detail Quiz"}
            </span>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* Header quiz */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-purple-200 text-sm mb-1 font-medium">Quiz</p>
                <h1 className="text-2xl font-bold truncate">
                  {quiz?.title || "Memuat..."}
                </h1>
              </div>
              <div className="bg-white/20 px-4 py-3 rounded-xl text-center shrink-0">
                <p className="text-2xl font-bold leading-none">
                  {quiz?.questions?.length || 0}
                </p>
                <p className="text-xs text-purple-200 mt-1">Soal</p>
              </div>
            </div>
          </div>

          {/* Daftar soal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">
                Daftar Soal ({quiz?.questions?.length || 0})
              </h2>
              <button
                onClick={() => setShowAddQuestion(true)}
                className="flex items-center gap-1.5 bg-purple-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-purple-700 transition"
              >
                <Plus size={15} />
                Tambah Soal
              </button>
            </div>

            {!quiz?.questions?.length ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Belum ada soal</p>
                <p className="text-gray-400 text-sm mt-1">
                  Klik &quot;Tambah Soal&quot; untuk mulai membuat soal
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm group"
                  >
                    {/* Header soal */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                      <button
                        onClick={() => setDeletingId(q.id)}
                        className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Pilihan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(["A", "B", "C", "D"] as const).map((key) => {
                        const text = optionLabel(q, key);
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50"
                          >
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                              {key}
                            </span>
                            <span className="text-sm text-gray-700 flex-1">
                              {text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Jawaban benar — ditampilkan sebagai hint kecil */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-xs text-green-600">
                        Jawaban benar tersimpan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showAddQuestion && (
          <AddQuestionModal
            quizId={quizId}
            onClose={() => setShowAddQuestion(false)}
            onCreated={fetchQuiz}
          />
        )}
        {deletingId !== null && (
          <ConfirmDeleteModal
            onClose={() => setDeletingId(null)}
            onConfirm={() => handleDeleteQuestion(deletingId)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
