'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Tags, 
  PenTool,
  LogOut,
  Bell
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Ürün Yönetimi', href: '/admin/products', icon: Package },
    { name: 'Kategoriler', href: '/admin/categories', icon: Tags },
    { name: 'Siparişler', href: '/admin/orders', icon: Package },
    { name: 'Müşteriler', href: '/admin/users', icon: Users },
    { name: 'Blog', href: '/admin/blogs', icon: PenTool },
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          Arden Admin
        </div>
        <div className={styles.sidebarContent}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <Link href="/" className={styles.navItem} style={{ color: '#ef4444' }}>
            <LogOut strokeWidth={2} />
            Satış Sitesine Dön
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className={styles.mainWrapper}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>Yönetim Paneli</div>
          <div className={styles.topbarActions}>
            <button className={styles.userBtn}>
              <Bell size={20} color="#64748b" />
            </button>
            <button className={styles.userBtn}>
              <div className={styles.userAvatar}>A</div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Admin</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>admin@arden.com</span>
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
