import Link from "next/link";

type Props = {
  id: number;
  title: string;
  progress: number;
};

export default function CourseCard({ id, title, progress }: Props) {
  return (
    <div className="bg-white text-black p-6 rounded-2xl shadow">
      {" "}
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="mt-3 bg-gray-200 h-2 rounded">
        <div
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm">{progress}% complete</p>
      <Link
        href={`/student/course/${id}`}
        className="inline-block mt-4 text-blue-600 font-semibold"
      >
        View Detail →
      </Link>
    </div>
  );
}
