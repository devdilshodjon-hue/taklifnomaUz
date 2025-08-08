import {
  Search,
  Book,
  MessageCircle,
  Video,
  Download,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";

export default function Help() {
  const helpCategories = [
    {
      icon: Book,
      title: "Boshlash",
      description: "TaklifNoma bilan qanday ishlashni o'rganing",
      articles: [
        "Hisobni qanday yaratish?",
        "Birinchi taklifnomani yaratish",
        "Shablon tanlash bo'yicha maslahatlar",
        "Ma'lumotlarni to'ldirish",
      ],
    },
    {
      icon: Video,
      title: "Video Qo'llanmalar",
      description: "Vizual ko'rsatmalar orqali o'rganing",
      articles: [
        "TaklifNoma yaratish (5 daqiqa)",
        "RSVP boshqaruvi",
        "Ulashish usullari",
        "Statistikalarni ko'rish",
      ],
    },
    {
      icon: MessageCircle,
      title: "RSVP va Mehmonlar",
      description: "Mehmonlar bilan ishlash",
      articles: [
        "RSVP javoblarini kuzatish",
        "Mehmonlar ro'yxatini eksport qilish",
        "SMS xabarnomalar jo'natish",
        "Mehmon ma'lumotlarini tahrirlash",
      ],
    },
    {
      icon: Download,
      title: "Yuklab Olish va Ulashish",
      description: "Taklifnomalarni tarqatish",
      articles: [
        "PDF formatda yuklab olish",
        "QR kod yaratish va ishlatish",
        "WhatsApp orqali ulashish",
        "Ijtimoiy tarmoqlarda ulashish",
      ],
    },
  ];

  const faqs = [
    {
      question: "Taklifnomani qanday yaratish mumkin?",
      answer:
        "Shablonni tanlang, ma'lumotlarni kiriting va 'Saqlash' tugmasini bosing. Barchasi 3 daqiqada tugaydi!",
    },
    {
      question: "Bepul rejada nima mavjud?",
      answer:
        "3 ta taklifnoma, 5 ta shablon, 50 tagacha mehmon va asosiy RSVP funksiyasi mavjud.",
    },
    {
      question: "Premium rejaga qanday o'tish mumkin?",
      answer:
        "Narxlar sahifasidan kerakli rejani tanlab, to'lovni amalga oshiring.",
    },
    {
      question: "Taklifnomani tahrirlash mumkinmi?",
      answer:
        "Ha, istalgan vaqtda Dashboard orqali taklifnomangizni tahrirlashingiz mumkin.",
    },
    {
      question: "RSVP javoblarini qanday ko'rish mumkin?",
      answer:
        "Dashboard > Mening Taklifnomalarim > Statistika bo'limida barcha javoblarni ko'rishingiz mumkin.",
    },
    {
      question: "Mehmonlar ro'yxatini eksport qilish mumkinmi?",
      answer:
        "Premium rejada Excel va CSV formatlarida eksport qilish imkoni mavjud.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Yordam Markazi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            TaklifNoma xizmati bo'yicha barcha savol va javoblar
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Savolingizni qidiring..." className="pl-10" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3"
            asChild
          >
            <a href="/create">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  Taklifnoma Yaratish
                </div>
                <div className="text-sm text-muted-foreground">
                  Yangi taklifnoma yarating
                </div>
              </div>
            </a>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3"
            asChild
          >
            <a href="/contact">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  Texnik Yordam
                </div>
                <div className="text-sm text-muted-foreground">
                  Bizga murojaat qiling
                </div>
              </div>
            </a>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3"
            asChild
          >
            <a href="https://t.me/taklifnoma_uz" target="_blank">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  Telegram Kanal
                </div>
                <div className="text-sm text-muted-foreground">
                  Yangiliklar va maslahatlar
                </div>
              </div>
            </a>
          </Button>
        </div>

        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">
            Qo'llanmalar Bo'yicha Kategoriyalar
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="card-modern p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {category.articles.map((article, i) => (
                      <li key={i}>
                        <button className="text-left text-sm text-muted-foreground hover:text-primary transition-colors">
                          • {article}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">
            Ko'p Beriladigan Savollar
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="card-modern group">
                <summary className="p-6 cursor-pointer font-semibold text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <div className="card-modern p-8 max-w-2xl mx-auto">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
              Hali ham javob topa olmadingizmi?
            </h3>
            <p className="text-muted-foreground mb-6">
              Bizning professional yordam jamoasi sizga yordam berishga tayyor
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="primary-gradient">
                <a href="/contact">Biz Bilan Bog'laning</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://t.me/taklifnoma_support" target="_blank">
                  Telegram Yordam
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
