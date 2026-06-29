'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: '',
    name: '',
    criticalStock: 0,
    warehouse: '',
    aisle: '',
    shelf: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Payload exacto según el esquema JSON del endpoint POST /productos
    const payload = {
      codigo: form.code,
      nombre: form.name,
      stockCritico: form.criticalStock,
      bodega: form.warehouse,
      pasillo: form.aisle,
      estante: form.shelf
    };

    console.log('POST /productos', payload);

    setTimeout(() => {
      setSubmitting(false);
      router.push('/productos');
    }, 400);
  };

  return (
    <div className='max-w-xl space-y-4'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Registrar Producto
        </h1>
        <p className='text-xs text-muted-foreground mt-0.5'>
          Defina las propiedades estructurales de la nueva
          mercancía.
        </p>
      </div>

      <div className='rounded-sm border border-border bg-card p-4'>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Código SKU
              </label>
              <input
                type='text'
                required
                placeholder='Ej. TOR-38'
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Límite Stock Crítico
              </label>
              <input
                type='number'
                required
                min={0}
                value={form.criticalStock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    criticalStock: Number(e.target.value)
                  })
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Nombre / Descripción
            </label>
            <input
              type='text'
              required
              placeholder='Ej. Tornillos de Anclaje de alta resistencia'
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Bodega de Almacenamiento
            </label>
            <input
              type='text'
              required
              placeholder='Ej. Bodega Principal Alajuela'
              value={form.warehouse}
              onChange={(e) =>
                setForm({
                  ...form,
                  warehouse: e.target.value
                })
              }
              className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Pasillo
              </label>
              <input
                type='text'
                required
                placeholder='Ej. Pasillo 3'
                value={form.aisle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    aisle: e.target.value
                  })
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Estante
              </label>
              <input
                type='text'
                required
                placeholder='Ej. Sección C'
                value={form.shelf}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shelf: e.target.value
                  })
                }
                className='w-full h-8 px-3 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
          </div>

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
              {submitting ?
                'Guardando...'
              : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
