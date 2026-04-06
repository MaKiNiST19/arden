'use client';
import { Construction } from 'lucide-react';
import styles from './admin.module.css';

export default function PlaceholderPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
      <Construction size={64} style={{ marginBottom: '24px', opacity: 0.5 }} />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Bu Sayfa Yapım Aşamasında</h1>
      <p>Bu modül çok yakında sisteme entegre edilecektir.</p>
    </div>
  );
}
