import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCRARfNA4zZQ-rN0T6-XwtDRdNekd-PaaY");

export async function POST(req) {
  try {
    const { name, type = 'product' } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "İsim (name) gerekli" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const companyInfo = `
    Firma Adı: Arden Men Wear
    Adres: Yeşilova mah 4016. Cadde no 2/2D, Eryaman Porto AVM, Etimesgut / Ankara
    Telefon: 0532 321 06 27
    Konsept: Premium Erkek Giyim
    `;

    let prompt = '';
    
    if (type === 'category') {
       prompt = `Sen bir premium erkek giyim markasının profesyonel SEO içerik yazarısın. Firma bilgileri şunlar:\n${companyInfo}\n
       Lütfen e-ticaret sitemizdeki "${name}" kategorisi için şık, ikna edici ve SEO uyumlu kısa bir açıklama yaz (maksimum 4-5 cümle). 
       Ankara/Eryaman mağazamızın kalitesini hissettir, ancak çok reklam kokmasın, sade ve klas olsun.`;
    } else {
       prompt = `Sen bir premium erkek giyim markasının profesyonel SEO içerik yazarısın. Firma bilgileri şunlar:\n${companyInfo}\n
       "${name}" adlı ürün için şık, ikna edici ve SEO uyumlu bir ürün açıklaması yaz. 
       Açıklama maddeler halinde (özellikler) ve bir paragraf (tanıtım) şeklinde olsun. 
       Kumaş kalitesinden, konforundan ve stil ipuçlarından bahset. Gerektiğinde adresimizi veya numaramızı güven vermek için sonlara zarifçe ekle.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Hatası:", error);
    return NextResponse.json({ error: "İçerik üretilemedi" }, { status: 500 });
  }
}
