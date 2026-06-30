'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getShipments } from '@/services/shipment-service';
import { DespachoConDetalle, DespachoEstado } from '@/services/types';

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

const STATUS_STYLE: Record<DespachoEstado, string> = {
  procesado:
    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  pendiente: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  cancelado:
    'bg-destructive/10 text-destructive border border-destructive/20'
};

export default function DespachosPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<DespachoConDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setShipments(
        await getShipments(fechaInicio || undefined, fechaFin || undefined)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar despachos');
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Órdenes de Despacho
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Salidas de la última semana. Filtre por rango de fechas si lo
            necesita.
          </p>
        </div>
        <button
          onClick={() => router.push('/despachos/nuevo')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Iniciar Despacho
        </button>
      </div>

      {/* Filtro por rango de fechas */}
      <div className='rounded-sm border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-end gap-3'>
        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Fecha de Inicio
          </label>
          <input
            type='date'
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className='h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          />
        </div>
        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Fecha de Fin
          </label>
          <input
            type='date'
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className='h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          />
        </div>
        {(fechaInicio || fechaFin) && (
          <button
            onClick={() => {
              setFechaInicio('');
              setFechaFin('');
            }}
            className='h-8 px-3 text-xs border border-input bg-background text-foreground rounded-sm hover:bg-muted transition-colors cursor-pointer'
          >
            Limpiar (última semana)
          </button>
        )}
      </div>

      {error && (
        <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2 text-[11px] text-destructive'>
          {error}
        </div>
      )}

      <div className='rounded-sm border border-border bg-card overflow-x-auto'>
        <table className='w-full text-xs text-left border-collapse'>
          <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
            <tr>
              <th className='p-3 w-20'>Manifiesto</th>
              <th className='p-3'>Fecha</th>
              <th className='p-3'>Cliente Destino</th>
              <th className='p-3'>Operario</th>
              <th className='p-3'>Estado</th>
              <th className='p-3 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {loading ? (
              <tr>
                <td colSpan={6} className='p-4 text-center text-muted-foreground'>
                  Cargando despachos...
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-muted-foreground'>
                  No hay despachos en el periodo seleccionado.
                </td>
              </tr>
            ) : (
              shipments.map((ship) => (
                <tr
                  key={ship.Id_Despacho}
                  className='hover:bg-muted/40 transition-colors'
                >
                  <td className='p-3 font-mono font-semibold text-muted-foreground'>
                    #{ship.Id_Despacho}
                  </td>
                  <td className='p-3 text-muted-foreground font-mono'>
                    {fmtDate(ship.Fecha)}
                  </td>
                  <td className='p-3 font-medium text-foreground'>
                    {ship.NombreCliente}
                  </td>
                  <td className='p-3 text-muted-foreground font-mono'>
                    {ship.Operario}
                  </td>
                  <td className='p-3'>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded-sm uppercase ${STATUS_STYLE[ship.Estado]}`}
                    >
                      {ship.Estado}
                    </span>
                  </td>
                  <td className='p-3 text-right'>
                    <button
                      onClick={() =>
                        router.push(`/despachos/${ship.Id_Despacho}`)
                      }
                      className='text-primary hover:underline font-medium cursor-pointer'
                    >
                      {ship.Estado === 'pendiente' ?
                        'Gestionar'
                      : 'Ver Detalle'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
