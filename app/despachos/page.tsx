'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Shipment {
  id: number;
  date: string;
  status: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO';
  clientName: string;
}

export default function DespachosPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de GET /despachos
    const fetchShipments = async () => {
      const mockData: Shipment[] = [
        {
          id: 201,
          date: '2026-06-14 14:20',
          status: 'PROCESADO',
          clientName: 'Logística Central S.A.'
        },
        {
          id: 202,
          date: '2026-06-15 09:00',
          status: 'PENDIENTE',
          clientName: 'Supermercados Unidos'
        }
      ];
      setShipments(mockData);
      setLoading(false);
    };
    fetchShipments();
  }, []);

  if (loading)
    return (
      <div className='text-xs text-muted-foreground p-4'>
        Cargando despachos...
      </div>
    );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Órdenes de Despacho
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Historial y estado de control de salidas del
            almacén.
          </p>
        </div>
        <button
          onClick={() => router.push('/despachos/nuevo')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Iniciar Despacho
        </button>
      </div>

      <div className='rounded-sm border border-border bg-card overflow-x-auto'>
        <table className='w-full text-xs text-left border-collapse'>
          <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
            <tr>
              <th className='p-3 w-20'>Manifiesto</th>
              <th className='p-3'>Fecha de Creación</th>
              <th className='p-3'>Cliente Destino</th>
              <th className='p-3'>Estado</th>
              <th className='p-3 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {shipments.map((ship) => (
              <tr
                key={ship.id}
                className='hover:bg-muted/40 transition-colors'
              >
                <td className='p-3 font-mono font-semibold text-muted-foreground'>
                  #{ship.id}
                </td>
                <td className='p-3 text-muted-foreground'>
                  {ship.date}
                </td>
                <td className='p-3 font-medium text-foreground'>
                  {ship.clientName}
                </td>
                <td className='p-3'>
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded-sm ${
                      ship.status === 'PROCESADO' ?
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : ship.status === 'PENDIENTE' ?
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}
                  >
                    {ship.status}
                  </span>
                </td>
                <td className='p-3 text-right'>
                  <button
                    onClick={() =>
                      router.push(`/despachos/${ship.id}`)
                    }
                    className='text-primary hover:underline font-medium cursor-pointer'
                  >
                    {ship.status === 'PENDIENTE' ?
                      'Gestionar e Inyectar'
                    : 'Ver Detalles'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
