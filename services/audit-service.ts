import { apiFetch } from './api-config';
import { MovimientoProducto, AuditoriaLog } from './types';

/**
 * Reporte cronológico de movimientos de un producto (recepciones + despachos)
 * vía sp_ReporteMovimientosProducto. Se busca por código de producto.
 */
export async function getMovimientos(
  codigo: string,
  fechaInicio?: string,
  fechaFin?: string
): Promise<MovimientoProducto[]> {
  const params = new URLSearchParams();
  if (fechaInicio) params.set('fechaInicio', fechaInicio);
  if (fechaFin) params.set('fechaFin', fechaFin);
  const qs = params.toString();
  return apiFetch<MovimientoProducto[]>(
    `/api/auditoria/movimientos/${encodeURIComponent(codigo)}${
      qs ? `?${qs}` : ''
    }`
  );
}

/**
 * Log de la tabla AUDITORIA_PRODUCTOS para un producto, con la columna
 * TipoCambio (Incremento / Reduccion) calculada en la consulta.
 */
export async function getAuditLogByProduct(
  idProducto: number,
  fechaInicio?: string,
  fechaFin?: string
): Promise<AuditoriaLog[]> {
  const params = new URLSearchParams();
  if (fechaInicio) params.set('fechaInicio', fechaInicio);
  if (fechaFin) params.set('fechaFin', fechaFin);
  const qs = params.toString();
  return apiFetch<AuditoriaLog[]>(
    `/api/auditoria/log/${idProducto}${qs ? `?${qs}` : ''}`
  );
}
