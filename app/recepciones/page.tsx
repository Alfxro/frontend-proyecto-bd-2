'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getReceipts } from '@/services/receipt-service';
import { RecepcionExtendida } from '@/services/types';

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

export default function RecepcionesPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<RecepcionExtendida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setReceipts(await getReceipts());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al cargar recepciones'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Recepciones
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Historial cronológico de entrada de mercancía al almacén general.
          </p>
        </div>
        <button
          onClick={() => router.push('/recepciones/nueva')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Registrar Recepción
        </button>
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
              <th className='p-3'>Fecha y Hora</th>
              <th className='p-3'>Producto</th>
              <th className='p-3'>Cliente</th>
              <th className='p-3'>Lote asignado</th>
              <th className='p-3'>Cantidad</th>
              <th className='p-3 text-right'>Usuario</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {loading ? (
              <tr>
                <td colSpan={6} className='p-4 text-center text-muted-foreground'>
                  Cargando recepciones...
                </td>
              </tr>
            ) : receipts.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-muted-foreground'>
                  No hay recepciones registradas.
                </td>
              </tr>
            ) : (
              receipts.map((rec) => (
                <tr
                  key={rec.Id_Recepcion}
                  className='hover:bg-muted/40 transition-colors'
                >
                  <td className='p-3 font-mono text-muted-foreground'>
                    {fmtDate(rec.Fecha)}
                  </td>
                  <td className='p-3 font-medium text-foreground'>
                    {rec.NombreProducto}
                  </td>
                  <td className='p-3 text-muted-foreground'>
                    {rec.NombreCliente}
                  </td>
                  <td className='p-3 font-mono text-primary font-semibold'>
                    {rec.Numero_Lote}
                  </td>
                  <td className='p-3 font-mono font-bold text-foreground'>
                    {rec.Cantidad} uds
                  </td>
                  <td className='p-3 text-right text-muted-foreground font-mono'>
                    {rec.Usuario}
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
