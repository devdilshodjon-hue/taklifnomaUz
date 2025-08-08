import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Maxfiylik Siyosati
          </h1>
          <p className="text-lg text-muted-foreground">
            TaklifNoma xizmati foydalanuvchilarining maxfiyligini himoya qilish bo'yicha siyosati
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="card-modern p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              1. Ma'lumotlar To'plash
            </h2>
            <p className="text-muted-foreground mb-4">
              Biz quyidagi shaxsiy ma'lumotlarni to'playmiz:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Ism va familiya</li>
              <li>Email manzil</li>
              <li>Telefon raqami</li>
              <li>To'y ma'lumotlari (sana, joy, mehmonlar ro'yxati)</li>
              <li>Foydalanish statistikalari</li>
            </ul>
          </div>

          <div className="card-modern p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              2. Ma'lumotlardan Foydalanish
            </h2>
            <p className="text-muted-foreground mb-4">
              Sizning ma'lumotlaringizni quyidagi maqsadlarda ishlatamiz:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Taklifnomalar yaratish va boshqarish</li>
              <li>RSVP javoblarini qayta ishlash</li>
              <li>Xizmat ko'rsatish va texnik yordam</li>
              <li>Xizmatni yaxshilash uchun tahlil qilish</li>
              <li>Qonuniy talablarga javob berish</li>
            </ul>
          </div>

          <div className="card-modern p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              3. Ma'lumotlar Xavfsizligi
            </h2>
            <p className="text-muted-foreground mb-4">
              Sizning ma'lumotlaringizni himoya qilish uchun:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>SSL sertifikati bilan shifrlash</li>
              <li>Xavfsiz serverlar va ma'lumotlar bazasi</li>
              <li>Muntazam xavfsizlik auditlari</li>
              <li>Dostup nazorati va logging</li>
              <li>Ma'lumotlarni zahiralash</li>
            </ul>
          </div>

          <div className="card-modern p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              4. Uchinchi Tomon Xizmatlari
            </h2>
            <p className="text-muted-foreground mb-4">
              Biz quyidagi uchinchi tomon xizmatlaridan foydalanamiz:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Google Analytics - foydalanish statistikasi uchun</li>
              <li>Supabase - ma'lumotlar bazasi uchun</li>
              <li>SMS provider - xabarlar jo'natish uchun</li>
              <li>To'lov tizimlari - Click, Payme, UzCard</li>
            </ul>
          </div>

          <div className="card-modern p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              5. Sizning Huquqlaringiz
            </h2>
            <p className="text-muted-foreground mb-4">
              Siz quyidagi huquqlarga egasiz:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Ma'lumotlaringizni ko'rish va yuklab olish</li>
              <li>Ma'lumotlarni o'zgartirish yoki o'chirish</li>
              <li>Ma'lumotlar qayta ishlanishiga e'tiroz bildirish</li>
              <li>Shikoyat qilish</li>
              <li>Hisobni butunlay o'chirish</li>
            </ul>
          </div>

          <div className="card-modern p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              6. Cookie va Kuzatuv
            </h2>
            <p className="text-muted-foreground mb-4">
              Saytimizda quyidagi cookie'lardan foydalanamiz:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Zaruriy cookie'lar - sayt ishlashi uchun</li>
              <li>Analitik cookie'lar - foydalanish statistikasi</li>
              <li>Funktsional cookie'lar - foydalanuvchi tajribasi</li>
            </ul>
          </div>

          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              7. Aloqa
            </h2>
            <p className="text-muted-foreground mb-4">
              Maxfiylik bilan bog'liq savollar uchun:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Email: privacy@taklifnoma.uz</li>
              <li>Telefon: +998 90 123 45 67</li>
              <li>Telegram: @taklifnoma_support</li>
              <li>Manzil: Toshkent sh., Yunusobod t., IT Park</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-6">
              Oxirgi yangilanish: 2024 yil dekabr. Bu siyosat vaqti-vaqti bilan yangilanishi mumkin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
