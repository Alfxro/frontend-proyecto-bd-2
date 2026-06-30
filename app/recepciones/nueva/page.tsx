'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/services/product-service';
import { getClients } from '@/services/client-service';
import { createReceipt } from '@/services/receipt-service';
import { Producto, Cliente } from '@/services/types';

export default function NuevaRecepcionPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Producto[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [form, setForm] = useState({
    productId: 0,
    clientId: 0,
    quantity: 1,
    batch: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [prods, clis] = await Promise.all([
          getProducts(),
          getClients()
        ]);
        // Solo clientes que pueden ingresar productos: origen o ambos
        const origenes = clis.filter(
          (c) => c.Rol === 'origen' || c.Rol === 'ambos'
        );
        setProducts(prods);
        setClients(origenes);
        setForm((f) => ({
          ...f,
          productId: prods[0]?.Id_Producto ?? 0,
          clientId: origenes[0]?.Id_Cliente ?? 0
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.clientId) {
      setError('Seleccione producto y cliente de origen.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createReceipt({
        Id_Producto: form.productId,
        Cantidad_Entrante: form.quantity,
        Id_Cliente: form.clientId,
        Numero_Lote: form.batch.trim()
      });
      router.push('/recepciones');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo registrar la recepción'
      );
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className='text-xs font-mono text-muted-foreground p-4'>
        Cargando formulario...
      </p>
    );

  return (
    <div className='max-w-xl space-y-4'>
      <div className='flex items-start justify-between border-b border-border pb-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Nueva Recepción
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Asigne entrada e incremente el stock físico del almacén.
          </p>
        </div>
        <span className='font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground border border-border'>
          sp_RegistrarRecepcion
        </span>
      </div>

      <div className='rounded-sm border border-border bg-card p-4'>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Seleccionar Producto
              </label>
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: Number(e.target.value) })
                }
                className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
              >
                {products.map((p) => (
                  <option key={p.Id_Producto} value={p.Id_Producto}>
                    {p.Codigo} — {p.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Cliente de Origen
              </label>
              <select
                value={form.clientId}
                onChange={(e) =>
                  setForm({ ...form, clientId: Number(e.target.value) })
                }
                className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
              >
                {clients.map((c) => (
                  <option key={c.Id_Cliente} value={c.Id_Cliente}>
                    {c.Nombre} ({c.Rol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Identificador de Lote
              </label>
              <input
                type='text'
                required
                placeholder='Ej. L-TOR99'
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Cantidad Ingresada
              </label>
              <input
                type='number'
                min={1}
                required
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
          </div>

          {error && (
            <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-2.5 py-2 text-[11px] text-destructive'>
              {error}
            </div>
          )}

          <div className='flex items-center justify-end space-x-2 pt-2 border-t border-border'>
            <button
              type='button'
              onClick={() => router.push('/recepciones')}
              className='h-8 px-3 text-xs border border-input bg-background text-foreground rounded-sm hover:bg-muted transition-colors cursor-pointer'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={submitting}
              className='h-8 px-3 text-xs bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50'
            >
              {submitting ? 'Invocando...' : 'Registrar Entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
