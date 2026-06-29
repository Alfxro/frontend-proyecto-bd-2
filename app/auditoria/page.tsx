'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: number;
  date: string;
  previousValue: number;
  newValue: number;
  user: string;
  type: 'AUMENTO' | 'REDUCCIÓN';
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [productId, setProductId] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // GET /auditoria/productos/:id?inicio=&fin=
    console.log(
      `GET /auditoria/productos/${productId}?inicio=${startDate}&fin=${endDate}`
    );

    const fetchLogs = () => {
      const mockLogs: AuditLog[] = [
        {
          id: 1,
          date: '2026-06-15 08:30:22',
          previousValue: 0,
          newValue: 50,
          user: 'j.vargas',
          type: 'AUMENTO'
        },
        {
          id: 2,
          date: '2026-06-15 09:00:15',
          previousValue: 50,
          newValue: 38,
          user: 'm.gomez',
          type: 'REDUCCIÓN'
        }
      ];
      setLogs(mockLogs);
      setLoading(false);
    };

    fetchLogs();
  }, [productId, startDate, endDate]);

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Auditoría de Stock
        </h1>
        <p className='text-xs text-muted-foreground mt-0.5'>
          Pistas inmutables y variaciones delta registradas
          por producto.
        </p>
      </div>

      {/* Panel de Filtros Plano */}
      <div className='rounded-sm border border-border bg-card p-3 grid grid-cols-1 sm:grid-cols-3 gap-3'>
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
            <option value={2}>Cable UTP Categoría 6</option>
          </select>
        </div>

        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Fecha de Inicio
          </label>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          />
        </div>

        <div className='space-y-1'>
          <label className='text-[11px] font-medium text-muted-foreground'>
            Fecha de Fin
          </label>
          <input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='w-full h-8 px-2 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer'
          />
        </div>
      </div>

      {/* Tabla con estados de color plano y minimalista */}
      <div className='rounded-sm border border-border bg-card overflow-x-auto'>
        <table className='w-full text-xs text-left border-collapse'>
          <thead className='bg-muted text-muted-foreground font-medium border-b border-border'>
            <tr>
              <th className='p-3'>Fecha y Hora</th>
              <th className='p-3'>Tipo Movimiento</th>
              <th className='p-3'>Valor Anterior</th>
              <th className='p-3'>Valor Nuevo</th>
              <th className='p-3 text-right'>
                Usuario Operador
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {loading ?
              <tr>
                <td
                  colSpan={5}
                  className='p-4 text-center text-muted-foreground'
                >
                  Consultando registros...
                </td>
              </tr>
            : logs.length > 0 ?
              logs.map((log) => {
                const isIncrease = log.type === 'AUMENTO';
                return (
                  <tr
                    key={log.id}
                    className='hover:bg-muted/40 transition-colors'
                  >
                    <td className='p-3 font-mono text-muted-foreground'>
                      {log.date}
                    </td>
                    <td className='p-3'>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border ${
                          isIncrease ?
                            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className='p-3 font-mono text-muted-foreground'>
                      {log.previousValue} uds
                    </td>
                    <td className='p-3 font-mono font-bold text-foreground'>
                      {log.newValue} uds
                    </td>
                    <td className='p-3 text-right text-muted-foreground font-mono'>
                      {log.user}
                    </td>
                  </tr>
                );
              })
            : <tr>
                <td
                  colSpan={5}
                  className='p-6 text-center text-muted-foreground'
                >
                  No se encontraron variaciones delta para
                  este producto.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
