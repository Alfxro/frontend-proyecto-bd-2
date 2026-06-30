import { apiFetch } from './api-config';
import { RecepcionExtendida } from './types';

export async function getReceipts(
  fechaInicio?: string,
  fechaFin?: string
): Promise<RecepcionExtendida[]> {
  const params = new URLSearchParams();
  if (fechaInicio) params.set('fechaInicio', fechaInicio);
  if (fechaFin) params.set('fechaFin', fechaFin);
  const qs = params.toString();
  return apiFetch<RecepcionExtendida[]>(
    `/api/recepciones${qs ? `?${qs}` : ''}`
  );
}

/**
 * Registra una recepción invocando sp_RegistrarRecepcion (transacción ACID
 * que incrementa el stock y deja el asiento de ingreso).
 */
export async function createReceipt(payload: {
  Id_Producto: number;
  Cantidad_Entrante: number;
  Id_Cliente: number;
  Numero_Lote: string;
}): Promise<void> {
  await apiFetch('/api/recepciones', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
