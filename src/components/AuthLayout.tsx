'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const AUTH_PAGES = ['/login', '/gate'];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">{children}</main>
    </>
  );
}
