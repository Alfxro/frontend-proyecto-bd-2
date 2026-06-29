'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Item {
  productId: number;
  name: string;
  quantity: number;
}

export default function GestionarDespachoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [status, setStatus] = useState<
    'PENDIENTE' | 'PROCESADO' | 'CANCELADO'
  >('PENDIENTE');
  const [items, setItems] = useState<Item[]>([]);
  const [productId, setProductId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [submittingItem, setSubmittingItem] =
    useState(false);
  const [processingOrder, setProcessingOrder] =
    useState(false);

  useEffect(() => {
    // Si es una orden previa (simulación) cargamos datos por defecto
    if (id === '201') {
      setStatus('PROCESADO');
      setItems([
        {
          productId: 1,
          name: 'Tornillos de Anclaje 3/8',
          quantity: 12
        }
      ]);
    }
  }, [id]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingItem(true);

    const productName =
      productId === 1 ?
        'Tornillos de Anclaje 3/8'
      : 'Cable UTP Categoría 6';

    // Llamada formal a POST /despachos/:id/productos
    console.log(`POST /despachos/${id}/productos`, {
      productoId: productId,
      cantidad: quantity
    });

    setTimeout(() => {
      setItems([
        ...items,
        { productId, name: productName, quantity }
      ]);
      setQuantity(1);
      setSubmittingItem(false);
    }, 300);
  };

  const handleFinalizeShipment = async (
    action: 'procesar' | 'cancelar'
  ) => {
    if (
      !confirm(
        `¿Está seguro de cambiar el estado de la orden a ${action.toUpperCase()}?`
      )
    )
      return;

    setProcessingOrder(true);

    // Endpoint POST /despachos/:id/procesar interno llama a CALL sp_ProcesarDespacho(...)
    console.log(`POST /despachos/${id}/${action}`);

    setTimeout(() => {
      setStatus(
        action === 'procesar' ? 'PROCESADO' : 'CANCELADO'
      );
      setProcessingOrder(false);
      router.push('/despachos');
    }, 500);
  };

  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Manifiesto de Despacho #{id}
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Inyecte partidas de mercancía y procese la
            salida física de almacén.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-xs text-muted-foreground font-medium'>
            Estado:
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-mono rounded-sm font-bold ${
              status === 'PROCESADO' ?
                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {status === 'PENDIENTE' && (
        <div className='rounded-sm border border-border bg-card p-4 space-y-3'>
          <h2 className='text-sm font-semibold text-foreground'>
            Inyectar Producto al Despacho
          </h2>
          <form
            onSubmit={handleAddItem}
            className='grid grid-cols-1 sm:grid-cols-3 gap-3 items-end'
          >
            <div className='space-y-1'>
              <label className='text-[11px] font-medium text-muted-foreground'>
                Producto
              </label>
              <select
                value={productId}
                onChange={(e) =>
                  setProductId(Number(e.target.value))
                }
                className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
              >
                <option value={1}>
                  Tornillos de Anclaje 3/8
                </option>
                <option value={2}>
                  Cable UTP Categoría 6
                </option>
              </select>
            </div>

            <div className='space-y-1'>
              <label className='text-[11px] font-medium text-muted-foreground'>
                Cantidad a Retirar
              </label>
              <input
                type='number'
                min={1}
                required
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>

            <button
              type='submit'
              disabled={submittingItem}
              className='h-8 bg-muted text-foreground border border-border text-xs font-medium rounded-sm hover:bg-muted/80 transition-colors cursor-pointer disabled:opacity-50'
            >
              {submittingItem ?
                'Inyectando...'
              : 'Agregar Partida'}
            </button>
          </form>
        </div>
      )}

      {/* Detalle de Artículos Incluidos */}
      <div className='space-y-2'>
        <h3 className='text-sm font-semibold text-foreground'>
          Productos en la Orden
        </h3>
        <div className='rounded-sm border border-border bg-card overflow-hidden'>
          <table className='w-full text-xs text-left border-collapse'>
            <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
              <tr>
                <th className='p-2.5 w-16'>ID SKU</th>
                <th className='p-2.5'>
                  Descripción del Producto
                </th>
                <th className='p-2.5 text-right'>
                  Cantidad Solicitada
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {items.length > 0 ?
                items.map((item, index) => (
                  <tr
                    key={index}
                    className='hover:bg-muted/20'
                  >
                    <td className='p-2.5 font-mono text-muted-foreground'>
                      {item.productId}
                    </td>
                    <td className='p-2.5 font-medium text-foreground'>
                      {item.name}
                    </td>
                    <td className='p-2.5 font-mono font-bold text-foreground text-right'>
                      {item.quantity} unidades
                    </td>
                  </tr>
                ))
              : <tr>
                  <td
                    colSpan={3}
                    className='p-6 text-center text-muted-foreground'
                  >
                    No hay productos inyectados en este
                    manifiesto de salida.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel de Firma y Despacho Final de Negocio */}
      {status === 'PENDIENTE' && items.length > 0 && (
        <div className='flex justify-end space-x-2 pt-4 border-t border-border'>
          <button
            onClick={() =>
              handleFinalizeShipment('cancelar')
            }
            disabled={processingOrder}
            className='h-8 px-3 text-xs border border-destructive bg-background text-destructive rounded-sm hover:bg-destructive/10 transition-colors cursor-pointer'
          >
            Cancelar Orden
          </button>
          <button
            onClick={() =>
              handleFinalizeShipment('procesar')
            }
            disabled={processingOrder}
            className='h-8 px-3 text-xs bg-primary text-primary-foreground font-semibold rounded-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center'
          >
            {processingOrder ?
              'Procesando sp_ProcesarDespacho...'
            : 'Procesar Salida Física'}
          </button>
        </div>
      )}
    </div>
  );
}
