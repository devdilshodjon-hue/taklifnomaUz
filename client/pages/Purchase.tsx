import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Star,
  Crown,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";

export default function Purchase() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "premium";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const plans = {
    basic: {
      name: "Asosiy",
      price: "Bepul",
      icon: Heart,
      color: "bg-blue-500",
      features: [
        "3 ta taklifnoma yaratish",
        "5 ta asosiy shablon",
        "Oddiy RSVP funksiyasi",
        "Maksimal 50 ta mehmon",
      ],
    },
    premium: {
      name: "Premium",
      price: "29,000 so'm/oy",
      icon: Star,
      color: "bg-purple-500",
      features: [
        "Cheksiz taklifnoma yaratish",
        "15+ premium shablon",
        "Kengaytirilgan RSVP",
        "Cheksiz mehmonlar",
        "QR kod yaratish",
        "PDF yuklab olish",
      ],
    },
    business: {
      name: "Biznes",
      price: "99,000 so'm/oy",
      icon: Crown,
      color: "bg-yellow-500",
      features: [
        "Premium rejadagi barcha imkoniyatlar",
        "O'z logongizni qo'shish",
        "Maxsus domeningiz",
        "Kengaytirilgan statistika",
        "API kirish",
        "Prioritetli texnik yordam",
      ],
    },
  };

  const selectedPlan = plans[planId as keyof typeof plans] || plans.premium;
  const Icon = selectedPlan.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create WhatsApp message
    const whatsappMessage = `
Salom! TaklifNoma platformasidan ${selectedPlan.name} rejasini sotib olishni xohlayman.

📋 Reja ma'lumotlari:
• Reja: ${selectedPlan.name}
• Narx: ${selectedPlan.price}

👤 Mening ma'lumotlarim:
• To'liq ism: ${formData.fullName}
• Email: ${formData.email}
• Telefon: ${formData.phone}
${formData.companyName ? `• Kompaniya: ${formData.companyName}` : ""}

💬 Qo'shimcha ma'lumot:
${formData.message || "Yo'q"}

Iltimos, to'lov jarayoni haqida ma'lumot bering.
    `.trim();

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/998995340313?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation showBackButton />
        <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
              So'rov Yuborildi!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tez orada siz bilan bog'lanamiz va to'lov jarayonini tushuntiramiz.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Shuningdek bizga murojaat qilishingiz mumkin:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://wa.me/998995340313", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("tel:+998995340313", "_blank")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Qo'ng'iroq qilish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("mailto:dev.dilshodjon@gmail.com", "_blank")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
            <div className="mt-8">
              <Button asChild className="button-modern">
                <Link to="/dashboard">Dashboard ga qaytish</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Rejani Sotib Olish
          </h1>
          <p className="text-lg text-muted-foreground">
            Bizning mutaxassislarimiz siz bilan bog'lanib, to'lov jarayonini
            tushuntirishadi
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Selected Plan Info */}
          <div className="space-y-8">
            <div className="card-modern p-8">
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 ${selectedPlan.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {selectedPlan.name} Rejasi
                </h2>
                <div className="text-3xl font-bold text-primary mb-4">
                  {selectedPlan.price}
                </div>
                {planId === "premium" && (
                  <Badge className="bg-primary text-white">
                    ⭐ Mashhur tanlov
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Imkoniyatlar:
                </h3>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card-modern p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Bog'lanish ma'lumotlari
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    +998 99 534 03 13
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    dev.dilshodjon@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    @torex_dev
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Dushanba-Yakshanba: 9:00-21:00
                  </span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="card-modern p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Xavfsizlik Kafolati
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Barcha to'lovlar xavfsiz</li>
                <li>• Click, Payme, UzCard qabul qilinadi</li>
                <li>• Ma'lumotlar himoyalangan</li>
                <li>• 30 kun ichida to'lov qaytarish</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              Ma'lumotlaringizni qoldiring
            </h2>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Users className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Formani to'ldirgandan so'ng bizning mutaxassis siz bilan
                bog'lanadi va to'lov jarayonini tushuntiradi.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="font-medium">
                    To'liq ismingiz *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ismingiz va familiyangiz"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-medium">
                    Telefon raqam *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-medium">
                  Email manzil *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sizning@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="companyName" className="font-medium">
                  Kompaniya nomi (ixtiyoriy)
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Kompaniya yoki tashkilot nomi"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="font-medium">
                  Qo'shimcha ma'lumot (ixtiyoriy)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Bizga aytmoqchi bo'lgan narsangiz bor bo'lsa..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full button-modern text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Mutaxassis bilan bog'lanish
                </Button>

                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link to="/pricing">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Rejalarga qaytish
                    </Link>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
