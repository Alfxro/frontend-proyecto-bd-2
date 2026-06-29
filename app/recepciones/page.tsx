'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Receipt {
  id: number;
  date: string;
  productName: string;
  batch: string;
  quantity: number;
  user: string;
}

export default function RecepcionesPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /recepciones
    const fetchReceipts = async () => {
      const mockReceipts: Receipt[] = [
        {
          id: 101,
          date: '2026-06-15 08:30',
          productName: 'Tornillos de Anclaje 3/8',
          batch: 'L-TOR-991',
          quantity: 50,
          user: 'j.vargas'
        },
        {
          id: 102,
          date: '2026-06-15 09:12',
          productName: 'Cable UTP Categoría 6',
          batch: 'L-CAB-442',
          quantity: 15,
          user: 'm.gomez'
        }
      ];
      setReceipts(mockReceipts);
      setLoading(false);
    };
    fetchReceipts();
  }, []);

  if (loading)
    return (
      <div className='text-xs text-muted-foreground p-4'>
        Cargando recepciones...
      </div>
    );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Recepciones
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Historial cronológico de entrada de mercancía al
            almacén general.
          </p>
        </div>
        <button
          onClick={() => router.push('/recepciones/nueva')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Registrar Recepción
        </button>
      </div>

      <div className='rounded-sm border border-border bg-card overflow-x-auto'>
        <table className='w-full text-xs text-left border-collapse'>
          <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
            <tr>
              <th className='p-3'>Fecha y Hora</th>
              <th className='p-3'>Producto</th>
              <th className='p-3'>Lote asignado</th>
              <th className='p-3'>Cantidad</th>
              <th className='p-3 text-right'>Usuario</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {receipts.map((rec) => (
              <tr
                key={rec.id}
                className='hover:bg-muted/40 transition-colors'
              >
                <td className='p-3 font-mono text-muted-foreground'>
                  {rec.date}
                </td>
                <td className='p-3 font-medium text-foreground'>
                  {rec.productName}
                </td>
                <td className='p-3 font-mono text-primary font-semibold'>
                  {rec.batch}
                </td>
                <td className='p-3 font-mono font-bold text-foreground'>
                  {rec.quantity} uds
                </td>
                <td className='p-3 text-right text-muted-foreground font-mono'>
                  {rec.user}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
