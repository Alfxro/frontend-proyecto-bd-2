'use client';

import { useRouter } from 'next/navigation';

interface NavigationModule {
  title: string;
  description: string;
  path: string;
  databaseProcedure?: string;
}

export default function RootDashboardPage() {
  const router = useRouter();

  // Mapeo estructural de los módulos según requerimientos del sistema
  const modules: NavigationModule[] = [
    {
      title: 'Gestión de Clientes',
      description:
        'Administración integral de entidades comerciales catalogadas como Origen (proveedores) y Destino (sucursales).',
      path: '/clientes'
    },
    {
      title: 'Inventario de Productos',
      description:
        'Control estricto de existencias físicas, asignación de ubicaciones de almacenamiento y monitor de stock crítico.',
      path: '/productos'
    },
    {
      title: 'Recepciones de Mercancía',
      description:
        'Registro cronológico e ingreso de stock al almacén general mediante transacciones controladas.',
      path: '/recepciones'
    },
    {
      title: 'Órdenes de Despacho',
      description:
        'Preparación de pedidos, inyección de partidas de productos y confirmación de salidas físicas.',
      path: '/despachos'
    },
    {
      title: 'Auditoría de Movimientos',
      description:
        'Historial inmutable de variaciones delta por producto con desglose exhaustivo de operadores y fechas.',
      path: '/auditoria'
    }
  ];

  return (
    <div className='space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-0'>
      {/* Encabezado Principal Plano */}
      <div className='border-b border-border pb-4'>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Sistema de Gestión de Inventario y Despacho (SGID)
        </h1>
        <p className='text-xs text-muted-foreground mt-1'>
          Panel de control de operaciones. Seleccione un
          módulo para gestionar los flujos y transacciones
          de bodega.
        </p>
      </div>

      {/* Rejilla Modular Minimalista */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {modules.map((module) => (
          <div
            key={module.path}
            onClick={() => router.push(module.path)}
            className='group relative rounded-sm border border-border bg-card p-5 transition-colors duration-150 hover:border-primary cursor-pointer flex flex-col justify-between min-h-[160px]'
          >
            <div>
              <div className='flex items-start justify-between gap-4'>
                <h2 className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
                  {module.title}
                </h2>
                {module.databaseProcedure && (
                  <span className='font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground border border-border shrink-0'>
                    {module.databaseProcedure}
                  </span>
                )}
              </div>
              <p className='mt-2 text-xs text-muted-foreground leading-relaxed'>
                {module.description}
              </p>
            </div>

            {/* Enlace de Acción Inferior */}
            <div className='mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors'>
              <span>Abrir módulo</span>
              <span className='transform group-hover:translate-x-0.5 transition-transform'>
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
