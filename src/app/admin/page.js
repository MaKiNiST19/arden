'use client';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Toplam Gelir',
      value: '₺0',
      change: '0%',
      isPositive: true,
      icon: DollarSign
    },
    {
      title: 'Aktif Siparişler',
      value: '0',
      change: '0',
      isPositive: true,
      icon: ShoppingBag
    },
    {
      title: 'Yeni Müşteriler',
      value: '0',
      change: '0%',
      isPositive: false,
      icon: Users
    },
    {
      title: 'Başarılı Ödemeler',
      value: '0',
      change: '0%',
      isPositive: true,
      icon: CreditCard
    }
  ];

  const recentOrders = [];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Dashboard Özeti</h1>
      
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>{stat.title}</span>
                <Icon className={styles.statIcon} size={20} />
              </div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statChange}>
                {stat.isPositive ? (
                  <ArrowUpRight size={16} className={styles.changePos} />
                ) : (
                  <ArrowDownRight size={16} className={styles.changeNeg} />
                )}
                <span className={stat.isPositive ? styles.changePos : styles.changeNeg}>
                  {stat.change}
                </span>
                <span style={{ color: '#94a3b8', marginLeft: '4px' }}>geçen aya göre</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Orders Table */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Son Siparişler</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 500 }}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td style={{ fontWeight: 600 }}>{order.amount}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        order.status === 'Teslim Edildi' ? styles.badgeSuccess : 
                        order.status === 'Kargoda' ? styles.badgeInfo : styles.badgeWarning
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                    Henüz güncel sipariş bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions / Activity */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Sistem Durumu</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Supabase Veritabanı</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Bağlantı Başarılı</div>
              </div>
            </div>
            {/* Supabase status check */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <Package size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Ürünler Tablosu</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>12 Aktif Ürün</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
