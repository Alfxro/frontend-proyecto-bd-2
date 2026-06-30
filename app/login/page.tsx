'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth-service';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(usuario.trim(), password);
      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No tiene acceso al sistema.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-[70vh] flex items-center justify-center'>
      <div className='w-full max-w-sm space-y-4'>
        <div className='text-center space-y-1'>
          <span className='font-mono text-sm font-bold tracking-tight text-foreground'>
            SGID .
          </span>
          <h1 className='text-xl font-bold tracking-tight text-foreground'>
            Iniciar Sesión
          </h1>
          <p className='text-xs text-muted-foreground'>
            Acceda con su usuario y contraseña de la base de datos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='rounded-sm border border-border bg-card p-4 space-y-3'
        >
          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Usuario
            </label>
            <input
              type='text'
              required
              autoFocus
              placeholder='Ej. crodriguez'
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className='w-full h-8 px-2.5 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Contraseña
            </label>
            <input
              type='password'
              required
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full h-8 px-2.5 rounded-sm border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>

          {error && (
            <div className='rounded-sm border border-destructive/20 bg-destructive/10 px-2.5 py-2 text-[11px] text-destructive'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={submitting}
            className='w-full h-8 px-4 bg-primary text-primary-foreground text-xs rounded-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50'
          >
            {submitting ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
