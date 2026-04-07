import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// IDM-VTON Resmi Modeli
const VTON_MODEL = "yisol/idm-vton:03e94a86f9f257fa9506689d020e2417a80b032d84715bd7d8f343833d7b41e2";

// Varsayılan manken görseli (full body, stüdyo çekimi)
const DEFAULT_MODEL_IMAGE = "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&q=80&w=768&h=1024";

export async function POST(req) {
  try {
    const body = await req.json();
    const { garmentImage, category, modelImage } = body;

    if (!garmentImage) {
      return NextResponse.json({ error: 'Kıyafet görseli gerekli' }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token ayarlanmamış. .env.local dosyasını kontrol edin.' },
        { status: 500 }
      );
    }

    // Replicate'in görsele erişebilmesi için URL'nin mutlak olması gerekir (http...)
    let absoluteGarmentImage = garmentImage;
    if (garmentImage && garmentImage.startsWith('/')) {
      const host = req.headers.get('host');
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      absoluteGarmentImage = `${protocol}://${host}${garmentImage}`;
    }

    // Manken görseli için de mutlak URL kontrolü
    let absoluteModelImage = modelImage || DEFAULT_MODEL_IMAGE;
    if (modelImage && typeof modelImage === 'string' && modelImage.startsWith('/')) {
      const host = req.headers.get('host');
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      absoluteModelImage = `${protocol}://${host}${modelImage}`;
    }

    console.log(`AI İsteği Gönderiliyor: ${category} - Model: ${absoluteModelImage}`);

    const output = await replicate.run(VTON_MODEL, {
      input: {
        human_img: absoluteModelImage,
        garm_img: absoluteGarmentImage,
        garment_des: category === 'alt' ? 'lower body garment' : category === 'ayakkabi' ? 'shoes' : 'upper body garment',
        category: category === 'alt' ? 'lower_body' : category === 'ayakkabi' ? 'lower_body' : 'upper_body',
        crop: false,
        seed: 42,
        steps: 30,
      },
    });

    // Replicate output extraction
    let imageUrl = Array.isArray(output) ? output[0] : output;
    if (imageUrl && typeof imageUrl === 'object') {
      imageUrl = imageUrl.url || imageUrl.image || Object.values(imageUrl).find(v => typeof v === 'string' && v.startsWith('http'));
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error("Replicate Geçersiz Çıktı:", output);
      return NextResponse.json({ 
        error: 'Model görsel üretemedi.', 
        details: 'API geçerli bir resim URL\'si döndürmedi.',
        raw: output 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error("VTON Hatası:", error);
    
    // Detaylı hata mesajı ayıklama
    const errorMessage = error.message || 'Virtual Try-On işlemi başarısız.';
    const errorDetails = error.response ? await error.response.text() : errorMessage;

    return NextResponse.json(
      { 
        error: 'Virtual Try-On işlemi başarısız.', 
        details: errorMessage,
        fullError: errorDetails
      },
      { status: 500 }
    );
  }
}
