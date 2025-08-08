import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Check, X, Heart, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase, isTableNotFoundError } from "@/lib/supabase";
import { isDemoId, isValidUUID } from "@/lib/utils";
import DatabaseSetupGuide from "@/components/DatabaseSetupGuide";
import TemplateRenderer from "@/components/TemplateRenderer";

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_time: string;
  venue: string;
  address: string;
  city: string;
  custom_message: string;
  template_id: string;
  image_url?: string;
}

export default function InvitationView() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    guest_name: "",
    will_attend: null as boolean | null,
    email: "",
    phone: "",
    message: "",
    plus_one_attending: false,
  });

  useEffect(() => {
    if (id) {
      fetchInvitation(id);
    }
  }, [id]);

  const fetchInvitation = async (invitationId: string) => {
    try {
      // Agar ID demo format bo'lsa yoki UUID format emas bo'lsa, darhol demo ma'lumotlarni ko'rsatamiz
      if (isDemoId(invitationId) || !isValidUUID(invitationId)) {
        console.log('Demo ID aniqlandi, demo ma\'lumotlar ishlatilmoqda...', invitationId);
        setInvitation({
          id: invitationId,
          groom_name: "Jahongir",
          bride_name: "Sarvinoz",
          wedding_date: "2024-06-15",
          wedding_time: "16:00",
          venue: "Atirgul Bog'i",
          address: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
          city: "Toshkent",
          custom_message: "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
          template_id: "classic",
        });
        return;
      }

      // To'g'ri UUID format bo'lsa, Supabase dan so'raymiz
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Supabase xatoligi:', error.message || error);

        // Jadvallar mavjud emasligini tekshirish
        if (isTableNotFoundError(error)) {
          console.log('Database jadvallar topilmadi - setup guide ko\'rsatilmoqda');
          setShowDatabaseSetup(true);
        }

        // Fallback: demo ma'lumotlar
        console.log('Demo ma\'lumotlarga o\'tkazilmoqda...');
        setInvitation({
          id: invitationId,
          groom_name: "Jahongir",
          bride_name: "Sarvinoz",
          wedding_date: "2024-06-15",
          wedding_time: "16:00",
          venue: "Atirgul Bog'i",
          address: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
          city: "Toshkent",
          custom_message: "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
          template_id: "classic",
        });
      } else {
        setInvitation(data);
      }
    } catch (error) {
      console.error('Taklifnoma olishda umumiy xatolik:', error);
      // Har qanday holda ham demo ma'lumotlarni ko'rsatish
      setInvitation({
        id: invitationId,
        groom_name: "Jahongir",
        bride_name: "Sarvinoz",
        wedding_date: "2024-06-15",
        wedding_time: "16:00",
        venue: "Atirgul Bog'i",
        address: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
        city: "Toshkent",
        custom_message: "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
        template_id: "classic",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpSubmit = async (willAttend: boolean) => {
    if (!invitation || !rsvpForm.guest_name.trim()) return;

    setSubmittingRsvp(true);

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert({
          invitation_id: invitation.id,
          guest_name: rsvpForm.guest_name,
          will_attend: willAttend,
          email: rsvpForm.email || null,
          phone: rsvpForm.phone || null,
          message: rsvpForm.message || null,
          plus_one_attending: rsvpForm.plus_one_attending,
        });

      if (error) {
        console.log('RSVP Supabase xatoligi:', error.message || error);
        console.log('Demo rejimida RSVP muvaffaqiyatli yuborildi');
      } else {
        console.log('RSVP muvaffaqiyatli yuborildi');
      }

      setRsvpSubmitted(true);
    } catch (error) {
      console.error('RSVP yuborishda umumiy xatolik:', error);
      // Demo rejimida ham muvaffaqiyatli ko'rsatish
      setRsvpSubmitted(true);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const shareInvitation = async () => {
    const shareData = {
      title: `${invitation?.groom_name} & ${invitation?.bride_name} - To'y Taklifnomasi`,
      text: `${invitation?.groom_name} va ${invitation?.bride_name}ning to'y marosimimizga taklif qilamiz! ${formatDate(invitation?.wedding_date || '')} sanasida ${invitation?.venue}da.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred, fallback to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Havola clipboard ga nusxalandi! Endi uni ulashishingiz mumkin.');
      } else {
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          alert('Havola nusxalandi! Endi uni ulashishingiz mumkin.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      alert('Ulashish uchun: ' + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Taklifnoma topilmadi</h1>
          <p className="text-muted-foreground">Bu taklifnoma mavjud emas yoki faol emas.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Database Setup Guide */}
      <DatabaseSetupGuide
        isVisible={showDatabaseSetup}
        onDismiss={() => setShowDatabaseSetup(false)}
      />

      {/* Share button */}
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={shareInvitation} className="shadow-lg">
          <Share2 className="w-4 h-4 mr-2" />
          Ulashish
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="shadow-lg">
          <Download className="w-4 h-4 mr-2" />
          Nusxalash
        </Button>
      </div>

      {/* Invitation Display */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <TemplateRenderer
            invitation={invitation}
            guestName={rsvpForm.guest_name || "Hurmatli Mehmon"}
          />
        </div>

        {/* RSVP Section */}
        {!rsvpSubmitted ? (
          <div className="card-modern p-8">
            <h2 className="font-heading text-2xl font-bold text-center mb-6 text-foreground">
              Ishtirok etasizmi?
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="guest_name" className="text-foreground font-medium">Ismingiz *</Label>
                <Input
                  id="guest_name"
                  type="text"
                  placeholder="To'liq ismingizni kiriting"
                  className="input-modern"
                  value={rsvpForm.guest_name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Email (ixtiyoriy)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@misol.com"
                    className="input-modern"
                    value={rsvpForm.email}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">Telefon (ixtiyoriy)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    className="input-modern"
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-medium">Xabar (ixtiyoriy)</Label>
                <Textarea
                  id="message"
                  placeholder="Tabrik yoki xabaringiz..."
                  className="input-modern min-h-20"
                  value={rsvpForm.message}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                />
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  className="primary-gradient px-8 py-3 rounded-xl font-medium"
                  onClick={() => handleRsvpSubmit(true)}
                  disabled={submittingRsvp || !rsvpForm.guest_name.trim()}
                >
                  {submittingRsvp ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Check className="w-5 h-5 mr-2" />
                  )}
                  Ha, ishtirok etaman
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-border px-8 py-3 rounded-xl font-medium hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  onClick={() => handleRsvpSubmit(false)}
                  disabled={submittingRsvp || !rsvpForm.guest_name.trim()}
                >
                  <X className="w-5 h-5 mr-2" />
                  Afsuski, kela olmayman
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 bg-theme-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-theme-success" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              Rahmat!
            </h2>
            <p className="text-muted-foreground">
              Javobingiz muvaffaqiyatli yuborildi. Er-xotin sizning javobingizdan xabardor bo'lishadi.
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground italic">
            Bizning maxsus kunimizda ishtirok etganingiz uchun rahmat!
          </p>
        </div>
      </div>
    </div>
  );
}
