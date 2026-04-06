import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { garmentImage, category } = body;

    if (!garmentImage) {
      return NextResponse.json({ error: 'Kıyafet görseli gerekli' }, { status: 400 });
    }

    // --- DEMO MODU AÇIK ---
    // Replicate API kredisiz test yapabilmeniz için yapay zeka işlem süresini taklit ediyoruz.
    // Başarılı bir Sanal Giydirme (VTON) sonucunun nasıl göründüğünü simüle ediyoruz.
    
    // 3 saniyelik sahte yükleme süresi (Gerçek yapay zeka 15-20 sn sürer)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Kategoriye göre mükemmel giyinmiş gerçekçi bir model fotoğrafı döndürüyoruz
    let demoImageUrl = "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800"; // Şık bir kazak/üst
    
    if (category === 'alt') {
       demoImageUrl = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800"; // Şık bir pantolon odaklı
    }

    return NextResponse.json({ success: true, imageUrl: demoImageUrl });

  } catch (error) {
    console.error("Demo VTON Hatası:", error);
    return NextResponse.json({ error: 'İşlem başarısız oldu.', details: error.message }, { status: 500 });
  }
}
