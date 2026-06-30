'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getProductById,
  updateProduct,
  getProductReceptions
} from '@/services/product-service';
import { RecepcionExtendida } from '@/services/types';

function fmtDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState({
    code: '',
    name: '',
    stock: 0,
    criticalStock: 0,
    warehouse: '',
    aisle: '',
    shelf: ''
  });
  const [receptions, setReceptions] = useState<RecepcionExtendida[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [p, recs] = await Promise.all([
          getProductById(id),
          getProductReceptions(id)
        ]);
        setForm({
          code: p.Codigo,
          name: p.Nombre,
          stock: p.Cantidad_Actual,
          criticalStock: p.Stock_Critico,
          warehouse: p.Bodega,
          aisle: p.Pasillo,
          shelf: p.Estante
        });
        setReceptions(recs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'No se pudo cargar el producto'
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
      await updateProduct(id, {
        Nombre: form.name.trim(),
        Stock_Critico: form.criticalStock,
        Bodega: form.warehouse.trim(),
        Pasillo: form.aisle.trim(),
        Estante: form.shelf.trim()
      });
      router.push('/productos');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo actualizar el producto'
      );
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className='text-xs font-mono text-muted-foreground p-4'>
        Cargando producto...
      </p>
    );

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='border-b border-border pb-2'>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Modificar Producto{' '}
          <span className='font-mono text-base text-muted-foreground'>
            {form.code}
          </span>
        </h1>
        <p className='text-xs text-muted-foreground mt-0.5'>
          La cantidad en inventario solo cambia por recepciones y despachos.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='rounded-sm border border-border bg-card p-4 space-y-3'
      >
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Nombre / Descripción
            </label>
            <input
              type='text'
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Stock Crítico
            </label>
            <input
              type='number'
              required
              min={0}
              value={form.criticalStock}
              onChange={(e) =>
                setForm({ ...form, criticalStock: Number(e.target.value) })
              }
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-3'>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>Bodega</label>
            <input
              type='text'
              required
              value={form.warehouse}
              onChange={(e) =>
                setForm({ ...form, warehouse: e.target.value })
              }
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>Pasillo</label>
            <input
              type='text'
              required
              value={form.aisle}
              onChange={(e) => setForm({ ...form, aisle: e.target.value })}
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>Estante</label>
            <input
              type='text'
              required
              value={form.shelf}
              onChange={(e) => setForm({ ...form, shelf: e.target.value })}
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
        </div>

        <div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
          <span className='px-2 py-0.5 bg-muted border border-border rounded-sm font-mono'>
            Existencias actuales: {form.stock} uds
          </span>
        </div>

        {error && (
          <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-2.5 py-2 text-[11px] text-destructive'>
            {error}
          </div>
        )}

        <div className='flex items-center justify-end space-x-2 pt-2 border-t border-border'>
          <button
            type='button'
            onClick={() => router.push('/productos')}
            className='h-8 px-3 text-xs border border-input bg-background text-foreground rounded-sm hover:bg-muted transition-colors cursor-pointer'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={submitting}
            className='h-8 px-3 text-xs bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50'
          >
            {submitting ? 'Aplicando...' : 'Aplicar Cambios'}
          </button>
        </div>
      </form>

      {/* Recepciones del producto (requisito del módulo) */}
      <div className='space-y-2'>
        <h2 className='text-sm font-semibold text-foreground'>
          Recepciones de este producto
        </h2>
        <div className='rounded-sm border border-border bg-card overflow-x-auto'>
          <table className='w-full text-xs text-left border-collapse'>
            <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
              <tr>
                <th className='p-3'>Fecha</th>
                <th className='p-3'>Cliente</th>
                <th className='p-3'>Lote</th>
                <th className='p-3'>Cantidad</th>
                <th className='p-3 text-right'>Usuario</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {receptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='p-6 text-center text-muted-foreground'
                  >
                    Sin recepciones registradas.
                  </td>
                </tr>
              ) : (
                receptions.map((r) => (
                  <tr key={r.Id_Recepcion} className='hover:bg-muted/40'>
                    <td className='p-3 font-mono text-muted-foreground'>
                      {fmtDate(r.Fecha)}
                    </td>
                    <td className='p-3 font-medium text-foreground'>
                      {r.NombreCliente}
                    </td>
                    <td className='p-3 font-mono text-primary font-semibold'>
                      {r.Numero_Lote}
                    </td>
                    <td className='p-3 font-mono font-bold text-foreground'>
                      {r.Cantidad} uds
                    </td>
                    <td className='p-3 text-right font-mono text-muted-foreground'>
                      {r.Usuario}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
