const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

interface FetchOptions extends RequestInit {
    auth?: boolean;
}

export async function apiFetch(
    endpoint: string,
    options: FetchOptions = {}
): Promise<Response> {
    const { auth = false, ...rest } = options;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(rest.headers as Record<string, string>),
    };

    if (auth) {
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers,
    });
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
}

export function getRole(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("role");
}

export function isLoggedIn(): boolean {
    return !!getToken();
}
