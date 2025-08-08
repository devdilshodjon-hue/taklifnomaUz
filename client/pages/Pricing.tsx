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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

export default function Pricing() {
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

  const features = [
    {
      icon: Zap,
      title: "Tez va oson",
      description: "Bir necha daqiqada professional taklifnoma yarating",
    },
    {
      icon: Users,
      title: "Mehmon boshqaruvi",
      description:
        "RSVP javoblarini kuzatib boring va mehmon ro'yxatini boshqaring",
    },
    {
      icon: Share2,
      title: "Oson ulashish",
      description: "WhatsApp, Telegram, Facebook orqali bir bosishda ulashing",
    },
    {
      icon: Download,
      title: "Yuklab olish",
      description: "Taklifnomangizni PDF sifatida saqlang va bosib chiqaring",
    },
    {
      icon: Shield,
      title: "Xavfsizlik",
      description: "Ma'lumotlaringiz himoyalangan va xavfsiz saqlanadi",
    },
    {
      icon: Headphones,
      title: "24/7 yordam",
      description: "Texnik yordam guruhi doimo yordamga tayyor",
    },
  ];

  const testimonials = [
    {
      name: "Feruza Karimova",
      wedding: "Feruza & Bobur",
      date: "2024 yil mart",
      comment:
        "TaklifNoma orqali ajoyib taklifnoma yaratdik. Barcha mehmonlar dizaynni juda yoqtirishdi!",
      rating: 5,
    },
    {
      name: "Dilshod Toshmatov",
      wedding: "Dilshod & Nargiza",
      date: "2024 yil aprel",
      comment:
        "RSVP funksiyasi juda foydali bo'ldi. Mehmonlar javoblarini osongina kuzatib bordim.",
      rating: 5,
    },
    {
      name: "Madina Aliyeva",
      wedding: "Madina & Sanjar",
      date: "2024 yil may",
      comment:
        "Premium rejada juda ko'p chiroyli shablonlar bor. Hech qayerdan bunday xizmat topa olmadim.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Bepul rejada qancha taklifnoma yarata olaman?",
      answer:
        "Bepul rejada 3 ta taklifnoma yarata olasiz. Agar ko'proq kerak bo'lsa, Premium yoki Biznes rejasini tanlashingiz mumkin.",
    },
    {
      question: "Taklifnomamni qanday ulasha olaman?",
      answer:
        "Taklifnomani WhatsApp, Telegram, Facebook orqali ulashish, QR kod yaratish yoki havolani nusxalash mumkin.",
    },
    {
      question: "Mehmonlar qanday javob berishlari mumkin?",
      answer:
        'Mehmonlar taklifnomadagi RSVP tugmasi orqali "Kelaman" yoki "Kela olmayman" deb javob berishlari mumkin.',
    },
    {
      question: "To'lovni qanday amalga oshiraman?",
      answer:
        "To'lovni Click, Payme, UzCard orqali xavfsiz tarzda amalga oshirishingiz mumkin.",
    },
    {
      question: "Taklifnomamni tahrirlash mumkinmi?",
      answer:
        "Ha, yaratganingizdan keyin istalgan vaqtda taklifnomani tahrirlash mumkin.",
    },
    {
      question: "Texnik yordam qanday olaman?",
      answer:
        "Telegram kanalimiz @taklifnoma_support orqali yoki email: support@taklifnoma.uz ga murojaat qilishingiz mumkin.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            Har Qanday Byudjet Uchun
            <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Taklifnoma Yaratish
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional taklifnomalar yaratish uchun eng yaxshi narxlar. Bepul
            rejadan boshlab, Premium imkoniyatlargacha.
          </p>

          {/* Yearly/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
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

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const originalPrice = isYearly ? plan.price.monthly * 12 : null;

            return (
              <div
                key={plan.id}
                className={`relative card-modern p-8 hover-lift transition-all duration-300 animate-slide-up ${
                  plan.popular
                    ? "ring-2 ring-primary shadow-xl scale-105 hover:scale-110"
                    : "hover:scale-105"
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
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
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
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-3">
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
                    plan.popular
                      ? "primary-gradient animate-glow"
                      : "hover:border-primary hover:text-primary"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link
                    to={
                      plan.id === "basic"
                        ? "/register"
                        : `/purchase?plan=${plan.id}`
                    }
                  >
                    {plan.buttonText}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Features Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Nega TaklifNoma?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional taklifnomalar yaratish uchun barcha kerakli vositalar
              bir joyda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-modern p-6 text-center hover-lift animate-fade-in transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto hover-scale transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
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

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Mijozlarimiz Aytishlari
            </h2>
            <p className="text-lg text-muted-foreground">
              Minglab couple'lar TaklifNoma orqali muvaffaqiyatli to'ylarini
              o'tkazdilar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-modern p-6 hover-lift animate-slide-up transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.wedding}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Ko'p Beriladigan Savollar
            </h2>
            <p className="text-lg text-muted-foreground">
              TaklifNoma haqida eng ko'p so'raladigan savollar va javoblar
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="card-modern hover-lift animate-fade-in transition-all duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
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

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-12 text-white animate-slide-up hover-lift transition-all duration-300">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Bugun Taklifnomangizni Yarating!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bir necha daqiqada professional taklifnoma yarating va sevimli
            odamlaringizni taklif qiling.
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
