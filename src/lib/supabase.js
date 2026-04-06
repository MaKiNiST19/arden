import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcyouilpoqkegiwquzji.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeW91aWxwb3FrZWdpd3F1emppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTk2MTYsImV4cCI6MjA5MDgzNTYxNn0.LAloNnq-6mjvegXiYLwwTjG0th4BYh4CVuRad2WtIyo';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Supabase env variables eksik, fallback (yedek) değerler kullanılıyor.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
