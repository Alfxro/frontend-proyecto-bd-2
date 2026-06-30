'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/services/client-service';
import { ClienteRol } from '@/services/types';

export default function NuevoClientePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<ClienteRol>('origen');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createClient({ Nombre: nombre.trim(), Rol: rol });
      router.push('/clientes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el cliente');
      setSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <div className='border-b border-border pb-2'>
        <h1 className='text-xl font-bold tracking-tight text-foreground'>
          Registrar Cliente
        </h1>
        <p className='text-xs text-muted-foreground'>
          Inyección de una nueva entidad comercial al catálogo.
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
            onChange={(e) => setRol(e.target.value as ClienteRol)}
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs focus:outline-none cursor-pointer'
          >
            <option value='origen'>ORIGEN (solo ingresa productos)</option>
            <option value='destino'>DESTINO (solo recibe despachos)</option>
            <option value='ambos'>AMBOS (ingresa y despacha)</option>
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
            onClick={() => router.push('/clientes')}
            className='h-8 px-3 border border-input bg-background text-xs text-foreground rounded-sm hover:bg-muted transition-colors'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={submitting}
            className='h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {submitting ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}
