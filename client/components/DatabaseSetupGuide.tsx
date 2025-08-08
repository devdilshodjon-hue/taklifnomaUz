import { AlertCircle, Database, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DatabaseSetupGuideProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function DatabaseSetupGuide({ isVisible, onDismiss }: DatabaseSetupGuideProps) {
  const [copied, setCopied] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);

  if (!isVisible) return null;

  const sqlScript = `-- TaklifNoma database schema
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    groom_name TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    wedding_date DATE NOT NULL,
    wedding_time TIME,
    venue TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    custom_message TEXT,
    template_id TEXT NOT NULL DEFAULT 'classic',
    image_url TEXT,
    rsvp_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    plus_one BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    will_attend BOOLEAN NOT NULL,
    plus_one_attending BOOLEAN,
    message TEXT,
    email TEXT,
    phone TEXT
);

-- Row Level Security yoqish
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;`;

  const copyToClipboard = async () => {
    try {
      // Birinchi Clipboard API dan foydalanishga harakat qilamiz
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(sqlScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      // Fallback: eski execCommand usuli
      const textArea = document.createElement('textarea');
      textArea.value = sqlScript;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('execCommand nusxalash muvaffaqiyatsiz');
        }
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Clipboard ga nusxalashda xatolik:', err);
      // Foydalanuvchiga manual copy ni taklif qilamiz
      alert('Avtomatik nusxalash ishlamadi. Iltimos, matnni qo\'lda belgilab nusxalang.');
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="card-modern max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Ma'lumotlar Bazasini Sozlash
              </h2>
              <p className="text-muted-foreground">
                TaklifNoma to'liq ishlashi uchun Supabase ma'lumotlar bazasida jadvallar yaratish kerak.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-theme-warning/10 border border-theme-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-theme-warning" />
                <h3 className="font-medium text-foreground">Jadvallar topilmadi</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Supabase ma'lumotlar bazasida kerakli jadvallar mavjud emas. 
                Hozir demo rejimida ishlamoqda.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-3">Qadamlar:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Supabase Dashboard ga kiring</p>
                    <p className="text-sm text-muted-foreground">
                      <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline">
                        supabase.com/dashboard
                      </a> da loyihangizni oching
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-foreground font-medium">SQL Editor ga o'ting</p>
                    <p className="text-sm text-muted-foreground">
                      Chap menyudan "SQL Editor" ni tanlang
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-foreground font-medium">SQL kodni nusxalang va ishga tushiring</p>
                    <div className="mt-2">
                      {!showFullScript ? (
                        <div className="bg-muted p-4 rounded-lg text-sm">
                          <p className="text-muted-foreground mb-2">
                            Database yaratish uchun SQL skript tayyorlandi.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setShowFullScript(true)}
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              SQL Kodni Ko'rish
                            </Button>
                            <Button
                              onClick={copyToClipboard}
                              size="sm"
                              variant="outline"
                            >
                              {copied ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Nusxalandi!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Kodni Nusxalash
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-48 overflow-y-auto border">
                            <textarea
                              readOnly
                              value={sqlScript}
                              className="w-full h-40 bg-transparent border-none resize-none outline-none text-xs"
                              onClick={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.select();
                              }}
                            />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              onClick={copyToClipboard}
                              size="sm"
                              variant="outline"
                            >
                              {copied ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Nusxalandi!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Kodni Nusxalash
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setShowFullScript(false)}
                              size="sm"
                              variant="ghost"
                            >
                              Yashirish
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Matn maydoniga bosib, Ctrl+A va Ctrl+C bilan nusxalashingiz mumkin
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Sahifani yangilang</p>
                    <p className="text-sm text-muted-foreground">
                      Jadvallar yaratilgandan so'ng sahifani yangilang
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Demo rejimida davom etish</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ma'lumotlar bazasini hozir sozlamagan bo'lsangiz, demo rejimida ishlatishda davom etishingiz mumkin.
                Barcha ma'lumotlar vaqtincha saqlanadi.
              </p>
              <Button onClick={onDismiss} variant="outline">
                Demo da Davom Etish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
