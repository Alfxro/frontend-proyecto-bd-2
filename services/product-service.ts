import { apiFetch } from './api-config';
import { Producto, ProductoMonitoreo, RecepcionExtendida } from './types';

/** Lista básica de productos. */
export async function getProducts(): Promise<Producto[]> {
  return apiFetch<Producto[]>('/api/productos');
}

/** Productos con stock > 0 (para armar despachos). */
export async function getAvailableProducts(): Promise<Producto[]> {
  return apiFetch<Producto[]>('/api/productos/disponibles');
}

/**
 * Monitoreo de inventario en tiempo real (sp_MonitoreoInventarioTiempoReal):
 * incluye último ingreso, último despacho y el estado de alerta (OK/REORDEN).
 */
export async function getInventoryMonitoring(): Promise<ProductoMonitoreo[]> {
  return apiFetch<ProductoMonitoreo[]>('/api/inventario/monitoreo');
}

export async function getProductById(id: number): Promise<Producto> {
  return apiFetch<Producto>(`/api/productos/${id}`);
}

export async function getProductReceptions(
  id: number
): Promise<RecepcionExtendida[]> {
  return apiFetch<RecepcionExtendida[]>(`/api/productos/${id}/recepciones`);
}

export async function createProduct(payload: {
  Codigo: string;
  Nombre: string;
  Detalle?: string;
  Stock_Critico: number;
  Bodega: string;
  Pasillo: string;
  Estante: string;
}): Promise<void> {
  await apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateProduct(
  id: number,
  payload: {
    Nombre?: string;
    Stock_Critico?: number;
    Bodega?: string;
    Pasillo?: string;
    Estante?: string;
  }
): Promise<void> {
  await apiFetch(`/api/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch(`/api/productos/${id}`, { method: 'DELETE' });
}
