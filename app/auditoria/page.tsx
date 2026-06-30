'use client';

import { useCallback, useEffect, useState } from 'react';
import { getProducts } from '@/services/product-service';
import { getMovimientos, getAuditLogByProduct } from '@/services/audit-service';
import { Producto, MovimientoProducto, AuditoriaLog } from '@/services/types';

function fmtDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Rango por defecto: del último mes hasta hoy
function defaultDates() {
  const hoy = new Date();
  const mesAntes = new Date();
  mesAntes.setMonth(mesAntes.getMonth() - 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { inicio: iso(mesAntes), fin: iso(hoy) };
}

export default function AuditoriaPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [selected, setSelected] = useState<Producto | null>(null);
  const [{ inicio, fin }, setDates] = useState(defaultDates());
  const [movimientos, setMovimientos] = useState<MovimientoProducto[]>([]);
  const [log, setLog] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carga inicial de productos para el selector
  useEffect(() => {
    const load = async () => {
      try {
        const prods = await getProducts();
        setProducts(prods);
        setSelected(prods[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
      }
    };
    load();
  }, []);

  const search = useCallback(async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const [movs, logs] = await Promise.all([
        getMovimientos(selected.Codigo, inicio, fin),
        getAuditLogByProduct(selected.Id_Producto, inicio, fin)
      ]);
      setMovimientos(movs);
      setLog(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la consulta');
    } finally {
      setLoading(false);
    }
  }, [selected, inicio, fin]);

  // Consulta automática al cambiar producto o fechas
  useEffect(() => {
    search();
  }, [search]);

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Auditoría y Trazabilidad
        </h1>
        <p className='text-xs text-muted-foreground mt-0.5'>
          Movimientos (recepciones y despachos) y bitácora inmutable de
          variaciones de stock por producto.
        </p>
      </div>

      {/* Filtros */}
      <div className='rounded-sm border border-border bg-card p-3 grid grid-cols-1 sm:grid-cols-3 gap-3'>
        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Producto
          </label>
          <select
            value={selected?.Id_Producto ?? ''}
            onChange={(e) =>
              setSelected(
                products.find(
                  (p) => p.Id_Producto === Number(e.target.value)
                ) ?? null
              )
            }
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          >
            {products.map((p) => (
              <option key={p.Id_Producto} value={p.Id_Producto}>
                {p.Codigo} — {p.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Fecha de Inicio
          </label>
          <input
            type='date'
            value={inicio}
            onChange={(e) =>
              setDates((d) => ({ ...d, inicio: e.target.value }))
            }
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          />
        </div>

        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Fecha de Fin
          </label>
          <input
            type='date'
            value={fin}
            onChange={(e) => setDates((d) => ({ ...d, fin: e.target.value }))}
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          />
        </div>
      </div>

      {error && (
        <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2 text-[11px] text-destructive'>
          {error}
        </div>
      )}

      {/* Reporte de movimientos: azul = recepción, naranja = despacho */}
      <div className='space-y-2'>
        <h2 className='text-sm font-semibold text-foreground'>
          Movimientos del Producto
        </h2>
        <div className='rounded-sm border border-border bg-card overflow-x-auto'>
          <table className='w-full text-xs text-left border-collapse'>
            <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
              <tr>
                <th className='p-3'>Fecha</th>
                <th className='p-3'>Tipo</th>
                <th className='p-3'>Cliente</th>
                <th className='p-3'>Cantidad</th>
                <th className='p-3 text-right'>Usuario</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {loading ? (
                <tr>
                  <td colSpan={5} className='p-4 text-center text-muted-foreground'>
                    Consultando...
                  </td>
                </tr>
              ) : movimientos.length === 0 ? (
                <tr>
                  <td colSpan={5} className='p-6 text-center text-muted-foreground'>
                    Sin movimientos en el rango seleccionado.
                  </td>
                </tr>
              ) : (
                movimientos.map((m, i) => {
                  const esRecepcion = m.TipoMovimiento === 'Recepcion';
                  return (
                    <tr
                      key={i}
                      className={
                        esRecepcion ?
                          'bg-blue-500/5 hover:bg-blue-500/10'
                        : 'bg-orange-500/5 hover:bg-orange-500/10'
                      }
                    >
                      <td className='p-3 font-mono text-muted-foreground'>
                        {fmtDate(m.FechaMovimiento)}
                      </td>
                      <td className='p-3'>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border ${
                            esRecepcion ?
                              'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                          }`}
                        >
                          {esRecepcion ? 'RECEPCIÓN' : 'DESPACHO'}
                        </span>
                      </td>
                      <td className='p-3 font-medium text-foreground'>
                        {m.Cliente}
                      </td>
                      <td className='p-3 font-mono font-bold text-foreground'>
                        {m.Cantidad} uds
                      </td>
                      <td className='p-3 text-right font-mono text-muted-foreground'>
                        {m.Usuario}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log de auditoría: verde = incremento, rojo = reducción */}
      <div className='space-y-2'>
        <h2 className='text-sm font-semibold text-foreground'>
          Bitácora de Variaciones de Stock
        </h2>
        <div className='rounded-sm border border-border bg-card overflow-x-auto'>
          <table className='w-full text-xs text-left border-collapse'>
            <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
              <tr>
                <th className='p-3'>Fecha</th>
                <th className='p-3'>Tipo</th>
                <th className='p-3'>Cantidad Anterior</th>
                <th className='p-3'>Cantidad Nueva</th>
                <th className='p-3 text-right'>Usuario</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {loading ? (
                <tr>
                  <td colSpan={5} className='p-4 text-center text-muted-foreground'>
                    Consultando...
                  </td>
                </tr>
              ) : log.length === 0 ? (
                <tr>
                  <td colSpan={5} className='p-6 text-center text-muted-foreground'>
                    Sin variaciones registradas en el rango.
                  </td>
                </tr>
              ) : (
                log.map((l) => {
                  const incremento = l.TipoCambio === 'Incremento';
                  return (
                    <tr
                      key={l.Id_Auditoria}
                      className={
                        incremento ?
                          'bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'bg-destructive/5 hover:bg-destructive/10'
                      }
                    >
                      <td className='p-3 font-mono text-muted-foreground'>
                        {fmtDate(l.Fecha)}
                      </td>
                      <td className='p-3'>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border ${
                            incremento ?
                              'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                          }`}
                        >
                          {incremento ? 'INCREMENTO' : 'REDUCCIÓN'}
                        </span>
                      </td>
                      <td className='p-3 font-mono text-muted-foreground'>
                        {l.Cantidad_Anterior} uds
                      </td>
                      <td className='p-3 font-mono font-bold text-foreground'>
                        {l.Nueva_Cantidad} uds
                      </td>
                      <td className='p-3 text-right font-mono text-muted-foreground'>
                        {l.Usuario}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
