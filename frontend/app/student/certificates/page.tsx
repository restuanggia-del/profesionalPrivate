"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";
import {
  Award,
  Download,
  BookOpen,
  Calendar,
  ArrowLeft,
  FileText,
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

type Certificate = {
  ID: number;
  UserID: number;
  CourseID: number;
  FilePath: string;
  CreatedAt: string;
  course_title?: string;
};

type Course = { id: number; title: string };

export default function CertificatesPage() {
  const router = useRouter();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [certsRes, coursesRes] = await Promise.all([
          fetch(`${API}/api/student/certificates`, { headers: authHeaders() }),
          fetch(`${API}/api/student/courses`, { headers: authHeaders() }),
        ]);

        if (certsRes.ok) {
          const d = await certsRes.json();
          if (d.success) setCerts(d.data || []);
        }

        if (coursesRes.ok) {
          const d = await coursesRes.json();
          if (d.success) {
            const map: Record<number, string> = {};
            (d.data || []).forEach((c: Course) => {
              map[c.id] = c.title;
            });
            setCourses(map);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDownload = async (certId: number) => {
    setDownloading(certId);
    try {
      const res = await fetch(
        `${API}/api/student/certificates/${certId}/download`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );

      if (!res.ok) {
        alert("Gagal mengunduh sertifikat");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sertifikat-${certId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Gagal mengunduh sertifikat");
    } finally {
      setDownloading(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat sertifikat...</p>
        </div>
      </div>
    );

  return (
    <AuthGuard allow={["student"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/student")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Sertifikat Saya 🏆
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Sertifikat diterbitkan otomatis setelah nilai quiz ≥ 70
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">
                  Total Sertifikat
                </p>
                <p className="text-4xl font-bold mt-1">{certs.length}</p>
                <p className="text-amber-200 text-sm mt-1">
                  {certs.length === 0
                    ? "Selesaikan quiz dengan nilai ≥ 70 untuk mendapat sertifikat"
                    : `Kamu sudah menyelesaikan ${certs.length} kelas dengan baik!`}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award size={32} className="text-white" />
              </div>
            </div>
          </div>

          {/* List sertifikat */}
          {certs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <FileText size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">
                Belum ada sertifikat
              </p>
              <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                Kerjakan quiz di kelas yang kamu ikuti dan raih nilai ≥ 70 untuk
                mendapatkan sertifikat.
              </p>
              <button
                onClick={() => router.push("/student")}
                className="mt-6 bg-amber-500 text-white px-6 py-2.5 rounded-xl hover:bg-amber-600 transition text-sm font-medium"
              >
                Mulai Belajar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certs.map((cert) => (
                <div
                  key={cert.ID}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  {/* Header kartu */}
                  <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                        <Award size={20} className="text-white" />
                      </div>
                      <span className="text-xs text-white/80 font-medium bg-white/20 px-2.5 py-1 rounded-full">
                        Lulus
                      </span>
                    </div>
                    <h3 className="font-bold text-white mt-3 text-lg leading-tight">
                      {courses[cert.CourseID] || `Kelas #${cert.CourseID}`}
                    </h3>
                  </div>

                  {/* Body kartu */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <BookOpen size={14} />
                      <span>ID Kelas: {cert.CourseID}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>
                        {new Date(cert.CreatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownload(cert.ID)}
                      disabled={downloading === cert.ID}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl transition font-medium text-sm disabled:opacity-50 mt-2"
                    >
                      {downloading === cert.ID ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <Download size={15} />
                          Unduh Sertifikat PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
