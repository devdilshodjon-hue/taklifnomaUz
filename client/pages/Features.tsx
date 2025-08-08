import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Check,
  ArrowRight,
  Star,
  Crown,
  Zap,
  Heart,
  Users,
  Share2,
  Download,
  Shield,
  Headphones,
  Palette,
  Code,
  Globe,
  Smartphone,
  Calendar,
  Bell,
  BarChart3,
  Camera,
  FileText,
  QrCode,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

export default function Features() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Asosiy",
      description: "Shaxsiy foydalanish uchun",
      icon: Heart,
      color: "bg-blue-500",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "3 ta taklifnoma yaratish",
        "5 ta asosiy shablon",
        "Oddiy RSVP funksiyasi",
        "Maksimal 50 ta mehmon",
        "Asosiy ulashish imkoniyatlari",
        "Mobil qurilmalarda ko'rish",
      ],
      limitations: [
        "Premium shablonlar mavjud emas",
        "Logo qo'shish imkoni yo'q",
        "Faqat WhatsApp orqali ulashish",
      ],
      buttonText: "Bepul Boshlash",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Ko'pchilik tanlovi",
      icon: Star,
      color: "bg-purple-500",
      price: {
        monthly: 29000,
        yearly: 290000,
      },
      features: [
        "Cheksiz taklifnoma yaratish",
        "15+ premium shablon",
        "Kengaytirilgan RSVP",
        "Cheksiz mehmonlar",
        "Barcha ijtimoiy tarmoqlarda ulashish",
        "QR kod yaratish",
        "PDF yuklab olish",
        "Mehmon ro'yxatini boshqarish",
        "SMS xabarnomalar",
        "Maxsus ranglar va shriftlar",
        "Telegram bot integratsiyasi",
      ],
      buttonText: "Premium Sotib Olish",
      popular: true,
    },
    {
      id: "business",
      name: "Biznes",
      description: "Tadbir tashkilotchilari uchun",
      icon: Crown,
      color: "bg-yellow-500",
      price: {
        monthly: 99000,
        yearly: 990000,
      },
      features: [
        "Premium rejadagi barcha imkoniyatlar",
        "O'z logongizni qo'shish",
        "Maxsus domeningiz (mycompany.uz)",
        "Kengaytirilgan statistika",
        "Mehmonlar uchun survey",
        "Email marketing integratsiyasi",
        "API kirish",
        "Prioritetli texnik yordam",
        "Mehmonlar uchun menu tanlash",
        "Maxsus dizayn yaratish xizmati",
        "Multi-event boshqaruvi",
      ],
      buttonText: "Biznes Rejani Tanlash",
      popular: false,
    },
  ];

  const mainFeatures = [
    {
      icon: Palette,
      title: "Chiroyli Shablonlar",
      description: "15+ professional shablon va cheksiz personallashtirish imkoniyatlari",
      features: ["Zamonaviy dizaynlar", "Ranglar va shriftlar", "Maxsus logotip", "Mobil uchun optimallashtirilgan"],
    },
    {
      icon: Users,
      title: "Mehmon Boshqaruvi",
      description: "RSVP javoblarini kuzatib boring va mehmon ro'yxatini oson boshqaring",
      features: ["RSVP kuzatuvi", "Mehmon kategoriyalari", "Avtomatik eslatmalar", "CSV export"],
    },
    {
      icon: Share2,
      title: "Kuchli Ulashish",
      description: "Taklifnomani barcha ijtimoiy tarmoqlarda va messenger'larda ulashing",
      features: ["WhatsApp, Telegram", "Facebook, Instagram", "QR kod", "Direct link"],
    },
    {
      icon: BarChart3,
      title: "Real-time Statistika",
      description: "Taklifnomangiz qanchalik ko'rilganini va javoblar statistikasini kuzatib boring",
      features: ["Ko'rishlar soni", "RSVP statistikasi", "Geografik ma'lumotlar", "Haftalik hisobotlar"],
    },
    {
      icon: Smartphone,
      title: "Mobil Optimizatsiya",
      description: "Barcha qurilmalarda mukammal ko'rinish va tez yuklash",
      features: ["Responsive dizayn", "Tez yuklash", "Offline ko'rish", "Touch friendly"],
    },
    {
      icon: Shield,
      title: "Xavfsizlik va Maxfiylik",
      description: "Ma'lumotlaringiz himoyalangan va xavfsiz saqlanadi",
      features: ["SSL shifrlash", "GDPR muvofiq", "Ma'lumotlar backup", "Spam himoyasi"],
    },
  ];

  const additionalFeatures = [
    {
      icon: Calendar,
      title: "Event Boshqaruvi",
      description: "Bir nechta tadbirni boshqaring va taqvim integratsiyasi",
    },
    {
      icon: Bell,
      title: "Smart Bildirishnomalar",
      description: "Avtomatik eslatmalar va RSVP yangilanishlari",
    },
    {
      icon: Camera,
      title: "Media Galereya",
      description: "Rasmlar va videolarni taklifnomaga qo'shing",
    },
    {
      icon: FileText,
      title: "PDF Export",
      description: "Taklifnomani PDF formatda yuklab oling va bosib chiqaring",
    },
    {
      icon: QrCode,
      title: "QR Kod Generator",
      description: "Tez kirish uchun QR kod yarating",
    },
    {
      icon: Mail,
      title: "Email Integratsiya",
      description: "Avtomatik email yuborish va eslatmalar",
    },
    {
      icon: MessageSquare,
      title: "Mehmon Xabarlari",
      description: "Mehmonlardan tilak va tabriklar qabul qiling",
    },
    {
      icon: Code,
      title: "API Kirish",
      description: "Developer'lar uchun REST API",
    },
    {
      icon: Globe,
      title: "Ko'p Tillar",
      description: "O'zbek, Rus, Ingliz tillarida",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            Barcha Kerakli
            <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Imkoniyatlar Bir Joyda
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional taklifnomalar yaratish uchun eng zamonaviy vositalar va imkoniyatlar.
            Bepul rejadan boshlab, biznes darajasigacha.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="card-modern p-8 hover-lift animate-slide-up transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 hover-scale transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Qo'shimcha Imkoniyatlar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional darajadagi taklifnomalar uchun maxsus vositalar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="card-modern p-6 text-center hover-lift animate-fade-in transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto hover-scale transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Plans - Same as in Pricing page */}
        <div className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Sizga Mos Rejani Tanlang
            </h2>
            <p className="text-lg text-muted-foreground">
              Har qanday ehtiyoj uchun moslashtirilgan tariflar
            </p>

            {/* Yearly/Monthly Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span
                className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Oylik
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isYearly ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                    isYearly ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Yillik
              </span>
              {isYearly && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  20% chegirma
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = isYearly ? plan.price.yearly : plan.price.monthly;
              const originalPrice = isYearly ? plan.price.monthly * 12 : null;

              return (
                <div
                  key={plan.id}
                  className={`relative card-modern p-8 hover-lift transition-all duration-300 animate-slide-up ${
                    plan.popular ? "ring-2 ring-primary shadow-xl scale-105 hover:scale-110" : "hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white px-3 py-1">
                        ⭐ Mashhur tanlov
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center mb-4 mx-auto hover-scale transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {price === 0 ? "Bepul" : `${price.toLocaleString()}`}
                      </span>
                      {price > 0 && (
                        <span className="text-muted-foreground">
                          so'm/{isYearly ? "yil" : "oy"}
                        </span>
                      )}
                    </div>
                    {isYearly && originalPrice && price > 0 && (
                      <p className="text-sm text-muted-foreground line-through mt-1">
                        {originalPrice.toLocaleString()} so'm/yil
                      </p>
                    )}
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Imkoniyatlar:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <span className="w-4 h-4 text-red-500">✕</span>
                        Cheklovlar:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-4 h-4 text-red-500 mt-0.5">✕</span>
                            <span className="text-sm text-muted-foreground">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className={`w-full hover-lift transition-all ${
                      plan.popular ? "primary-gradient animate-glow" : "hover:border-primary hover:text-primary"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/register">{plan.buttonText}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-12 text-white animate-slide-up hover-lift transition-all duration-300">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Bugun Professional Taklifnoma Yarating!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Barcha imkoniyatlardan foydalaning va unutilmas taklifnoma yarating.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="px-8 py-4 text-lg rounded-xl"
            >
              <Link to="/register">
                Bepul Boshlash
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-8 py-4 text-lg rounded-xl border-white text-white hover:bg-white hover:text-primary"
            >
              <Link to="/templates">Shablonlarni Ko'rish</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
