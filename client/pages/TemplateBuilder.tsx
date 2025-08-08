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
  Upload, 
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Loader2,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    style: 'classic' | 'modern' | 'elegant' | 'rustic' | 'luxury';
    spacing: number;
    borderRadius: number;
    shadowIntensity: number;
  };
}

export default function TemplateBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [config, setConfig] = useState<TemplateConfig>({
    colors: {
      primary: "#6366f1",
      secondary: "#ec4899",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#1f2937"
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      accent: "Dancing Script"
    },
    layout: {
      style: 'modern',
      spacing: 20,
      borderRadius: 12,
      shadowIntensity: 10
    }
  });

  const colorPresets = [
    {
      name: "Classic Rose",
      colors: {
        primary: "#be185d",
        secondary: "#fda4af",
        accent: "#fb7185",
        background: "#fdf2f8",
        text: "#881337"
      }
    },
    {
      name: "Modern Blue",
      colors: {
        primary: "#2563eb",
        secondary: "#60a5fa",
        accent: "#3b82f6",
        background: "#eff6ff",
        text: "#1e3a8a"
      }
    },
    {
      name: "Elegant Gold",
      colors: {
        primary: "#d97706",
        secondary: "#fbbf24",
        accent: "#f59e0b",
        background: "#fffbeb",
        text: "#92400e"
      }
    },
    {
      name: "Nature Green",
      colors: {
        primary: "#059669",
        secondary: "#34d399",
        accent: "#10b981",
        background: "#ecfdf5",
        text: "#064e3b"
      }
    }
  ];

  const fontOptions = [
    { name: "Inter", className: "font-sans" },
    { name: "Playfair Display", className: "font-serif" },
    { name: "Dancing Script", className: "font-cursive" },
    { name: "Montserrat", className: "font-mono" },
    { name: "Poppins", className: "font-display" }
  ];

  const handleColorChange = (colorType: keyof TemplateConfig['colors'], value: string) => {
    setConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleFontChange = (fontType: keyof TemplateConfig['fonts'], value: string) => {
    setConfig(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value
      }
    }));
  };

  const handleLayoutChange = (layoutType: keyof TemplateConfig['layout'], value: any) => {
    setConfig(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [layoutType]: value
      }
    }));
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setConfig(prev => ({
      ...prev,
      colors: preset.colors
    }));
  };

  const resetToDefaults = () => {
    setConfig({
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#1f2937"
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
        accent: "Dancing Script"
      },
      layout: {
        style: 'modern',
        spacing: 20,
        borderRadius: 12,
        shadowIntensity: 10
      }
    });
  };

  const handleSave = async () => {
    if (!user) {
      setError("Shablon saqlash uchun tizimga kirishingiz kerak");
      return;
    }

    if (!templateName.trim()) {
      setError("Shablon nomini kiriting");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const templateData = {
        user_id: user.id,
        name: templateName,
        description: templateDescription || null,
        category: 'custom',
        colors: config.colors,
        fonts: config.fonts,
        layout_config: config.layout,
        is_public: isPublic,
        tags: ['custom', config.layout.style]
      };

      const { data, error } = await supabase
        .from('custom_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate("/templates");
      }, 2000);

    } catch (error: any) {
      console.error('Shablon saqlashda xatolik:', error);
      setError(error.message || 'Shablon saqlashda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const getMockInvitation = () => ({
    id: 'preview',
    groom_name: 'Jahongir',
    bride_name: 'Sarvinoz',
    wedding_date: '2024-06-15',
    wedding_time: '16:00',
    venue: 'Atirgul Bog\'i',
    address: 'Toshkent sh., Yunusobod t.',
    custom_message: 'Bizning sevgi va baxt to\'la kunimizni birga nishonlash uchun sizni taklif qilamiz.',
    template_id: 'custom'
  });

  if (success) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-background flex items-center justify-center p-6">
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
              Shablon muvaffaqiyatli yaratildi!
            </h1>
            <p className="text-muted-foreground mb-6">
              Sizning maxsus shablonngiz saqlandi va endi taklifnomalar yaratishda ishlatishingiz mumkin.
            </p>
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Shablonlar sahifasiga yo'naltirilmoqda...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
        {/* Header */}
        <nav className="bg-card/80 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover-scale">
                <Link to="/templates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Shablonlarga qaytish
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-foreground">Shablon Yaratuvchi</span>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="button-modern primary-gradient">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Saqlash
            </Button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50/50 animate-shake">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Design Controls */}
            <div className="space-y-6">
              {/* Template Info */}
              <div className="card-modern p-6 animate-slide-up">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Shablon Ma'lumotlari
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="templateName">Shablon nomi *</Label>
                    <Input
                      id="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Mening maxsus shabloni"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="templateDescription">Tavsif</Label>
                    <Textarea
                      id="templateDescription"
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="Bu shablon haqida qisqacha ma'lumot..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPublic">Ommaviy shablon</Label>
                    <Switch
                      id="isPublic"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </div>
              </div>

              {/* Color Controls */}
              <div className="card-modern p-6 animate-slide-up delay-100">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Ranglar
                </h2>
                
                {/* Color Presets */}
                <div className="mb-6">
                  <Label className="text-sm">Tayyor rang kombinatsiyalari</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyColorPreset(preset)}
                        className="p-3 border border-border rounded-lg hover:border-primary transition-colors text-left"
                      >
                        <div className="flex gap-2 mb-2">
                          {Object.values(preset.colors).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Individual Color Controls */}
                <div className="space-y-4">
                  {Object.entries(config.colors).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <Label className="w-20 text-sm capitalize">{key}:</Label>
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof TemplateConfig['colors'], e.target.value)}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof TemplateConfig['colors'], e.target.value)}
                        className="flex-1 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Controls */}
              <div className="card-modern p-6 animate-slide-up delay-200">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Shriftlar
                </h2>
                <div className="space-y-4">
                  {Object.entries(config.fonts).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-sm capitalize">{key} shrift</Label>
                      <select
                        value={value}
                        onChange={(e) => handleFontChange(key as keyof TemplateConfig['fonts'], e.target.value)}
                        className="w-full mt-1 p-2 border border-border rounded-md"
                      >
                        {fontOptions.map((font) => (
                          <option key={font.name} value={font.name}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Controls */}
              <div className="card-modern p-6 animate-slide-up delay-300">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Dizayn Sozlamalari
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm">Uslub</Label>
                    <select
                      value={config.layout.style}
                      onChange={(e) => handleLayoutChange('style', e.target.value)}
                      className="w-full mt-1 p-2 border border-border rounded-md"
                    >
                      <option value="classic">Klassik</option>
                      <option value="modern">Zamonaviy</option>
                      <option value="elegant">Nafis</option>
                      <option value="rustic">Qishloq</option>
                      <option value="luxury">Hashamatli</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm">Oraliq ({config.layout.spacing}px)</Label>
                    <Slider
                      value={[config.layout.spacing]}
                      onValueChange={(value) => handleLayoutChange('spacing', value[0])}
                      max={50}
                      min={10}
                      step={2}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Burchak egriligi ({config.layout.borderRadius}px)</Label>
                    <Slider
                      value={[config.layout.borderRadius]}
                      onValueChange={(value) => handleLayoutChange('borderRadius', value[0])}
                      max={30}
                      min={0}
                      step={2}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Soya intensivligi ({config.layout.shadowIntensity}%)</Label>
                    <Slider
                      value={[config.layout.shadowIntensity]}
                      onValueChange={(value) => handleLayoutChange('shadowIntensity', value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={resetToDefaults} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Qayta tiklash
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <div className="card-modern p-6 animate-slide-up delay-100">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Jonli Ko'rinish
                </h2>
                
                {/* Custom Template Preview */}
                <div 
                  className="aspect-[3/4] rounded-lg border-2 overflow-hidden"
                  style={{ 
                    backgroundColor: config.colors.background,
                    borderColor: config.colors.primary,
                    borderRadius: `${config.layout.borderRadius}px`,
                    boxShadow: `0 ${config.layout.shadowIntensity / 10}px ${config.layout.shadowIntensity / 5}px rgba(0,0,0,${config.layout.shadowIntensity / 100})`
                  }}
                >
                  <div 
                    className="h-full flex flex-col justify-center items-center text-center"
                    style={{ padding: `${config.layout.spacing}px` }}
                  >
                    <div 
                      className="text-4xl mb-4"
                      style={{ color: config.colors.primary }}
                    >
                      💕
                    </div>
                    <h3 
                      className="text-lg font-bold mb-2"
                      style={{ 
                        color: config.colors.primary,
                        fontFamily: config.fonts.heading
                      }}
                    >
                      Jahongir & Sarvinoz
                    </h3>
                    <p 
                      className="text-sm mb-3"
                      style={{ 
                        color: config.colors.text,
                        fontFamily: config.fonts.body
                      }}
                    >
                      15 Iyun 2024
                    </p>
                    <div 
                      className="w-12 h-px mb-3"
                      style={{ backgroundColor: config.colors.accent }}
                    />
                    <p 
                      className="text-xs"
                      style={{ 
                        color: config.colors.secondary,
                        fontFamily: config.fonts.accent
                      }}
                    >
                      Atirgul Bog'i
                    </p>
                    <div 
                      className="mt-4 px-4 py-2 rounded-full text-xs"
                      style={{ 
                        backgroundColor: config.colors.primary,
                        color: config.colors.background
                      }}
                    >
                      RSVP
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Yuklab olish
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Ulashish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
