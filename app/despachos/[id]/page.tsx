'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getShipmentById,
  getCart,
  addToCart,
  removeFromCart,
  processShipment
} from '@/services/shipment-service';
import { getAvailableProducts } from '@/services/product-service';
import {
  DespachoConDetalle,
  CarroItem,
  Producto,
  DespachoEstado
} from '@/services/types';

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

const STATUS_STYLE: Record<DespachoEstado, string> = {
  procesado:
    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  pendiente: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  cancelado:
    'bg-destructive/10 text-destructive border border-destructive/20'
};

export default function GestionarDespachoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [despacho, setDespacho] = useState<DespachoConDetalle | null>(null);
  const [available, setAvailable] = useState<Producto[]>([]);
  const [cart, setCart] = useState<CarroItem[]>([]);
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submittingItem, setSubmittingItem] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const loadCart = useCallback(async () => {
    setCart(await getCart());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const desp = await getShipmentById(id);
      setDespacho(desp);
      if (desp.Estado === 'pendiente') {
        const [prods] = await Promise.all([getAvailableProducts(), loadCart()]);
        setAvailable(prods);
        setProductId(prods[0]?.Id_Producto ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el despacho');
    } finally {
      setLoading(false);
    }
  }, [id, loadCart]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setSubmittingItem(true);
    setError('');
    try {
      await addToCart(productId, quantity);
      await loadCart();
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar el producto');
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleRemove = async (idProducto: number) => {
    try {
      await removeFromCart(idProducto);
      await loadCart();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo quitar el producto');
    }
  };

  const handleProcess = async () => {
    if (!despacho) return;
    if (
      !confirm(
        'Se procesará el despacho de forma atómica (sp_ProcesarDespacho). ¿Continuar?'
      )
    )
      return;
    setProcessing(true);
    setError('');
    setResult('');
    try {
      await processShipment(id, despacho.Id_Cliente);
      setResult('Despacho procesado exitosamente. Stock actualizado.');
      await load();
    } catch (err) {
      // El SP cancela el despacho y limpia el carro ante stock insuficiente
      setError(
        err instanceof Error ? err.message : 'El despacho fue cancelado.'
      );
      await load();
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <p className='text-xs font-mono text-muted-foreground p-4'>
        Cargando manifiesto...
      </p>
    );

  if (!despacho)
    return (
      <div className='space-y-4'>
        <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2 text-[11px] text-destructive'>
          {error || 'Despacho no encontrado.'}
        </div>
        <button
          onClick={() => router.push('/despachos')}
          className='h-8 px-3 text-xs border border-input bg-background text-foreground rounded-sm hover:bg-muted'
        >
          Volver
        </button>
      </div>
    );

  const isPending = despacho.Estado === 'pendiente';

  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Manifiesto de Despacho #{despacho.Id_Despacho}
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Cliente: {despacho.NombreCliente} · {fmtDate(despacho.Fecha)} ·
            Operario: {despacho.Operario}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-mono rounded-sm font-bold uppercase ${STATUS_STYLE[despacho.Estado]}`}
        >
          {despacho.Estado}
        </span>
      </div>

      {result && (
        <div className='rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-600'>
          {result}
        </div>
      )}
      {error && (
        <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2 text-[11px] text-destructive'>
          {error}
        </div>
      )}

      {/* Gestión del carro (solo si pendiente) */}
      {isPending && (
        <>
          <div className='rounded-sm border border-border bg-card p-4 space-y-3'>
            <h2 className='text-sm font-semibold text-foreground'>
              Agregar Producto al Carro
            </h2>
            <form
              onSubmit={handleAddItem}
              className='grid grid-cols-1 sm:grid-cols-3 gap-3 items-end'
            >
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-muted-foreground'>
                  Producto (stock disponible)
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(Number(e.target.value))}
                  className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
                >
                  {available.length === 0 ? (
                    <option value={0} disabled>
                      Sin productos con existencias
                    </option>
                  ) : (
                    available.map((p) => (
                      <option key={p.Id_Producto} value={p.Id_Producto}>
                        {p.Codigo} — {p.Nombre} ({p.Cantidad_Actual} uds)
                      </option>
                    ))
                  )}
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
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                />
              </div>

              <button
                type='submit'
                disabled={submittingItem || available.length === 0}
                className='h-8 bg-muted text-foreground border border-border text-xs font-medium rounded-sm hover:bg-muted/80 transition-colors cursor-pointer disabled:opacity-50'
              >
                {submittingItem ? 'Agregando...' : 'Agregar Partida'}
              </button>
            </form>
          </div>

          <div className='space-y-2'>
            <h3 className='text-sm font-semibold text-foreground'>
              Carro de Compras
            </h3>
            <div className='rounded-sm border border-border bg-card overflow-hidden'>
              <table className='w-full text-xs text-left border-collapse'>
                <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
                  <tr>
                    <th className='p-2.5 w-20'>Código</th>
                    <th className='p-2.5'>Producto</th>
                    <th className='p-2.5 text-right'>Solicitado</th>
                    <th className='p-2.5 text-right'>Stock</th>
                    <th className='p-2.5 text-right'>Acción</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {cart.length > 0 ? (
                    cart.map((item) => {
                      const insufficient = item.Cantidad > item.Cantidad_Actual;
                      return (
                        <tr key={item.Id_Producto} className='hover:bg-muted/20'>
                          <td className='p-2.5 font-mono text-muted-foreground'>
                            {item.CodigoProducto}
                          </td>
                          <td className='p-2.5 font-medium text-foreground'>
                            {item.NombreProducto}
                          </td>
                          <td
                            className={`p-2.5 font-mono font-bold text-right ${
                              insufficient ? 'text-destructive' : 'text-foreground'
                            }`}
                          >
                            {item.Cantidad}
                          </td>
                          <td className='p-2.5 font-mono text-right text-muted-foreground'>
                            {item.Cantidad_Actual}
                          </td>
                          <td className='p-2.5 text-right'>
                            <button
                              onClick={() => handleRemove(item.Id_Producto)}
                              className='text-destructive hover:underline cursor-pointer'
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className='p-6 text-center text-muted-foreground'
                      >
                        El carro está vacío. Agregue productos para procesar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className='flex justify-end pt-4 border-t border-border'>
            <button
              onClick={handleProcess}
              disabled={processing || cart.length === 0}
              className='h-8 px-3 text-xs bg-primary text-primary-foreground font-semibold rounded-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50'
            >
              {processing ? 'Procesando...' : 'Procesar Salida Física'}
            </button>
          </div>
        </>
      )}

      {/* Detalle (despacho procesado) */}
      {despacho.Estado === 'procesado' && (
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-foreground'>
            Detalle de Productos Despachados
          </h3>
          <div className='rounded-sm border border-border bg-card overflow-hidden'>
            <table className='w-full text-xs text-left border-collapse'>
              <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
                <tr>
                  <th className='p-2.5 w-20'>Código</th>
                  <th className='p-2.5'>Producto</th>
                  <th className='p-2.5 text-right'>Cantidad</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {despacho.Detalle && despacho.Detalle.length > 0 ? (
                  despacho.Detalle.map((d) => (
                    <tr key={d.Id_Producto} className='hover:bg-muted/20'>
                      <td className='p-2.5 font-mono text-muted-foreground'>
                        {d.CodigoProducto}
                      </td>
                      <td className='p-2.5 font-medium text-foreground'>
                        {d.NombreProducto}
                      </td>
                      <td className='p-2.5 font-mono font-bold text-foreground text-right'>
                        {d.Cantidad} uds
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className='p-6 text-center text-muted-foreground'
                    >
                      Sin detalle disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {despacho.Estado === 'cancelado' && (
        <div className='rounded-sm border border-destructive/20 bg-destructive/5 px-3 py-4 text-xs text-muted-foreground'>
          Este despacho fue <strong>cancelado</strong>. No se registraron
          productos en el detalle ni se modificó el inventario.
        </div>
      )}

      <div>
        <button
          onClick={() => router.push('/despachos')}
          className='h-8 px-3 text-xs border border-input bg-background text-foreground rounded-sm hover:bg-muted transition-colors cursor-pointer'
        >
          ← Volver a despachos
        </button>
      </div>
    </div>
  );
}
