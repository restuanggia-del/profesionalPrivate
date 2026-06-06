export function hasPermission(permission: string): boolean {
  if (typeof window === "undefined") return false;

  const permissions = localStorage.getItem("permissions");
  if (!permissions) return false;

  try {
    const parsed = JSON.parse(permissions) as string[];
    return parsed.includes(permission);
  } catch {
    return false;
  }
}

export const MENU_BY_PERMISSION = [
  {
    label: "Dashboard",
    href: "/student",
    permission: "student.dashboard",
  },
  {
    label: "My Course",
    href: "/student/course",
    permission: "student.course",
  },
  {
    label: "Teacher Panel",
    href: "/teacher",
    permission: "teacher.dashboard",
  },
  {
    label: "Admin Panel",
    href: "/admin",
    permission: "admin.dashboard",
  },
];
