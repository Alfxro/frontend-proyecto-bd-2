'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: number;
  name: string;
  role: 'ORIGEN' | 'DESTINO';
}

export default function ClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de GET /clientes
    const fetchClients = async () => {
      const mockClients: Client[] = [
        {
          id: 1,
          name: 'Distribuidora del Norte S.A.',
          role: 'ORIGEN'
        },
        {
          id: 2,
          name: 'Logística Central S.A.',
          role: 'DESTINO'
        },
        {
          id: 3,
          name: 'Abastecedora Grecia',
          role: 'ORIGEN'
        }
      ];
      setClients(mockClients);
      setLoading(false);
    };
    fetchClients();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className='text-xs text-muted-foreground p-4'>
        Cargando clientes...
      </div>
    );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Clientes
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Administración de entidades comerciales de
            origen y destino.
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
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className='hover:bg-muted/40 transition-colors'
              >
                <td className='p-3 font-mono text-muted-foreground'>
                  {client.id}
                </td>
                <td className='p-3 font-medium text-foreground'>
                  {client.name}
                </td>
                <td className='p-3'>
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                      client.role === 'ORIGEN' ?
                        'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                    }`}
                  >
                    {client.role}
                  </span>
                </td>
                <td className='p-3 text-right space-x-3'>
                  <button
                    onClick={() =>
                      router.push(`/clientes/${client.id}`)
                    }
                    className='text-foreground hover:underline cursor-pointer'
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className='text-destructive hover:underline cursor-pointer'
                  >
                    Eliminar
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
