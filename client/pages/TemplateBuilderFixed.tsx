import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { saveTemplateToSupabase } from "@/lib/templateSaver";
import {
  ArrowLeft,
  Save,
  Eye,
  Palette,
  Type,
  Layout,
  RotateCcw,
  Sparkles,
  Loader2,
  Check,
  X,
  Monitor,
  Smartphone,
  Heart,
  Star,
  Settings,
  Download,
  Share2,
  Zap,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";

interface TemplateConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  layout: {
    style: "classic" | "modern" | "elegant" | "rustic" | "luxury";
    spacing: number;
    borderRadius: number;
    shadowIntensity: number;
    padding: number;
  };
  animations: {
    enabled: boolean;
    type: "fade" | "slide" | "scale" | "bounce";
    duration: number;
  };
}

interface InvitationData {
  templateName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  customMessage: string;
}

export default function TemplateBuilder() {
  const { user, session, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [fullScreenPreview, setFullScreenPreview] = useState(false);

  // Template data for real-time preview
  const [templateData, setTemplateData] = useState<InvitationData>({
    templateName: "Yangi Shablon",
    groomName: "Jahongir",
    brideName: "Sarvinoz",
    weddingDate: "15 Iyun, 2024",
    weddingTime: "16:00",
    venue: "Atirgul Bog'i",
    address: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
    customMessage:
      "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
  });

  const [config, setConfig] = useState<TemplateConfig>({
    colors: {
      primary: "hsl(220, 91%, 56%)",
      secondary: "hsl(220, 14%, 96%)",
      accent: "hsl(220, 91%, 66%)",
      background: "hsl(0, 0%, 100%)",
      text: "hsl(224, 71%, 4%)",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      accent: "Dancing Script",
    },
    layout: {
      style: "elegant",
      spacing: 24,
      borderRadius: 16,
      shadowIntensity: 12,
      padding: 32,
    },
    animations: {
      enabled: true,
      type: "fade",
      duration: 0.5,
    },
  });

  const saveTemplate = async () => {
    console.log("🚀 Starting template save process...");
    
    // Clear any existing errors
    setError("");
    setSuccess("");
    setLoading(true);

    // Use the dedicated template saver utility
    const result = await saveTemplateToSupabase(user, templateData, config);

    if (result.success) {
      setSuccess("Shablon muvaffaqiyatli saqlandi!");
      
      // Navigate to templates page after success
      setTimeout(() => {
        navigate("/templates");
      }, 1500);
    } else {
      if (result.data) {
        // Saved to localStorage as fallback
        setSuccess("Shablon mahalliy xotiraga saqlandi");
      } else {
        setError(result.error || "Shablon saqlashda xatolik");
      }
    }

    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen hero-gradient">
        {/* Beautiful Header */}
        <nav className="bg-background/90 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-muted transition-colors"
              >
                <Link to="/templates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Shablonlar
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-foreground">
                    Shablon Yaratuvchi
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Real-time oldindan ko'rish
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setFullScreenPreview(true)}
                variant="outline"
                size="sm"
                className="hover:bg-muted"
              >
                <Monitor className="w-4 h-4 mr-2" />
                To'liq Ekran
              </Button>
              <Button
                onClick={saveTemplate}
                disabled={loading}
                className="primary-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Saqlash
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50/80 shadow-sm">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50/80 shadow-sm">
              <X className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
              <div className="card-modern p-4 lg:p-5 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Shablon Ma'lumotlari
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="templateName"
                      className="text-sm font-medium"
                    >
                      Shablon Nomi
                    </Label>
                    <Input
                      id="templateName"
                      value={templateData.templateName}
                      onChange={(e) =>
                        setTemplateData(prev => ({
                          ...prev,
                          templateName: e.target.value
                        }))
                      }
                      placeholder="Mening ajoyib shablonim"
                      className="mt-1 border-border focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="groomName"
                        className="text-sm font-medium"
                      >
                        Kuyov Ismi
                      </Label>
                      <Input
                        id="groomName"
                        value={templateData.groomName}
                        onChange={(e) =>
                          setTemplateData(prev => ({
                            ...prev,
                            groomName: e.target.value
                          }))
                        }
                        className="mt-1 border-border focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="brideName"
                        className="text-sm font-medium"
                      >
                        Kelin Ismi
                      </Label>
                      <Input
                        id="brideName"
                        value={templateData.brideName}
                        onChange={(e) =>
                          setTemplateData(prev => ({
                            ...prev,
                            brideName: e.target.value
                          }))
                        }
                        className="mt-1 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-border shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-heading text-lg xl:text-xl font-semibold text-foreground flex items-center gap-3">
                      <Eye className="w-5 h-5 xl:w-6 xl:h-6 text-primary" />
                      Jonli Oldindan Ko'rish
                    </h2>
                    <div className="flex items-center gap-3">
                      <Button
                        variant={
                          previewDevice === "desktop" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                        className="h-9 w-9 lg:h-10 lg:w-10 p-0"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={
                          previewDevice === "mobile" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                        className="h-9 w-9 lg:h-10 lg:w-10 p-0"
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4 md:p-6 bg-gradient-to-br from-muted/30 to-card min-h-[250px] md:min-h-[280px] lg:min-h-[300px] xl:min-h-[320px] flex items-center justify-center">
                    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                      {/* Simple preview */}
                      <div 
                        className="w-full mx-auto transition-all duration-500 p-8 rounded-lg shadow-lg"
                        style={{
                          backgroundColor: config.colors.background,
                          color: config.colors.text,
                          fontFamily: config.fonts.body,
                          borderRadius: `${config.layout.borderRadius}px`,
                        }}
                      >
                        <div className="text-center space-y-4">
                          <h1 
                            className="text-2xl font-bold"
                            style={{ 
                              color: config.colors.primary,
                              fontFamily: config.fonts.heading 
                            }}
                          >
                            {templateData.groomName}
                          </h1>
                          <div 
                            className="text-3xl"
                            style={{ 
                              color: config.colors.accent,
                              fontFamily: config.fonts.accent 
                            }}
                          >
                            &
                          </div>
                          <h1 
                            className="text-2xl font-bold"
                            style={{ 
                              color: config.colors.primary,
                              fontFamily: config.fonts.heading 
                            }}
                          >
                            {templateData.brideName}
                          </h1>
                          <p style={{ color: config.colors.secondary }}>
                            {templateData.weddingDate} - {templateData.weddingTime}
                          </p>
                          <p style={{ color: config.colors.text }}>
                            {templateData.venue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3 text-green-500 animate-pulse" />
                    Real vaqtda yangilanadi •{" "}
                    {previewDevice === "desktop" ? "Kompyuter" : "Mobil"}{" "}
                    ko'rinish
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
