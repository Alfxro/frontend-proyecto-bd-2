import { MOCK_CLIENTS, Client } from '@/lib/mock-data';

export async function getClients(): Promise<Client[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_CLIENTS]), 200)
  );
}

export async function createClient(
  client: Omit<Client, 'id'>
): Promise<boolean> {
  console.log('Mock POST /clientes:', client);
  return true;
}

export async function updateClient(
  id: number,
  client: Partial<Client>
): Promise<boolean> {
  console.log(`Mock PUT /clientes/${id}:`, client);
  return true;
}

export async function deleteClient(
  id: number
): Promise<boolean> {
  console.log(`Mock DELETE /clientes/${id}`);
  return true;
}
