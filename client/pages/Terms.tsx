import Navigation from "@/components/Navigation";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Foydalanish Shartlari
          </h1>
          <p className="text-lg text-muted-foreground">
            TaklifNoma xizmatidan foydalanish qoidalari va shartlari
          </p>
        </div>

        <div className="space-y-8">
          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              1. Umumiy Qoidalar
            </h2>
            <p className="text-muted-foreground mb-4">
              TaklifNoma xizmatidan foydalangan holda, siz ushbu shartlarni
              to'liq qabul qilasiz.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Xizmat 18 yoshdan katta foydalanuvchilar uchun</li>
              <li>Faqat qonuniy maqsadlarda foydalanish</li>
              <li>Boshqa foydalanuvchilar huquqlarini hurmat qilish</li>
              <li>To'g'ri ma'lumotlar berish majburiyati</li>
            </ul>
          </div>

          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              2. Ruxsat Etilmagan Faoliyat
            </h2>
            <p className="text-muted-foreground mb-4">
              Quyidagi harakatlar taqiqlanadi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Spam yoki noqonuniy kontent tarqatish</li>
              <li>Boshqalarning huquqlarini buzish</li>
              <li>Tizimga hacker hujumlari</li>
              <li>Noto'g'ri ma'lumotlar berish</li>
              <li>Xizmatni suiiste'mol qilish</li>
            </ul>
          </div>

          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              3. To'lov va Rad Etish
            </h2>
            <p className="text-muted-foreground mb-4">To'lov shartlari:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Premium xizmatlar uchun oylik/yillik to'lov</li>
              <li>Avtomatik yangilanish</li>
              <li>30 kun ichida to'lovni qaytarish</li>
              <li>Click, Payme, UzCard orqali to'lov</li>
            </ul>
          </div>

          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              4. Intellektual Mulk
            </h2>
            <p className="text-muted-foreground mb-4">
              Xizmatdagi barcha kontent bizning mulkimiz:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Shablonlar va dizaynlar</li>
              <li>Dasturiy ta'minot va kod</li>
              <li>Logo va brending</li>
              <li>Foydalanuvchi ma'lumotlari himoyalangan</li>
            </ul>
          </div>

          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              5. Javobgarlik Cheklash
            </h2>
            <p className="text-muted-foreground mb-4">
              TaklifNoma mas'uliyati cheklangan:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Xizmat uzilishlari uchun</li>
              <li>Ma'lumotlar yo'qolishi (zahiralash mavjud)</li>
              <li>Uchinchi tomon xizmatlari</li>
              <li>Foydalanuvchi xatolari</li>
            </ul>
          </div>

          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              6. Shartlarni O'zgartirish
            </h2>
            <p className="text-muted-foreground">
              Biz ushbu shartlarni oldindan ogohlantirish bilan o'zgartirish
              huquqini saqlab qolamiz. Davom etgan foydalanish yangi shartlarni
              qabul qilganingizni bildiradi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
