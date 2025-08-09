import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Template data for real-time preview
  const [templateData, setTemplateData] = useState<InvitationData>({
    templateName: "Yangi Shablon",
    groomName: "Jahongir",
    brideName: "Sarvinoz",
    weddingDate: "15 Iyun, 2024",
    weddingTime: "16:00",
    venue: "Atirgul Bog'i",
    address: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
    customMessage: "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
  });

  const [config, setConfig] = useState<TemplateConfig>({
    colors: {
      primary: "#be185d",
      secondary: "#fda4af",
      accent: "#fb7185",
      background: "#fdf2f8",
      text: "#881337",
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
    },
  });

  const colorPresets = [
    {
      name: "Romantik Pushti",
      colors: {
        primary: "#be185d",
        secondary: "#fda4af",
        accent: "#fb7185",
        background: "#fdf2f8",
        text: "#881337",
      },
    },
    {
      name: "Zamonaviy Ko'k",
      colors: {
        primary: "#2563eb",
        secondary: "#60a5fa",
        accent: "#3b82f6",
        background: "#eff6ff",
        text: "#1e3a8a",
      },
    },
    {
      name: "Zarhal Oltin",
      colors: {
        primary: "#d97706",
        secondary: "#fbbf24",
        accent: "#f59e0b",
        background: "#fffbeb",
        text: "#92400e",
      },
    },
    {
      name: "Tabiat Yashil",
      colors: {
        primary: "#059669",
        secondary: "#34d399",
        accent: "#10b981",
        background: "#ecfdf5",
        text: "#064e3b",
      },
    },
    {
      name: "Hashamatli Binafsha",
      colors: {
        primary: "#7c3aed",
        secondary: "#a78bfa",
        accent: "#8b5cf6",
        background: "#f5f3ff",
        text: "#581c87",
      },
    },
    {
      name: "Klassik Qora",
      colors: {
        primary: "#1f2937",
        secondary: "#6b7280",
        accent: "#d97706",
        background: "#ffffff",
        text: "#111827",
      },
    },
  ];

  const fontOptions = [
    "Inter",
    "Poppins", 
    "Playfair Display",
    "Dancing Script",
    "Montserrat",
    "Lora",
    "Open Sans",
    "Roboto",
    "Merriweather",
    "Crimson Text",
    "Great Vibes",
    "Libre Baskerville",
  ];

  const layoutStyles = [
    {
      value: "classic",
      label: "Klassik",
      description: "An'anaviy va sodda dizayn",
      icon: "📜",
    },
    {
      value: "modern", 
      label: "Zamonaviy",
      description: "Minimalistik va zamonaviy",
      icon: "✨",
    },
    { 
      value: "elegant", 
      label: "Nafis", 
      description: "Chiroyli va nafis",
      icon: "💎",
    },
    { 
      value: "rustic", 
      label: "Tabiy", 
      description: "Tabiy va issiq",
      icon: "🌿",
    },
    { 
      value: "luxury", 
      label: "Hashamatli", 
      description: "Dabdabali va noyob",
      icon: "👑",
    },
  ];

  const handleColorChange = (
    colorType: keyof TemplateConfig["colors"],
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value,
      },
    }));
  };

  const handleFontChange = (
    fontType: keyof TemplateConfig["fonts"],
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value,
      },
    }));
  };

  const handleLayoutChange = (
    layoutKey: keyof TemplateConfig["layout"],
    value: any,
  ) => {
    setConfig((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        [layoutKey]: value,
      },
    }));
  };

  const handleTemplateDataChange = (
    key: keyof InvitationData,
    value: string,
  ) => {
    setTemplateData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyColorPreset = (preset: (typeof colorPresets)[0]) => {
    setConfig((prev) => ({
      ...prev,
      colors: preset.colors,
    }));
  };

  const saveTemplate = async () => {
    if (!user) {
      setError("Shablon saqlash uchun tizimga kirishingiz kerak");
      return;
    }

    if (!templateData.templateName.trim()) {
      setError("Iltimos, shablon nomini kiriting");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const templateToSave = {
        user_id: user.id,
        name: templateData.templateName.trim(),
        description: `Maxsus shablon - ${new Date().toLocaleDateString("uz-UZ")}`,
        category: "custom",
        config: config,
        colors: config.colors,
        fonts: config.fonts,
        layout: config.layout,
        is_public: false,
        is_featured: false,
        tags: [config.layout.style, "maxsus"],
      };

      const { data, error: saveError } = await supabase
        .from("custom_templates")
        .insert(templateToSave)
        .select()
        .single();

      if (saveError) {
        throw saveError;
      }

      setSuccess("Shablon muvaffaqiyatli saqlandi! 🎉");
      
      setTimeout(() => {
        navigate("/templates");
      }, 2000);

    } catch (err: any) {
      console.error("Template save error:", err);
      
      // Save to localStorage as fallback
      const fallbackTemplate = {
        id: `local_${Date.now()}`,
        ...templateData,
        config: config,
        created_at: new Date().toISOString(),
        is_local: true,
      };
      
      localStorage.setItem(
        `custom_template_${fallbackTemplate.id}`,
        JSON.stringify(fallbackTemplate),
      );

      setSuccess("Shablon vaqtincha saqlandi (mahalliy xotira)");
      
      setTimeout(() => {
        navigate("/templates");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      colors: {
        primary: "#be185d",
        secondary: "#fda4af", 
        accent: "#fb7185",
        background: "#fdf2f8",
        text: "#881337",
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
      },
    });
  };

  // Real-time Template Preview Component
  const TemplatePreview = () => {
    const containerStyle = {
      backgroundColor: config.colors.background,
      color: config.colors.text,
      fontFamily: config.fonts.body,
      padding: `${config.layout.spacing}px`,
      borderRadius: `${config.layout.borderRadius}px`,
      boxShadow: `0 ${config.layout.shadowIntensity}px ${config.layout.shadowIntensity * 2}px rgba(0,0,0,0.1)`,
      border: `2px solid ${config.colors.accent}20`,
    };

    const headingStyle = {
      fontFamily: config.fonts.heading,
      color: config.colors.primary,
    };

    const accentStyle = {
      fontFamily: config.fonts.accent,
      color: config.colors.accent,
    };

    const getLayoutClass = () => {
      switch (config.layout.style) {
        case "classic": return "text-center space-y-6";
        case "modern": return "text-center space-y-4";
        case "elegant": return "text-center space-y-8";
        case "rustic": return "text-left space-y-6";
        case "luxury": return "text-center space-y-10";
        default: return "text-center space-y-6";
      }
    };

    return (
      <div
        className={`w-full max-w-md mx-auto transition-all duration-300 ${previewDevice === "mobile" ? "max-w-xs" : "max-w-md"}`}
        style={containerStyle}
      >
        <div className={getLayoutClass()}>
          {/* Decorative Header */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div
              className="w-12 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            />
            <Heart className="w-4 h-4" style={{ color: config.colors.accent }} />
            <div
              className="w-12 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            />
          </div>

          {/* Header Text */}
          <div className="space-y-2">
            <div
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: config.colors.secondary }}
            >
              To'y Taklifnomasi
            </div>
          </div>

          {/* Names */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide" style={headingStyle}>
              {templateData.groomName}
            </h1>
            <div className="text-3xl" style={accentStyle}>
              &
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide" style={headingStyle}>
              {templateData.brideName}
            </h1>
          </div>

          {/* Decorative Divider */}
          <div className="flex justify-center items-center space-x-2">
            <Star className="w-3 h-3" style={{ color: config.colors.accent }} />
            <div
              className="w-8 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            />
            <Sparkles className="w-3 h-3" style={{ color: config.colors.accent }} />
            <div
              className="w-8 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            />
            <Star className="w-3 h-3" style={{ color: config.colors.accent }} />
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <div
              className="text-lg font-semibold"
              style={{ color: config.colors.primary }}
            >
              {templateData.weddingDate}
            </div>
            <div className="text-md" style={{ color: config.colors.secondary }}>
              {templateData.weddingTime}
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-3">
            <div
              className="text-lg font-medium"
              style={{ color: config.colors.primary }}
            >
              {templateData.venue}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: config.colors.secondary }}>
              {templateData.address}
            </div>
          </div>

          {/* Message */}
          <div
            className="text-sm leading-relaxed italic px-4"
            style={{ color: config.colors.text }}
          >
            "{templateData.customMessage}"
          </div>

          {/* Footer Decoration */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <div
              className="w-16 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            />
            <Heart className="w-4 h-4" style={{ color: config.colors.accent }} />
            <div
              className="w-16 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50/30">
        {/* Elegant Header */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-rose-200/50 p-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-rose-100">
                <Link to="/templates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Shablonlar
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h1 className="font-heading text-xl font-bold text-foreground">
                  Shablon Yaratuvchi
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
                className="hover:bg-rose-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Qayta tiklash
              </Button>
              <Button
                onClick={saveTemplate}
                disabled={loading}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
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

        <div className="max-w-7xl mx-auto p-6">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50/80">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50/80">
              <X className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Panel - Controls (3/5) */}
            <div className="lg:col-span-3 space-y-6">
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/80 p-1">
                  <TabsTrigger value="info" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ma'lumot
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Ranglar
                  </TabsTrigger>
                  <TabsTrigger value="fonts" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Shriftlar
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Layout
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 shadow-sm">
                    <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-rose-500" />
                      Shablon Ma'lumotlari
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="templateName" className="text-sm font-medium">Shablon Nomi</Label>
                        <Input
                          id="templateName"
                          value={templateData.templateName}
                          onChange={(e) => handleTemplateDataChange("templateName", e.target.value)}
                          placeholder="Mening ajoyib shablonim"
                          className="mt-1 border-rose-200 focus:border-rose-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="groomName" className="text-sm font-medium">Kuyov Ismi</Label>
                          <Input
                            id="groomName"
                            value={templateData.groomName}
                            onChange={(e) => handleTemplateDataChange("groomName", e.target.value)}
                            className="mt-1 border-rose-200 focus:border-rose-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="brideName" className="text-sm font-medium">Kelin Ismi</Label>
                          <Input
                            id="brideName"
                            value={templateData.brideName}
                            onChange={(e) => handleTemplateDataChange("brideName", e.target.value)}
                            className="mt-1 border-rose-200 focus:border-rose-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weddingDate" className="text-sm font-medium">To'y Sanasi</Label>
                          <Input
                            id="weddingDate"
                            value={templateData.weddingDate}
                            onChange={(e) => handleTemplateDataChange("weddingDate", e.target.value)}
                            className="mt-1 border-rose-200 focus:border-rose-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weddingTime" className="text-sm font-medium">Vaqt</Label>
                          <Input
                            id="weddingTime"
                            value={templateData.weddingTime}
                            onChange={(e) => handleTemplateDataChange("weddingTime", e.target.value)}
                            className="mt-1 border-rose-200 focus:border-rose-400"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="venue" className="text-sm font-medium">Joy</Label>
                        <Input
                          id="venue"
                          value={templateData.venue}
                          onChange={(e) => handleTemplateDataChange("venue", e.target.value)}
                          className="mt-1 border-rose-200 focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address" className="text-sm font-medium">Manzil</Label>
                        <Input
                          id="address"
                          value={templateData.address}
                          onChange={(e) => handleTemplateDataChange("address", e.target.value)}
                          className="mt-1 border-rose-200 focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customMessage" className="text-sm font-medium">Maxsus Xabar</Label>
                        <Textarea
                          id="customMessage"
                          value={templateData.customMessage}
                          onChange={(e) => handleTemplateDataChange("customMessage", e.target.value)}
                          className="mt-1 border-rose-200 focus:border-rose-400"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-6 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 shadow-sm">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-rose-500" />
                      Rang Shablonlari
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyColorPreset(preset)}
                          className="p-4 border border-rose-200 rounded-lg hover:border-rose-400 transition-all hover:shadow-md"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: preset.colors.secondary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: preset.colors.accent }}
                            />
                          </div>
                          <div className="text-xs font-medium text-foreground text-left">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      <h4 className="font-medium text-foreground">Maxsus Ranglar</h4>
                      {Object.entries(config.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <Label className="text-sm font-medium capitalize min-w-[80px]">
                            {key === 'primary' ? 'Asosiy' : 
                             key === 'secondary' ? 'Ikkinchi' :
                             key === 'accent' ? 'Urg\'u' :
                             key === 'background' ? 'Fon' : 'Matn'}
                          </Label>
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof TemplateConfig["colors"], e.target.value)}
                            className="w-12 h-10 p-1 border border-rose-200 rounded-lg cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof TemplateConfig["colors"], e.target.value)}
                            className="flex-1 border-rose-200 focus:border-rose-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fonts" className="space-y-4 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 shadow-sm">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5 text-rose-500" />
                      Shrift Sozlamalari
                    </h3>
                    {Object.entries(config.fonts).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm font-medium capitalize">
                          {key === 'heading' ? 'Sarlavha Shrifti' : 
                           key === 'body' ? 'Asosiy Shrift' : 'Dekorativ Shrift'}
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(val) => handleFontChange(key as keyof TemplateConfig["fonts"], val)}
                        >
                          <SelectTrigger className="border-rose-200 focus:border-rose-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem
                                key={font}
                                value={font}
                                style={{ fontFamily: font }}
                              >
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 shadow-sm">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-rose-500" />
                      Layout Sozlamalari
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Layout Uslubi</Label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {layoutStyles.map((style) => (
                            <button
                              key={style.value}
                              onClick={() => handleLayoutChange("style", style.value)}
                              className={`p-3 border rounded-lg text-left transition-all ${
                                config.layout.style === style.value
                                  ? "border-rose-400 bg-rose-50"
                                  : "border-rose-200 hover:border-rose-300 hover:bg-rose-25"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{style.icon}</span>
                                <div>
                                  <div className="font-medium text-foreground">{style.label}</div>
                                  <div className="text-xs text-muted-foreground">{style.description}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Ichki bo'shliq: {config.layout.spacing}px
                          </Label>
                          <Slider
                            value={[config.layout.spacing]}
                            onValueChange={(value) => handleLayoutChange("spacing", value[0])}
                            max={50}
                            min={10}
                            step={2}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Burchak radiusi: {config.layout.borderRadius}px
                          </Label>
                          <Slider
                            value={[config.layout.borderRadius]}
                            onValueChange={(value) => handleLayoutChange("borderRadius", value[0])}
                            max={30}
                            min={0}
                            step={2}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Soya kuchi: {config.layout.shadowIntensity}
                          </Label>
                          <Slider
                            value={[config.layout.shadowIntensity]}
                            onValueChange={(value) => handleLayoutChange("shadowIntensity", value[0])}
                            max={20}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel - Live Preview (2/5) */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                      <Eye className="w-5 h-5 text-rose-500" />
                      Jonli Ko'rinish
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={previewDevice === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                        className="h-8 w-8 p-0"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                        className="h-8 w-8 p-0"
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border border-rose-200 rounded-lg p-6 bg-gradient-to-br from-rose-25 to-pink-25 min-h-[600px] flex items-center justify-center">
                    <TemplatePreview />
                  </div>

                  <div className="text-center mt-4 text-xs text-muted-foreground">
                    Real vaqtda yangilanadi • {previewDevice === "desktop" ? "Kompyuter" : "Mobil"} ko'rinish
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
