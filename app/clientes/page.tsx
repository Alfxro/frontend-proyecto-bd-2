'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClients, deleteClient } from '@/services/client-service';
import { Cliente } from '@/services/types';

const ROLE_LABEL: Record<Cliente['Rol'], string> = {
  origen: 'ORIGEN',
  destino: 'DESTINO',
  ambos: 'AMBOS'
};

export default function ClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setClients(await getClients());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    try {
      await deleteClient(id);
      await load();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'No se pudo eliminar el cliente'
      );
    }
  };

  const filteredClients = clients.filter((c) =>
    c.Nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Clientes
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Administración de entidades comerciales de origen y destino.
          </p>
        </div>
        <button
          onClick={() => router.push('/clientes/nuevo')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Nuevo Cliente
        </button>
      </div>

      <div className='max-w-sm'>
        <input
          type='text'
          placeholder='Buscar por nombre comercial...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
        />
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
              <th className='p-3 w-16'>ID</th>
              <th className='p-3'>Nombre Comercial</th>
              <th className='p-3'>Rol Operativo</th>
              <th className='p-3 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {loading ? (
              <tr>
                <td colSpan={4} className='p-4 text-center text-muted-foreground'>
                  Cargando clientes...
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={4} className='p-6 text-center text-muted-foreground'>
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.Id_Cliente}
                  className='hover:bg-muted/40 transition-colors'
                >
                  <td className='p-3 font-mono text-muted-foreground'>
                    {client.Id_Cliente}
                  </td>
                  <td className='p-3 font-medium text-foreground'>
                    {client.Nombre}
                  </td>
                  <td className='p-3'>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                        client.Rol === 'origen' ?
                          'bg-primary text-primary-foreground'
                        : client.Rol === 'destino' ?
                          'bg-muted text-foreground border border-border'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {ROLE_LABEL[client.Rol]}
                    </span>
                  </td>
                  <td className='p-3 text-right space-x-3'>
                    <button
                      onClick={() =>
                        router.push(`/clientes/${client.Id_Cliente}`)
                      }
                      className='text-foreground hover:underline cursor-pointer'
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(client.Id_Cliente)}
                      className='text-destructive hover:underline cursor-pointer'
                    >
                      Eliminar
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
