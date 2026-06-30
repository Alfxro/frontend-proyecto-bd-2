'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getInventoryMonitoring,
  deleteProduct
} from '@/services/product-service';
import { ProductoMonitoreo } from '@/services/types';

function fmtDate(value: string | null): string {
  if (!value) return '—';
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

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductoMonitoreo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setProducts(await getInventoryMonitoring());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar el inventario'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'No se pudo eliminar el producto'
      );
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Monitoreo de Inventario
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Existencias en tiempo real, ubicación física y alertas de stock
            crítico.
          </p>
        </div>
        <button
          onClick={() => router.push('/productos/nuevo')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Nuevo Producto
        </button>
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
              <th className='p-3 w-24'>Código</th>
              <th className='p-3'>Descripción</th>
              <th className='p-3'>Ubicación</th>
              <th className='p-3'>Existencias</th>
              <th className='p-3'>Último Ingreso</th>
              <th className='p-3'>Último Despacho</th>
              <th className='p-3'>Estado</th>
              <th className='p-3 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {loading ? (
              <tr>
                <td colSpan={8} className='p-4 text-center text-muted-foreground'>
                  Cargando inventario...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className='p-6 text-center text-muted-foreground'>
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isCritical = product.EstadoStock === 'REORDEN';
                return (
                  <tr
                    key={product.Id_Producto}
                    className={`transition-colors ${
                      isCritical ?
                        'bg-destructive/5 hover:bg-destructive/10'
                      : 'hover:bg-muted/40'
                    }`}
                  >
                    <td className='p-3 font-mono font-semibold text-muted-foreground'>
                      {product.Codigo}
                    </td>
                    <td className='p-3 font-medium text-foreground'>
                      {product.Nombre}
                    </td>
                    <td className='p-3 text-muted-foreground'>
                      {product.Bodega} (P: {product.Pasillo} / E:{' '}
                      {product.Estante})
                    </td>
                    <td className='p-3 font-mono font-bold text-foreground'>
                      {product.Cantidad_Actual} uds
                      <span className='block text-[10px] font-normal text-muted-foreground'>
                        mín: {product.Stock_Critico}
                      </span>
                    </td>
                    <td className='p-3 font-mono text-muted-foreground'>
                      {fmtDate(product.UltimoIngreso)}
                    </td>
                    <td className='p-3 font-mono text-muted-foreground'>
                      {fmtDate(product.UltimoDespacho)}
                    </td>
                    <td className='p-3'>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                          isCritical ?
                            'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {isCritical ? 'REORDEN' : 'ÓPTIMO'}
                      </span>
                    </td>
                    <td className='p-3 text-right space-x-3'>
                      <button
                        onClick={() =>
                          router.push(`/productos/${product.Id_Producto}`)
                        }
                        className='text-foreground hover:underline cursor-pointer'
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.Id_Producto)}
                        className='text-destructive hover:underline cursor-pointer'
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
