'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getClientById, updateClient } from '@/services/client-service';
import { ClienteRol } from '@/services/types';

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<ClienteRol>('origen');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const client = await getClientById(id);
        setNombre(client.Nombre);
        setRol(client.Rol);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'No se pudo cargar el cliente'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await updateClient(id, { Nombre: nombre.trim(), Rol: rol });
      router.push('/clientes');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo actualizar el cliente'
      );
      setSubmitting(false);
    }
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
          Actualización directa sobre la tabla relacional de clientes.
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
            className='h-8 px-3 border border-input bg-background text-xs text-foreground rounded-sm hover:bg-muted'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={submitting}
            className='h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium disabled:opacity-50'
          >
            {submitting ? 'Aplicando...' : 'Aplicar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
