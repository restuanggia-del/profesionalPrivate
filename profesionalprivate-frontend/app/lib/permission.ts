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
