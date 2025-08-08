import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation showBackButton />

      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Biz Bilan Bog'laning
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Savollaringiz bormi? Yordam kerakmi? Biz sizga yordam berishga doimo
            tayyormiz!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              Xabar Jo'nating
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ismingiz
                  </label>
                  <Input placeholder="Ismingizni kiriting" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input type="email" placeholder="example@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Telefon raqami
                </label>
                <Input placeholder="+998 90 123 45 67" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mavzu
                </label>
                <Input placeholder="Xabar mavzusi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Xabar matni
                </label>
                <Textarea
                  placeholder="Xabaringizni batafsil yozing..."
                  className="min-h-32"
                />
              </div>
              <Button className="w-full primary-gradient">
                Xabar Jo'natish
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="card-modern p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                Aloqa Ma'lumotlari
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email
                    </h3>
                    <p className="text-muted-foreground">
                      support@taklifnoma.uz
                    </p>
                    <p className="text-muted-foreground">info@taklifnoma.uz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Telefon
                    </h3>
                    <p className="text-muted-foreground">+998 90 123 45 67</p>
                    <p className="text-muted-foreground">+998 91 234 56 78</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Telegram
                    </h3>
                    <p className="text-muted-foreground">@taklifnoma_support</p>
                    <p className="text-muted-foreground">@taklifnoma_uz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Manzil
                    </h3>
                    <p className="text-muted-foreground">
                      Toshkent sh., Yunusobod tumani
                      <br />
                      IT Park, 2-qavat, 205-xona
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Ish vaqti
                    </h3>
                    <p className="text-muted-foreground">
                      Dushanba - Juma: 9:00 - 18:00
                      <br />
                      Shanba: 10:00 - 15:00
                      <br />
                      Yakshanba: Dam olish kuni
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Links */}
            <div className="card-modern p-8">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Tez-tez So'raladigan Savollar
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ko'plab savollar allaqachon javoblanган. Avval FAQ bo'limini
                  tekshiring:
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/pricing#faq">FAQ Bo'limiga O'tish</a>
                </Button>
              </div>
            </div>

            {/* Live Chat */}
            <div className="card-modern p-8">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Tezkor Yordam
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Darhol yordam kerakmi? Bizning Telegram botimiz orqali 24/7
                yordam oling.
              </p>
              <Button className="w-full primary-gradient" asChild>
                <a
                  href="https://t.me/taklifnoma_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram Botni Ochish
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
