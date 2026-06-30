import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/navbar';
import AuthGuard from '@/components/auth-guard';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'SGID — LogiChain Solutions',
  description:
    'Sistema de Gestión de Inventario y Despacho (SGID) para LogiChain Solutions'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable
      )}
    >
      <body className='min-h-full flex flex-col p-4'>
        {/* Barra de Navegación Global */}
        <Navbar />
        <main className='flex-1 w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
          <div className='animate-in fade-in duration-200'>
            <AuthGuard>{children}</AuthGuard>
          </div>
        </main>
      </body>
    </html>
  );
}
