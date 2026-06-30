'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClients } from '@/services/client-service';
import { createShipment } from '@/services/shipment-service';
import { Cliente } from '@/services/types';

export default function NuevoDespachoPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const clients = await getClients();
        // Solo clientes que pueden recibir despachos: destino o ambos
        const dest = clients.filter(
          (c) => c.Rol === 'destino' || c.Rol === 'ambos'
        );
        setDestinations(dest);
        setSelectedClient(dest[0]?.Id_Cliente ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar clientes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      setError('Debe seleccionar un destino comercial.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const { Id_Despacho } = await createShipment(selectedClient);
      router.push(`/despachos/${Id_Despacho}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el despacho');
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className='text-xs font-mono text-muted-foreground p-4'>
        Cargando clientes...
      </p>
    );

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <div className='border-b border-border pb-2'>
        <h1 className='text-xl font-bold tracking-tight text-foreground'>
          Apertura de Manifiesto
        </h1>
        <p className='text-xs text-muted-foreground'>
          Inicia una nueva orden de salida logística (estado pendiente).
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
            onChange={(e) => setSelectedClient(Number(e.target.value))}
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs focus:outline-none cursor-pointer'
          >
            {destinations.length === 0 ? (
              <option value={0} disabled>
                No hay clientes destino disponibles
              </option>
            ) : (
              destinations.map((c) => (
                <option key={c.Id_Cliente} value={c.Id_Cliente}>
                  {c.Nombre} ({c.Rol})
                </option>
              ))
            )}
          </select>
        </div>

        {error && (
          <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-2.5 py-2 text-[11px] text-destructive'>
            {error}
          </div>
        )}

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
            disabled={submitting || destinations.length === 0}
            className='h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium hover:opacity-90 disabled:opacity-50'
          >
            {submitting ? 'Creando...' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
