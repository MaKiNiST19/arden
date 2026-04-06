'use client';
import { usePathname } from 'next/navigation';

export default function ConditionalWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide standard Header, Footer, and WhatsApp on admin paths
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) {
    return null;
  }
  
  return <>{children}</>;
}
