import { apiFetch, setSession, clearSession } from './api-config';

interface LoginResponse {
  usuario: string;
  dbUser: string;
  mensaje: string;
}

/**
 * Valida usuario/contraseña contra MySQL (POST /api/auth/login).
 * El backend abre una conexión real con esas credenciales; si MySQL las
 * acepta, el login es válido. Guarda la sesión del operario localmente.
 */
export async function login(
  usuario: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, password })
  });
  setSession({ usuario: data.usuario, dbUser: data.dbUser });
  return data;
}

export function logout(): void {
  clearSession();
}
