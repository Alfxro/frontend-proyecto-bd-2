'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSession } from '@/services/api-config';

/**
 * Protege la aplicación: si no hay sesión activa redirige al login.
 * La pantalla de login (/login) queda exenta.
 */
export default function AuthGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session && pathname !== '/login') {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready && pathname !== '/login') return null;

  return <>{children}</>;
}
