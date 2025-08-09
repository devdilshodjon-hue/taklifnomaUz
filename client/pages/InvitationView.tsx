import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Share2, Download, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getInvitationBySlug } from "@/lib/invitationSaver";
import TemplateRenderer from "@/components/TemplateRenderer";

interface InvitationData {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_time: string | null;
  venue: string;
  address: string;
  city: string | null;
  custom_message: string | null;
  template_id: string;
  rsvp_deadline: string | null;
  custom_templates?: {
    name: string;
    colors: any;
    fonts: any;
    config: any;
  };
}

export default function InvitationView() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      loadInvitation(slug);
    }
  }, [slug]);

  const loadInvitation = async (invitationSlug: string) => {
    try {
      setLoading(true);
      setError("");

      console.log("🔍 Loading invitation with slug:", invitationSlug);
      
      const result = await getInvitationBySlug(invitationSlug);
      
      if (result.success && result.data) {
        setInvitation(result.data);
        console.log("✅ Invitation loaded:", result.data);
        
        // Record page view (optional analytics)
        recordPageView(result.data.id);
      } else {
        setError("Taklifnoma topilmadi yoki mavjud emas.");
        console.error("❌ Invitation not found:", result.error);
      }
    } catch (err: any) {
      console.error("❌ Error loading invitation:", err);
      setError("Taklifnomani yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const recordPageView = async (invitationId: string) => {
    try {
      // Optional: Record page view for analytics
      // This could be expanded to track visitor statistics
      console.log("📊 Recording page view for invitation:", invitationId);
    } catch (err) {
      console.warn("⚠️ Failed to record page view:", err);
    }
  };

  const shareInvitation = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${invitation?.groom_name} va ${invitation?.bride_name} - To'y taklifnomasi`,
          text: "Bizning to'y marosimimizga taklif qilamiz!",
          url: url,
        });
        toast.success("Taklifnoma ulashildi!");
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Havola nusxalandi!");
      } catch (err) {
        toast.error("Havolani nusxalashda xatolik");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uz-UZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    return timeString.slice(0, 5); // Remove seconds if present
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Taklifnoma yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Taklifnoma topilmadi
            </h1>
            <p className="text-slate-600 mb-4">
              {error || "Ushbu taklifnoma mavjud emas yoki o'chirilgan."}
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Bosh sahifa
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">
                {invitation.groom_name} ♥ {invitation.bride_name}
              </h1>
              <p className="text-xs text-slate-600">To'y taklifnomasi</p>
            </div>
          </div>
          <Button onClick={shareInvitation} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Ulashish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Wedding Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  To'y Ma'lumotlari
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-rose-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {formatDate(invitation.wedding_date)}
                      </p>
                      <p className="text-sm text-slate-600">To'y sanasi</p>
                    </div>
                  </div>
                  
                  {invitation.wedding_time && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {formatTime(invitation.wedding_time)}
                        </p>
                        <p className="text-sm text-slate-600">Vaqt</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {invitation.venue}
                      </p>
                      <p className="text-sm text-slate-600">
                        {invitation.address}
                        {invitation.city && `, ${invitation.city}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Message */}
            {invitation.custom_message && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Maxsus Xabar
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {invitation.custom_message}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* RSVP Deadline */}
            {invitation.rsvp_deadline && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Javob Berish Muddati
                  </h3>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    {formatDate(invitation.rsvp_deadline)}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Template Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-to-br from-white to-slate-50">
                  <TemplateRenderer
                    template={{
                      id: invitation.template_id,
                      name: invitation.custom_templates?.name || "Classic Template",
                      colors: invitation.custom_templates?.colors || {},
                      fonts: invitation.custom_templates?.fonts || {},
                      preview: "💒",
                      category: "wedding"
                    }}
                    data={{
                      id: invitation.id,
                      groom_name: invitation.groom_name,
                      bride_name: invitation.bride_name,
                      wedding_date: invitation.wedding_date,
                      wedding_time: invitation.wedding_time,
                      venue: invitation.venue,
                      address: invitation.address,
                      city: invitation.city,
                      custom_message: invitation.custom_message,
                      template_id: invitation.template_id,
                      image_url: null,
                      rsvp_deadline: invitation.rsvp_deadline,
                      is_active: true,
                      slug: slug || ""
                    }}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={shareInvitation} className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Share2 className="w-4 h-4 mr-2" />
            Taklifnomani Ulashish
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Yuklab Olish
          </Button>
        </div>
      </div>
    </div>
  );
}
