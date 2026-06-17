'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function HeaderWithPath() {
  const pathname = usePathname() ?? '/';
  return <Header pathname={pathname} />;
}
