import { apiFetch } from './api-config';
import { Cliente, ClienteRol } from './types';

export async function getClients(): Promise<Cliente[]> {
  return apiFetch<Cliente[]>('/api/clientes');
}

export async function getClientById(id: number): Promise<Cliente> {
  return apiFetch<Cliente>(`/api/clientes/${id}`);
}

export async function createClient(payload: {
  Nombre: string;
  Rol: ClienteRol;
}): Promise<void> {
  await apiFetch('/api/clientes', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateClient(
  id: number,
  payload: { Nombre?: string; Rol?: ClienteRol }
): Promise<void> {
  await apiFetch(`/api/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deleteClient(id: number): Promise<void> {
  await apiFetch(`/api/clientes/${id}`, { method: 'DELETE' });
}
