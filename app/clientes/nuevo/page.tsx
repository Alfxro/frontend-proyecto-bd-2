'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/mock-data';

export default function NuevoClientePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'ORIGEN' | 'DESTINO'>(
    'ORIGEN'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.createClient(nombre, rol);
    router.push('/clientes');
  };

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <div className='border-b border-border pb-2'>
        <h1 className='text-xl font-bold tracking-tight text-foreground'>
          Registrar Cliente
        </h1>
        <p className='text-xs text-muted-foreground'>
          Inyección de una nueva entidad comercial al
          catálogo[cite: 99].
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='rounded-sm border border-border bg-card p-4 space-y-4'
      >
        <div className='space-y-1'>
          <label className='text-xs font-medium text-foreground'>
            Nombre / Razón Social
          </label>
          <input
            type='text'
            required
            placeholder='Ej. Distribuidora Grecia S.A.'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className='w-full h-8 px-2.5 rounded-sm border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring'
          />
        </div>

        <div className='space-y-1'>
          <label className='text-xs font-medium text-foreground'>
            Rol Operativo Logístico
          </label>
          <select
            value={rol}
            onChange={(e) =>
              setRol(e.target.value as 'ORIGEN' | 'DESTINO')
            }
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs focus:outline-none cursor-pointer'
          >
            <option value='ORIGEN'>
              ORIGEN (Proveedores / Entrada de Stock) [cite:
              108]
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
            className='h-8 px-3 border border-input bg-background text-xs text-foreground rounded-sm hover:bg-muted transition-colors'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium hover:opacity-90 transition-opacity'
          >
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}
