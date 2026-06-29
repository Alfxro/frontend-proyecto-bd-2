'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevaRecepcionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    productId: 1,
    clientId: 1,
    quantity: 1,
    batch: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Formato exacto requerido por el endpoint del backend POST /recepciones
    const payload = {
      productoId: form.productId,
      clienteId: form.clientId,
      cantidad: form.quantity,
      lote: form.batch
    };

    console.log(
      'POST /recepciones (CALL sp_RegistrarRecepcion)',
      payload
    );

    setTimeout(() => {
      setSubmitting(false);
      router.push('/recepciones');
    }, 400);
  };

  return (
    <div className='max-w-xl space-y-4'>
      <div className='flex items-start justify-between border-b border-border pb-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Nueva Recepción
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Asigne entrada e incremente el stock físico del
            almacén.
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
                  setForm({
                    ...form,
                    productId: Number(e.target.value)
                  })
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
              <label className='text-xs font-medium text-foreground'>
                Cliente de Origen
              </label>
              <select
                value={form.clientId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    clientId: Number(e.target.value)
                  })
                }
                className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
              >
                <option value={1}>
                  Distribuidora del Norte (ORIGEN)
                </option>
                <option value={3}>
                  Abastecedora Grecia (ORIGEN)
                </option>
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    batch: e.target.value
                  })
                }
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
                  setForm({
                    ...form,
                    quantity: Number(e.target.value)
                  })
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
          </div>

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
              {submitting ?
                'Invocando...'
              : 'Registrar Entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
