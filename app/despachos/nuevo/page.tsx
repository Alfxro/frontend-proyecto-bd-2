'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/mock-data';

export default function NuevoDespachoPage() {
  const router = useRouter();
  const destinations = db
    .getClients()
    .filter((c) => c.rol === 'DESTINO');
  const [selectedClient, setSelectedClient] = useState(
    destinations[0]?.id || ''
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient)
      return alert(
        'Debe seleccionar un destino comercial.'
      );

    // Crea el documento maestro en memoria
    const newManifest = db.createShipment(
      Number(selectedClient)
    );
    // Redirige inmediatamente a la gestión de sus partidas físicas
    router.push(`/despachos/${newManifest.id}`);
  };

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <div className='border-b border-border pb-2'>
        <h1 className='text-xl font-bold tracking-tight text-foreground'>
          Apertura de Manifiesto
        </h1>
        <p className='text-xs text-muted-foreground'>
          Inicia una nueva orden de salida logística.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className='rounded-sm border border-border bg-card p-4 space-y-4'
      >
        <div className='space-y-1'>
          <label className='text-xs font-medium text-foreground'>
            Asignar Destino Comercial
          </label>
          <select
            value={selectedClient}
            onChange={(e) =>
              setSelectedClient(e.target.value)
            }
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs focus:outline-none cursor-pointer'
          >
            <option value='' disabled>
              -- Seleccione Sucursal / Cliente --
            </option>
            {destinations.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className='flex justify-end space-x-2 pt-2 border-t border-border'>
          <button
            type='button'
            onClick={() => router.push('/despachos')}
            className='h-8 px-3 border border-input bg-background text-xs text-foreground rounded-sm hover:bg-muted'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium hover:opacity-90'
          >
            Crear Orden Estructural
          </button>
        </div>
      </form>
    </div>
  );
}
