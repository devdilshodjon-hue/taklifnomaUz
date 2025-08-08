import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Users,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Juda Tez",
      description: "3 daqiqadan kamroq vaqtda chiroyli taklifnomalar yarating",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Tezda Ulashing",
      description: "Bitta havola, cheksiz mehmon, tezkor javoblar",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Aqlli Boshqaruv",
      description: "Javoblarni kuzating va mehmonlarni oson boshqaring",
    },
  ];

  const templates = [
    { name: "Klassik", emoji: "💝", popular: true },
    { name: "Zamonaviy", emoji: "✨", popular: false },
    { name: "Nafis", emoji: "🌸", popular: false },
    { name: "Oddiy", emoji: "🤍", popular: true },
  ];

  const testimonials = [
    {
      name: "Sarvinoz va Jahongir",
      text: "To'yimiz uchun ajoyib! Vaqt va pulimizni juda ko'p tejadi.",
      rating: 5,
    },
    {
      name: "Mohira va Davron",
      text: "Mehmonlarimiz raqamli taklifnomalarni juda yoqtirishdi. Ishlatish juda oson!",
      rating: 5,
    },
    {
      name: "Maryam va Alisher",
      text: "Chiroyli shablonlar va muammosiz javob jarayoni.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 animate-slide-in-left">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center hover-scale">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                TaklifNoma
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 animate-fade-in delay-200">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                Imkoniyatlar
              </a>
              <Link
                to="/templates"
                className="text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                Shablonlar
              </Link>
              <Link
                to="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                Narxlar
              </Link>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Button variant="ghost" asChild className="hover-scale">
                <Link to="/login">Kirish</Link>
              </Button>
              <Button asChild className="button-modern hover-lift">
                <Link to="/register">
                  Boshlash
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              10,000 dan ortiq er-xotin TaklifNoma ga ishonadi
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              To'y Taklifnomalari
              <span className="text-gradient block">Juda Oson</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Bir necha daqiqada ajoyib to'y taklifnomalarini yarating, sozlang
              va ulashing. Dizayn tajribasi shart emas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                asChild
                className="primary-gradient px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/create">
                  Taklifnoma Yaratish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="px-8 py-4 text-lg rounded-xl"
              >
                <Link to="#demo">Namunani Ko'rish</Link>
              </Button>
            </div>

            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-theme-success" />
                Bepul boshlang
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-theme-success" />
                Karta kerak emas
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-theme-success" />3 daqiqada
                tayyor
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-theme-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mukammal taklifnomalar uchun barcha imkoniyatlar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Yaratishdan nishonlashgacha, biz barcha texnik tafsilotlarni hal
              qilamiz, siz faqat o'zingizning maxsus kuningizga e'tibor
              qarating.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: "📊",
                title: "Aniq Statistika",
                desc: "Kim ko'rdi, kim javob berdi - barchasi batafsil",
              },
              {
                icon: "🔗",
                title: "QR Kodlar",
                desc: "Kartalar uchun QR kod yaratish va bosib chiqarish",
              },
              {
                icon: "💾",
                title: "PDF Yuklab Olish",
                desc: "Professional PDF formatda saqlash va bosib chiqarish",
              },
              {
                icon: "🔔",
                title: "SMS Xabarnomalar",
                desc: "Mehmonlarga avtomatik xabar jo'natish",
              },
              {
                icon: "🎨",
                title: "Maxsus Dizayn",
                desc: "O'z logongiz va brendingizni qo'shing",
              },
              {
                icon: "📱",
                title: "Mobil Ilovalar",
                desc: "Android va iOS ilovalarida mukammal ko'rinish",
              },
              {
                icon: "🌐",
                title: "Ko'p Tillar",
                desc: "O'zbek, rus va ingliz tillarida qo'llab-quvvatlash",
              },
              {
                icon: "🛡️",
                title: "Xavfsizlik",
                desc: "Ma'lumotlaringiz SSL sertifikat bilan himoyalangan",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-heading font-semibold text-foreground mb-2 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Process Steps */}
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl font-bold text-foreground mb-4">
              3 Bosqichda Taklifnoma Yarating
            </h3>
            <p className="text-lg text-muted-foreground">
              Juda oson va tez jarayon - bir necha daqiqada tayyor!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Shablon Tanlang",
                description:
                  "15+ dan ortiq chiroyli shablonlar orasidan o'zingizga yoqganini tanlang",
                color: "bg-blue-500",
              },
              {
                step: "02",
                title: "Ma'lumotlarni Kiriting",
                description:
                  "Kelin-kuyov ismi, sana, joy va boshqa muhim ma'lumotlarni yozing",
                color: "bg-purple-500",
              },
              {
                step: "03",
                title: "Ulashing va Kuzating",
                description:
                  "Taklifnomani ulashing va mehmonlar javoblarini real vaqtda kuzatib boring",
                color: "bg-green-500",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="card-modern p-8 text-center">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <h4 className="font-heading text-xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Har qanday uslub uchun chiroyli shablonlar
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional dizaynlarimizning tanlanma kolleksiyasidan tanlang
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {templates.map((template, index) => (
              <div key={index} className="relative group">
                <div className="card-modern p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl mb-4">{template.emoji}</div>
                  <h3 className="font-heading font-semibold text-foreground">
                    {template.name}
                  </h3>
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-theme-accent text-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Mashhur
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild className="button-modern">
              <Link to="/templates">
                Barcha Shablonlarni Ko'rish
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Har Qanday Byudjet Uchun Mos Narx
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bepul rejadan boshlab, premium imkoniyatlargacha. Faqat kerakli
              narsangiz uchun to'lang.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Asosiy",
                price: "Bepul",
                features: [
                  "3 ta taklifnoma",
                  "5 ta shablon",
                  "50 ta mehmon",
                  "Asosiy RSVP",
                ],
                popular: false,
                color: "border-border",
              },
              {
                name: "Premium",
                price: "29,000 so'm/oy",
                features: [
                  "Cheksiz taklifnoma",
                  "15+ shablon",
                  "Cheksiz mehmonlar",
                  "SMS xabarnomalar",
                  "PDF yuklab olish",
                ],
                popular: true,
                color: "border-primary ring-2 ring-primary",
              },
              {
                name: "Biznes",
                price: "99,000 so'm/oy",
                features: [
                  "Premium + API",
                  "Maxsus dizayn",
                  "O'z domeningiz",
                  "Prioritetli yordam",
                ],
                popular: false,
                color: "border-border",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`card-modern p-8 ${plan.color} relative ${plan.popular ? "scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Mashhur
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-foreground mb-6">
                    {plan.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "primary-gradient" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Asosiy" ? "Bepul Boshlash" : "Tanlash"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">
                Barcha Narxlarni Ko'rish
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-theme-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Butun dunyo bo'ylab er-xotinlar sevadi
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-modern p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-theme-accent text-theme-accent"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-medium text-foreground">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Mukammal taklifnomangizni yaratishga tayyormisiz?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            TaklifNoma bilan to'y rejalarini osonlashtirgan minglab
            er-xotinlarga qo'shiling.
          </p>
          <Button
            size="lg"
            asChild
            className="primary-gradient px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to="/create">
              Hoziroq Yaratishni Boshlang
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-theme-gray-light/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                TaklifNoma
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              Sizning maxsus kuningizni yanada maxsus qilish, har bir taklifnoma
              bilan.
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Maxfiylik
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Shartlar
              </Link>
              <Link
                to="/contact"
                className="hover:text-foreground transition-colors"
              >
                Aloqa
              </Link>
              <Link
                to="/help"
                className="hover:text-foreground transition-colors"
              >
                Yordam
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
