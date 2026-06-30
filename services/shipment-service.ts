import { apiFetch } from './api-config';
import { DespachoConDetalle, CarroItem } from './types';

// ── Despachos ───────────────────────────────────────────────

/** Despachos de la última semana (default) o de un rango de fechas. */
export async function getShipments(
  fechaInicio?: string,
  fechaFin?: string
): Promise<DespachoConDetalle[]> {
  const params = new URLSearchParams();
  if (fechaInicio) params.set('fechaInicio', fechaInicio);
  if (fechaFin) params.set('fechaFin', fechaFin);
  const qs = params.toString();
  return apiFetch<DespachoConDetalle[]>(
    `/api/despachos${qs ? `?${qs}` : ''}`
  );
}

export async function getShipmentById(
  id: number
): Promise<DespachoConDetalle> {
  return apiFetch<DespachoConDetalle>(`/api/despachos/${id}`);
}

/** Crea un despacho en estado 'pendiente' para un cliente destino/ambos. */
export async function createShipment(
  Id_Cliente: number
): Promise<{ Id_Despacho: number }> {
  return apiFetch<{ Id_Despacho: number }>('/api/despachos', {
    method: 'POST',
    body: JSON.stringify({ Id_Cliente })
  });
}

/** Procesa el despacho (CALL sp_ProcesarDespacho): commit o rollback ACID. */
export async function processShipment(
  id: number,
  Id_Cliente: number
): Promise<void> {
  await apiFetch(`/api/despachos/${id}/procesar`, {
    method: 'POST',
    body: JSON.stringify({ Id_Cliente })
  });
}

// ── Carro de compras (tabla intermedia) ─────────────────────

export async function getCart(): Promise<CarroItem[]> {
  return apiFetch<CarroItem[]>('/api/despachos/carro/items');
}

export async function addToCart(
  Id_Producto: number,
  Cantidad: number
): Promise<void> {
  await apiFetch('/api/despachos/carro/items', {
    method: 'POST',
    body: JSON.stringify({ Id_Producto, Cantidad })
  });
}

export async function removeFromCart(idProducto: number): Promise<void> {
  await apiFetch(`/api/despachos/carro/items/${idProducto}`, {
    method: 'DELETE'
  });
}

export async function clearCart(): Promise<void> {
  await apiFetch('/api/despachos/carro/items', { method: 'DELETE' });
}
