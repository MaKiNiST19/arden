import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// IDM-VTON Doğrulanmış Çalışan Versiyon (cuuupid tarafından barındırılan)
const VTON_MODEL = "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

// Varsayılan manken görseli (Erkek model, full body, stüdyo çekimi)
const DEFAULT_MODEL_IMAGE = "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=768&h=1024";

export async function POST(req) {
  try {
    const body = await req.json();
    const { garmentImage, category, modelImage, predictionId } = body;

    // EĞER predictionId VARSA, DURUM KONTROLÜ YAPIYORUZ
    if (predictionId) {
      console.log(`Durum kontrol ediliyor: ${predictionId}`);
      const prediction = await replicate.predictions.get(predictionId);
      
      if (prediction.status === "succeeded") {
        let imageUrl = prediction.output;
        if (Array.isArray(imageUrl)) imageUrl = imageUrl[0];
        if (imageUrl && typeof imageUrl === 'object') {
          imageUrl = imageUrl.url || imageUrl.image || Object.values(imageUrl).find(v => typeof v === 'string' && v.startsWith('http'));
        }
        return NextResponse.json({ success: true, status: "succeeded", imageUrl });
      }
      
      if (prediction.status === "failed" || prediction.status === "canceled") {
        console.error("Tahmin Başarısız:", prediction.error);
        return NextResponse.json({ 
          success: false, 
          status: prediction.status, 
          error: prediction.error || "İşlem başarısız oldu." 
        });
      }

      return NextResponse.json({ success: true, status: prediction.status });
    }

    // YENİ İŞLEM BAŞLATMA
    if (!garmentImage) {
      return NextResponse.json({ error: 'Kıyafet görseli gerekli' }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'API token bulunamadı. Lütfen çevre değişkenlerini kontrol edin.' }, { status: 500 });
    }

    // URL Mutlaklaştırma
    let absoluteGarmentImage = garmentImage;
    if (garmentImage && garmentImage.startsWith('/')) {
      const host = req.headers.get('host');
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      absoluteGarmentImage = `${protocol}://${host}${garmentImage}`;
    }

    let absoluteModelImage = modelImage || DEFAULT_MODEL_IMAGE;
    if (modelImage && typeof modelImage === 'string' && modelImage.startsWith('/')) {
      const host = req.headers.get('host');
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      absoluteModelImage = `${protocol}://${host}${modelImage}`;
    }

    console.log(`Yeni AI Tahmini Başlatılıyor (cuuupid): ${category}`);

    try {
      const prediction = await replicate.predictions.create({
        version: VTON_MODEL.split(":")[1],
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

      return NextResponse.json({ success: true, predictionId: prediction.id, status: prediction.status });
    } catch (replicateError) {
      console.error("Replicate Başlatma Hatası:", replicateError);
      return NextResponse.json({ 
        error: 'İşlem başlatılamadı.', 
        details: replicateError.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("VTON API Genel Hata:", error);
    return NextResponse.json(
      { error: 'Beklenmedik bir hata oluştu.', details: error.message },
      { status: 500 }
    );
  }
}
