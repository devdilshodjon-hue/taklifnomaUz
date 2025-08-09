import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, templateOperations } from "@/lib/supabase";
import cacheUtils from "@/lib/cache";
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
  Check,
  X,
  Settings,
  Layers,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  const [activeTab, setActiveTab] = useState("colors");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );

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
      primary: "#6366f1",
      secondary: "#ec4899",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      accent: "Dancing Script",
    },
    layout: {
      style: "modern",
      spacing: 20,
      borderRadius: 12,
      shadowIntensity: 10,
    },
  });

  const colorPresets = [
    {
      name: "Classic Rose",
      colors: {
        primary: "#be185d",
        secondary: "#fda4af",
        accent: "#fb7185",
        background: "#fdf2f8",
        text: "#881337",
      },
    },
    {
      name: "Modern Blue",
      colors: {
        primary: "#2563eb",
        secondary: "#60a5fa",
        accent: "#3b82f6",
        background: "#eff6ff",
        text: "#1e3a8a",
      },
    },
    {
      name: "Elegant Gold",
      colors: {
        primary: "#d97706",
        secondary: "#fbbf24",
        accent: "#f59e0b",
        background: "#fffbeb",
        text: "#92400e",
      },
    },
    {
      name: "Nature Green",
      colors: {
        primary: "#059669",
        secondary: "#34d399",
        accent: "#10b981",
        background: "#ecfdf5",
        text: "#064e3b",
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
  ];

  const layoutStyles = [
    {
      value: "classic",
      label: "Klassik",
      description: "An'anaviy va sodda dizayn",
    },
    {
      value: "modern",
      label: "Zamonaviy",
      description: "Minimalistik va zamonaviy",
    },
    { value: "elegant", label: "Nafis", description: "Chiroyli va nafis" },
    { value: "rustic", label: "Tabiy", description: "Tabiy va issiq" },
    { value: "luxury", label: "Hashamatli", description: "Dabdabali va noyob" },
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

    let timeoutId: NodeJS.Timeout;

    try {
      // Check authentication session first
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        setError(
          "Autentifikatsiya sessiyasida xatolik. Iltimos, qayta kiring.",
        );
        return;
      }

      if (!session) {
        console.error("No active session found");
        setError("Sessiya tugagan. Iltimos, qayta kiring.");
        return;
      }

      console.log(
        "Session verified for template save:",
        !!session,
        "User ID:",
        session.user?.id,
      );

      const templateToSave = {
        user_id: user.id,
        name: templateData.templateName.trim(),
        description: `Custom template created on ${new Date().toLocaleDateString("uz-UZ")}`,
        category: "custom",
        colors: config.colors,
        fonts: config.fonts,
        layout_config: config.layout,
        is_public: false,
        is_featured: false,
      };

      console.log("Template data to save:", templateToSave);

      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.log("Template save timeout - stopping");
        setLoading(false);
        setError(
          "Saqlash jarayoni uzun davom etmoqda. Iltimos, qayta urinib ko'ring.",
        );
      }, 15000); // 15 seconds timeout

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from("custom_templates")
        .select("id")
        .limit(1);

      let data: any = null;

      if (testError) {
        console.error("Database connection test failed:", testError);
        clearTimeout(timeoutId);

        // If table doesn't exist, save to localStorage
        if (testError.message.includes("does not exist")) {
          console.log("Using localStorage for template saving");

          const localTemplate = {
            ...templateToSave,
            id: `local_${Date.now()}`,
            is_local: true,
            saved_at: new Date().toISOString(),
          };

          localStorage.setItem(
            `custom_template_${localTemplate.id}`,
            JSON.stringify(localTemplate),
          );

          data = localTemplate;
          console.log("Template saved to localStorage:", data);
        } else {
          setError(
            "Ma'lumotlar bazasiga ulanishda xatolik. Iltimos, internetni tekshiring.",
          );
          return;
        }
      } else {
        console.log("Database connection test successful");

        const { data: supabaseData, error: saveError } = await supabase
          .from("custom_templates")
          .insert(templateToSave)
          .select()
          .single();

        clearTimeout(timeoutId);

        if (saveError) {
          console.error("Template save error:", saveError);

          // Show user-friendly error message based on error type
          if (saveError.message.includes("auth")) {
            setError("Autentifikatsiya xatoligi. Iltimos, qayta kiring.");
            return;
          } else if (saveError.message.includes("duplicate")) {
            setError("Bu nomda shablon allaqachon mavjud.");
            return;
          } else {
            // Save to localStorage as fallback
            console.log("Saving to localStorage as fallback");
            const localTemplate = {
              ...templateToSave,
              id: `local_${Date.now()}`,
              is_local: true,
              saved_at: new Date().toISOString(),
            };

            localStorage.setItem(
              `custom_template_${localTemplate.id}`,
              JSON.stringify(localTemplate),
            );

            data = localTemplate;
          }
        } else {
          data = supabaseData;
        }
      }

      console.log("Template saved successfully:", data);
      setSuccess("Shablon muvaffaqiyatli saqlandi!");

      // Backup to localStorage as well
      const backupTemplate = {
        ...data,
        is_backup: true,
        saved_at: new Date().toISOString(),
      };
      localStorage.setItem(
        `template_backup_${data?.id}`,
        JSON.stringify(backupTemplate),
      );

      setTimeout(() => {
        navigate("/templates");
      }, 2000);
    } catch (err: any) {
      console.error("Template save general error:", err);
      clearTimeout(timeoutId);
      setError(
        err.message || "Shablon saqlanishda kutilmagan xatolik yuz berdi",
      );

      // Save to localStorage as fallback
      const fallbackTemplate = {
        id: `backup_${Date.now()}`,
        ...templateData,
        config: config,
        created_at: new Date().toISOString(),
        is_backup: true,
      };
      localStorage.setItem(
        `template_backup_${fallbackTemplate.id}`,
        JSON.stringify(fallbackTemplate),
      );

      setSuccess("Shablon vaqtincha saqlanadi (backup)");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#1f2937",
      },
      fonts: {
        heading: "Playfair Display",
        body: "Inter",
        accent: "Dancing Script",
      },
      layout: {
        style: "modern",
        spacing: 20,
        borderRadius: 12,
        shadowIntensity: 10,
      },
    });
  };

  // Template Preview Component
  const TemplatePreview = () => {
    const style = {
      backgroundColor: config.colors.background,
      color: config.colors.text,
      fontFamily: config.fonts.body,
      padding: `${config.layout.spacing}px`,
      borderRadius: `${config.layout.borderRadius}px`,
      boxShadow: `0 ${config.layout.shadowIntensity}px ${config.layout.shadowIntensity * 2}px rgba(0,0,0,0.1)`,
    };

    const headingStyle = {
      fontFamily: config.fonts.heading,
      color: config.colors.primary,
    };

    const accentStyle = {
      fontFamily: config.fonts.accent,
      color: config.colors.accent,
    };

    return (
      <div
        className={`template-preview ${previewDevice === "mobile" ? "max-w-sm" : "max-w-md"} mx-auto`}
        style={style}
      >
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div
              className="text-sm font-medium tracking-widest uppercase"
              style={{ color: config.colors.secondary }}
            >
              To'y Taklifnomasi
            </div>
            <div
              className="w-16 h-0.5 mx-auto"
              style={{ backgroundColor: config.colors.accent }}
            ></div>
          </div>

          {/* Names */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold" style={headingStyle}>
              {templateData.groomName}
            </h1>
            <div className="text-2xl" style={accentStyle}>
              &
            </div>
            <h1 className="text-3xl font-bold" style={headingStyle}>
              {templateData.brideName}
            </h1>
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
          <div className="space-y-2">
            <div
              className="w-12 h-0.5 mx-auto"
              style={{ backgroundColor: config.colors.accent }}
            ></div>
            <div
              className="text-lg font-medium"
              style={{ color: config.colors.primary }}
            >
              {templateData.venue}
            </div>
            <div className="text-sm" style={{ color: config.colors.secondary }}>
              {templateData.address}
            </div>
          </div>

          {/* Message */}
          <div
            className="text-sm leading-relaxed italic"
            style={{ color: config.colors.text }}
          >
            "{templateData.customMessage}"
          </div>

          {/* Decorative element */}
          <div className="flex justify-center items-center space-x-2">
            <div
              className="w-8 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            ></div>
            <Sparkles
              className="w-4 h-4"
              style={{ color: config.colors.accent }}
            />
            <div
              className="w-8 h-0.5"
              style={{ backgroundColor: config.colors.accent }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
        {/* Header */}
        <nav className="bg-card/80 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50 animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover-scale">
                <Link to="/templates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Shablonlar
                </Link>
              </Button>
              <h1 className="font-heading text-xl font-bold text-foreground">
                Shablon Yaratuvchi
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
                className="hover-scale"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Qayta tiklash
              </Button>
              <Button
                onClick={saveTemplate}
                disabled={loading}
                className="primary-gradient hover-lift"
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
            <Alert className="mb-6 border-green-200 bg-green-50/50 animate-fade-in">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50/50 animate-shake">
              <X className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              {/* Template Info */}
              <div className="card-modern p-6 animate-slide-up">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Shablon Ma'lumotlari
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="templateName">Shablon Nomi</Label>
                    <Input
                      id="templateName"
                      value={templateData.templateName}
                      onChange={(e) =>
                        handleTemplateDataChange("templateName", e.target.value)
                      }
                      placeholder="Mening yangi shablonim"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groomName">Kuyov Ismi</Label>
                      <Input
                        id="groomName"
                        value={templateData.groomName}
                        onChange={(e) =>
                          handleTemplateDataChange("groomName", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brideName">Kelin Ismi</Label>
                      <Input
                        id="brideName"
                        value={templateData.brideName}
                        onChange={(e) =>
                          handleTemplateDataChange("brideName", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weddingDate">To'y Sanasi</Label>
                      <Input
                        id="weddingDate"
                        value={templateData.weddingDate}
                        onChange={(e) =>
                          handleTemplateDataChange(
                            "weddingDate",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weddingTime">Vaqt</Label>
                      <Input
                        id="weddingTime"
                        value={templateData.weddingTime}
                        onChange={(e) =>
                          handleTemplateDataChange(
                            "weddingTime",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="venue">Joy</Label>
                    <Input
                      id="venue"
                      value={templateData.venue}
                      onChange={(e) =>
                        handleTemplateDataChange("venue", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Manzil</Label>
                    <Input
                      id="address"
                      value={templateData.address}
                      onChange={(e) =>
                        handleTemplateDataChange("address", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customMessage">Maxsus Xabar</Label>
                    <Textarea
                      id="customMessage"
                      value={templateData.customMessage}
                      onChange={(e) =>
                        handleTemplateDataChange(
                          "customMessage",
                          e.target.value,
                        )
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Design Controls */}
              <div className="card-modern p-6 animate-slide-up delay-100">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="colors"
                      className="flex items-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      Ranglar
                    </TabsTrigger>
                    <TabsTrigger
                      value="fonts"
                      className="flex items-center gap-2"
                    >
                      <Type className="w-4 h-4" />
                      Shriftlar
                    </TabsTrigger>
                    <TabsTrigger
                      value="layout"
                      className="flex items-center gap-2"
                    >
                      <Layout className="w-4 h-4" />
                      Layout
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="colors" className="space-y-6 mt-6">
                    {/* Color Presets */}
                    <div>
                      <Label className="text-sm font-medium">
                        Ranglar Presetlari
                      </Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {colorPresets.map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => applyColorPreset(preset)}
                            className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors hover-lift"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: preset.colors.primary,
                                }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: preset.colors.secondary,
                                }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: preset.colors.accent,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium text-foreground">
                              {preset.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Individual Colors */}
                    <div className="space-y-4">
                      {Object.entries(config.colors).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-sm font-medium capitalize">
                            {key}
                          </Label>
                          <div className="flex items-center gap-3 mt-1">
                            <Input
                              type="color"
                              value={value}
                              onChange={(e) =>
                                handleColorChange(
                                  key as keyof TemplateConfig["colors"],
                                  e.target.value,
                                )
                              }
                              className="w-12 h-10 p-1 border border-border rounded-lg"
                            />
                            <Input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleColorChange(
                                  key as keyof TemplateConfig["colors"],
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="fonts" className="space-y-4 mt-6">
                    {Object.entries(config.fonts).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm font-medium capitalize">
                          {key} Shrift
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(val) =>
                            handleFontChange(
                              key as keyof TemplateConfig["fonts"],
                              val,
                            )
                          }
                        >
                          <SelectTrigger className="mt-1">
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
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-6 mt-6">
                    {/* Layout Style */}
                    <div>
                      <Label className="text-sm font-medium">
                        Layout Uslubi
                      </Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {layoutStyles.map((style) => (
                          <button
                            key={style.value}
                            onClick={() =>
                              handleLayoutChange("style", style.value)
                            }
                            className={`p-3 border rounded-lg text-left transition-all hover-lift ${
                              config.layout.style === style.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium text-foreground">
                              {style.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {style.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Layout Controls */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Spacing: {config.layout.spacing}px
                        </Label>
                        <Slider
                          value={[config.layout.spacing]}
                          onValueChange={(value) =>
                            handleLayoutChange("spacing", value[0])
                          }
                          max={50}
                          min={10}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Border Radius: {config.layout.borderRadius}px
                        </Label>
                        <Slider
                          value={[config.layout.borderRadius]}
                          onValueChange={(value) =>
                            handleLayoutChange("borderRadius", value[0])
                          }
                          max={30}
                          min={0}
                          step={2}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Shadow: {config.layout.shadowIntensity}
                        </Label>
                        <Slider
                          value={[config.layout.shadowIntensity]}
                          onValueChange={(value) =>
                            handleLayoutChange("shadowIntensity", value[0])
                          }
                          max={20}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="sticky top-24 h-fit">
              <div className="card-modern p-6 animate-slide-up delay-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Jonli Ko'rinish
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={
                        previewDevice === "desktop" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewDevice("desktop")}
                      className="hover-scale"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={
                        previewDevice === "mobile" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewDevice("mobile")}
                      className="hover-scale"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6 bg-muted/30 min-h-[600px] flex items-center justify-center">
                  <TemplatePreview />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover-scale"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Yuklab olish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover-scale"
                  >
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
