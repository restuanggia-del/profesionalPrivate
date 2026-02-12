"use client";

type Props = {
  name?: string;
};

export default function UserAvatar({ name }: Props) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white shadow">
      {initials}
    </div>
  );
}
