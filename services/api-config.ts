// ============================================================
// Configuración central de acceso al backend SGID LogiChain.
// Todas las llamadas pasan por `apiFetch`, que adjunta el operario
// autenticado (header X-Usuario) y normaliza el sobre de respuesta
// { success, data, message, error } que devuelve el backend.
// ============================================================

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const SESSION_KEY = 'sgid_session';

export interface Session {
  usuario: string;
  dbUser?: string;
}

// ── Manejo de sesión (operario logueado) ────────────────────

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getUsuario(): string {
  return getSession()?.usuario ?? 'sistema';
}

// ── Sobre de respuesta del backend ──────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Realiza una petición al backend y devuelve `data` ya desempaquetado.
 * Lanza un Error con el mensaje del backend cuando `success` es false
 * (incluye los mensajes de regla de negocio de los procedimientos).
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Usuario': getUsuario(),
    ...((options.headers as Record<string, string>) ?? {})
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.'
    );
  }

  let body: ApiResponse<T> | null = null;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    body = null;
  }

  if (!res.ok || !body || body.success === false) {
    const message =
      body?.error || body?.message || `Error ${res.status} en ${path}`;
    throw new Error(message);
  }

  return body.data as T;
}
