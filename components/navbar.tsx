'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  const links = [
    { label: 'Dashboard', path: '/' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Productos', path: '/productos' },
    { label: 'Recepciones', path: '/recepciones' },
    { label: 'Despachos', path: '/despachos' },
    { label: 'Auditoría', path: '/auditoria' }
  ];

  return (
    <nav className='w-full bg-background border-b border-border sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto h-12 flex items-center justify-between px-4'>
        <div className='flex items-center space-x-4'>
          <span className='font-mono text-xs font-bold tracking-tight text-foreground'>
            SGID .
          </span>
          <div className='flex items-center space-x-1'>
            {links.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className={`h-8 px-2.5 flex items-center text-xs font-medium rounded-sm border ${
                  pathname.startsWith(l.path) ?
                    'bg-muted border-border text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className='flex items-center space-x-2 font-mono text-[11px] text-muted-foreground'>
          <span className='font-bold text-foreground'>
            j.vargas
          </span>
          <span className='px-1 bg-muted border border-border rounded-sm text-[9px]'>
            OP
          </span>
          <Link
            href='/login'
            className='hover:text-destructive pl-2'
          >
            Salir
          </Link>
        </div>
      </div>
    </nav>
  );
}
