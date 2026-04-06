import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcyouilpoqkegiwquzji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeW91aWxwb3FrZWdpd3F1emppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTk2MTYsImV4cCI6MjA5MDgzNTYxNn0.LAloNnq-6mjvegXiYLwwTjG0th4BYh4CVuRad2WtIyo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCount() {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Hata:', error);
  } else {
    console.log(`Veritabanındaki ürün sayısı: ${count}`);
  }
}

checkCount();
