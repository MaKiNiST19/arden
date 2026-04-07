import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// IDM-VTON modeli — sanal giydirme için en iyi model
const VTON_MODEL = "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

// Varsayılan manken görseli (beyaz arka plan, düz duruşlu erkek model)
const DEFAULT_MODEL_IMAGE = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=768&h=1024";

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
      const protocol = host.includes('localhost') ? 'http' : 'https';
      absoluteGarmentImage = `${protocol}://${host}${garmentImage}`;
    }

    // Manken görseli için de mutlak URL kontrolü
    let absoluteModelImage = modelImage || DEFAULT_MODEL_IMAGE;
    if (modelImage && modelImage.startsWith('/')) {
      const host = req.headers.get('host');
      const protocol = host.includes('localhost') ? 'http' : 'https';
      absoluteModelImage = `${protocol}://${host}${modelImage}`;
    }

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

    // Replicate output, tek bir URL string veya URL arrayi olabilir
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Model görsel üretemedi.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error("VTON Hatası:", error);
    return NextResponse.json(
      { error: 'Virtual Try-On işlemi başarısız.', details: error.message },
      { status: 500 }
    );
  }
}
