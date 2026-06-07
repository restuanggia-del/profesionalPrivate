"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  Clock,
  AlertCircle,
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
type Result = { score: number; total: number; passed: boolean };

// Strip prefix huruf jika nempel
function cleanOption(text: string, key: string) {
  if (text.length > 1 && text[0].toUpperCase() === key) return text.slice(1);
  return text;
}

// ── Halaman Hasil ─────────────────────────────────────────────────────────────
function ResultScreen({
  result,
  quiz,
  onRetry,
  onBack,
}: {
  result: Result;
  quiz: Quiz;
  onRetry: () => void;
  onBack: () => void;
}) {
  const pct =
    quiz.questions.length > 0
      ? Math.round((result.score / (quiz.questions.length * 10)) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
        {/* Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.passed ? "bg-green-100" : "bg-red-100"}`}
        >
          {result.passed ? (
            <Award size={36} className="text-green-500" />
          ) : (
            <XCircle size={36} className="text-red-400" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {result.passed ? "Selamat! 🎉" : "Coba Lagi 💪"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {result.passed
            ? "Kamu lulus quiz ini! Sertifikat otomatis diterbitkan jika ini quiz terakhir."
            : "Nilai kamu belum mencapai batas lulus (70). Semangat!"}
        </p>

        {/* Skor */}
        <div
          className={`rounded-2xl p-6 mb-6 ${result.passed ? "bg-green-50" : "bg-red-50"}`}
        >
          <p
            className="text-5xl font-bold mb-1"
            style={{ color: result.passed ? "#16a34a" : "#dc2626" }}
          >
            {result.score}
          </p>
          <p className="text-sm text-gray-500">
            dari {quiz.questions.length * 10} poin
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${result.passed ? "bg-green-500" : "bg-red-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span
              className={`font-medium ${result.passed ? "text-green-600" : "text-red-500"}`}
            >
              {pct}% {result.passed ? "✓ Lulus" : "✗ Belum Lulus"}
            </span>
            <span>100</span>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-lg font-bold text-gray-800">
              {quiz.questions.length}
            </p>
            <p className="text-xs text-gray-400">Total Soal</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-lg font-bold text-gray-800">
              {result.score / 10}
            </p>
            <p className="text-xs text-gray-400">Benar</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-lg font-bold text-gray-800">
              {quiz.questions.length - result.score / 10}
            </p>
            <p className="text-xs text-gray-400">Salah</p>
          </div>
        </div>

        <div className="space-y-3">
          {!result.passed && (
            <button
              onClick={onRetry}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-medium"
            >
              Coba Lagi
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Kembali ke Kelas
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentQuizPage() {
  const { id: quizId } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/student/quiz?quiz_id=${quizId}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) setQuiz(data.data);
        else setError("Quiz tidak ditemukan");
      } catch {
        setError("Tidak dapat memuat quiz");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quizId]);

  const handleAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Masih ada ${unanswered.length} soal yang belum dijawab`);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/student/quiz/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ quiz_id: Number(quizId), answers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          score: data.data.score,
          total: quiz.questions.length * 10,
          passed: data.data.score >= 70,
        });
      } else {
        setError(data.message || "Gagal submit quiz");
      }
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrent(0);
    setResult(null);
    setError("");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat quiz...</p>
        </div>
      </div>
    );

  if (error && !quiz)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    );

  if (result && quiz)
    return (
      <ResultScreen
        result={result}
        quiz={quiz}
        onRetry={handleRetry}
        onBack={() => router.back()}
      />
    );

  if (!quiz) return null;

  const q = quiz.questions[current];
  const totalQ = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const options = [
    { key: "A", text: cleanOption(q.option_a, "A") },
    { key: "B", text: cleanOption(q.option_b, "B") },
    { key: "C", text: cleanOption(q.option_c, "C") },
    { key: "D", text: cleanOption(q.option_d, "D") },
  ];

  return (
    <AuthGuard allow={["student"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Keluar Quiz</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClipboardList size={14} className="text-purple-600" />
            </div>
            <span className="font-semibold text-gray-800">{quiz.title}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>
              {answeredCount}/{totalQ} dijawab
            </span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Progress soal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Soal {current + 1} dari {totalQ}
              </span>
              <span>{Math.round(((current + 1) / totalQ) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / totalQ) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigasi soal (dots) */}
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  idx === current
                    ? "bg-purple-600 text-white shadow"
                    : answers[quiz.questions[idx].id]
                      ? "bg-purple-100 text-purple-600"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-purple-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Kartu soal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-3 mb-6">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                {current + 1}
              </span>
              <p className="text-gray-800 font-medium leading-relaxed text-lg">
                {q.question}
              </p>
            </div>

            <div className="space-y-3">
              {options.map((opt) => {
                const selected = answers[q.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswer(q.id, opt.key)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${
                      selected
                        ? "border-purple-500 bg-purple-50 shadow-sm"
                        : "border-gray-100 bg-gray-50 hover:border-purple-200 hover:bg-purple-50/50"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition ${
                        selected
                          ? "bg-purple-500 text-white"
                          : "bg-white border-2 border-gray-200 text-gray-500"
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span
                      className={`font-medium ${selected ? "text-purple-700" : "text-gray-700"}`}
                    >
                      {opt.text}
                    </span>
                    {selected && (
                      <CheckCircle2
                        size={18}
                        className="text-purple-500 ml-auto shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Navigasi prev/next + submit */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrent((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition disabled:opacity-40"
            >
              ← Sebelumnya
            </button>

            {current < totalQ - 1 ? (
              <button
                onClick={() => setCurrent((p) => p + 1)}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Submit Quiz
                  </>
                )}
              </button>
            )}
          </div>

          {/* Summary jawaban */}
          <p className="text-center text-sm text-gray-400">
            {answeredCount < totalQ
              ? `${totalQ - answeredCount} soal belum dijawab`
              : "Semua soal sudah dijawab — siap submit!"}
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
