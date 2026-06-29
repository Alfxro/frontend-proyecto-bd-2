'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  code: string;
  name: string;
  stock: number;
  criticalStock: number;
  warehouse: string;
  aisle: string;
  shelf: string;
}

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /productos
    const fetchProducts = async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          code: 'TOR-38',
          name: 'Tornillos de Anclaje 3/8',
          stock: 8,
          criticalStock: 15,
          warehouse: 'Bodega Principal A',
          aisle: 'Pasillo 4',
          shelf: 'Estante C'
        },
        {
          id: 2,
          code: 'UTP-C6',
          name: 'Cable UTP Categoría 6',
          stock: 120,
          criticalStock: 20,
          warehouse: 'Bodega Principal A',
          aisle: 'Pasillo 2',
          shelf: 'Estante A'
        }
      ];
      setProducts(mockProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className='text-xs text-muted-foreground p-4'>
        Cargando inventario...
      </div>
    );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Productos
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Control de inventario físico y alertas
            estructurales de stock.
          </p>
        </div>
        <button
          onClick={() => router.push('/productos/nuevo')}
          className='h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer'
        >
          Nuevo Producto
        </button>
      </div>

      <div className='rounded-sm border border-border bg-card overflow-x-auto'>
        <table className='w-full text-xs text-left border-collapse'>
          <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
            <tr>
              <th className='p-3 w-28'>Código / SKU</th>
              <th className='p-3'>Descripción</th>
              <th className='p-3'>Ubicación Física</th>
              <th className='p-3'>Existencias</th>
              <th className='p-3 text-right'>Estado</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {products.map((product) => {
              const isCritical =
                product.stock <= product.criticalStock;
              return (
                <tr
                  key={product.id}
                  className='hover:bg-muted/40 transition-colors'
                >
                  <td className='p-3 font-mono font-semibold text-muted-foreground'>
                    {product.code}
                  </td>
                  <td className='p-3 font-medium text-foreground'>
                    {product.name}
                  </td>
                  <td className='p-3 text-muted-foreground'>
                    {product.warehouse} (P: {product.aisle}{' '}
                    / E: {product.shelf})
                  </td>
                  <td className='p-3 font-mono font-bold text-foreground'>
                    {product.stock} uds
                  </td>
                  <td className='p-3 text-right'>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                        isCritical ?
                          'bg-destructive/10 text-destructive border-destructive/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {isCritical ?
                        `STOCK CRÍTICO (Min: ${product.criticalStock})`
                      : 'ÓPTIMO'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
