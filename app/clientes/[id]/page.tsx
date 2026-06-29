'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/mock-data';

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'ORIGEN' | 'DESTINO'>(
    'ORIGEN'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = db.getClientById(id);
    if (client) {
      setNombre(client.nombre);
      setRol(client.rol);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateClient(id, nombre, rol);
    router.push('/clientes');
  };

  if (loading)
    return (
      <p className='text-xs font-mono text-muted-foreground p-4'>
        Cargando registro estructural...
      </p>
    );

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <div className='border-b border-border pb-2'>
        <h1 className='text-xl font-bold tracking-tight text-foreground'>
          Modificar Cliente #{id}
        </h1>
        <p className='text-xs text-muted-foreground'>
          Actualización directa sobre la tabla relacional de
          clientes[cite: 111].
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='rounded-sm border border-border bg-card p-4 space-y-4'
      >
        <div className='space-y-1'>
          <label className='text-xs font-medium text-foreground'>
            Nombre Comercial
          </label>
          <input
            type='text'
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className='w-full h-8 px-2.5 rounded-sm border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring'
          />
        </div>

        <div className='space-y-1'>
          <label className='text-xs font-medium text-foreground'>
            Rol Asignado
          </label>
          <select
            value={rol}
            onChange={(e) =>
              setRol(e.target.value as 'ORIGEN' | 'DESTINO')
            }
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs focus:outline-none cursor-pointer'
          >
            <option value='ORIGEN'>
              ORIGEN (Proveedores / Entrada de Stock)
            </option>
            <option value='DESTINO'>
              DESTINO (Puntos de Entrega / Despachos)
            </option>
          </select>
        </div>

        <div className='flex justify-end space-x-2 pt-2 border-t border-border'>
          <button
            type='button'
            onClick={() => router.push('/clientes')}
            className='h-8 px-3 border border-input bg-background text-xs text-foreground rounded-sm hover:bg-muted'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium'
          >
            Aplicar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
