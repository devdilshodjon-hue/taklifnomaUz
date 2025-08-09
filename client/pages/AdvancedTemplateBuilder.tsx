import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { saveTemplateToSupabase } from "@/lib/templateSaver";
import { testSupabaseConnection, saveTemplateWithAuth, initializeAuth } from "@/lib/supabaseAuth";
import { runSupabaseIntegrationTest, displayTestResults, quickConnectionTest } from "@/lib/supabaseTest";
import { runDatabaseHealthCheck, setupDemoData } from "@/lib/databaseSetup";
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
  Image,
  Music,
  Video,
  Shapes,
  Grid,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Brush,
  Gradient,
  Shadow,
  BorderAll,
  Move3D,
  Rotate3D,
  ZoomIn,
  ZoomOut,
  Crop,
  Filter,
  Contrast,
  Sun,
  Moon,
  Wand2,
  Copy,
  Scissors,
  Undo,
  Redo,
  FileImage,
  FileVideo,
  FileMusic,
  Upload,
  Trash2,
  Plus,
  Minus,
  RefreshCw,
  Target,
  Maximize,
  Minimize,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";

interface TemplateConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    gradient1: string;
    gradient2: string;
    shadow: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
    caption: string;
  };
  layout: {
    style:
      | "classic"
      | "modern"
      | "elegant"
      | "rustic"
      | "luxury"
      | "minimalist"
      | "artistic"
      | "vintage";
    spacing: number;
    borderRadius: number;
    shadowIntensity: number;
    padding: number;
    margin: number;
    width: number;
    height: number;
    alignment: "left" | "center" | "right";
    direction: "horizontal" | "vertical";
  };
  animations: {
    enabled: boolean;
    type: "fade" | "slide" | "scale" | "bounce" | "rotate" | "flip";
    duration: number;
    delay: number;
    easing: string;
  };
  effects: {
    blur: number;
    brightness: number;
    contrast: number;
    saturate: number;
    sepia: number;
    grayscale: number;
    hueRotate: number;
    opacity: number;
  };
  border: {
    width: number;
    style: "solid" | "dashed" | "dotted" | "double";
    color: string;
    radius: number;
  };
  background: {
    type: "solid" | "gradient" | "image" | "pattern";
    gradientDirection: string;
    imageUrl: string;
    pattern: string;
    blendMode: string;
  };
  typography: {
    letterSpacing: number;
    lineHeight: number;
    textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
    fontWeight: number;
    textDecoration: "none" | "underline" | "overline" | "line-through";
    textShadow: string;
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
  additionalInfo: string;
  rsvpInfo: string;
  dresscode: string;
  giftInfo: string;
}

export default function AdvancedTemplateBuilder() {
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
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<TemplateConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  // Template data for real-time preview
  const [templateData, setTemplateData] = useState<InvitationData>({
    templateName: "Yangi Professional Shablon",
    groomName: "Jahongir",
    brideName: "Sarvinoz",
    weddingDate: "15 Iyun, 2024",
    weddingTime: "16:00",
    venue: "Atirgul Bog'i",
    address: "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
    customMessage:
      "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
    additionalInfo:
      "Marosim 16:00 da boshlanadi, iltimos vaqtida tashrif buyuring.",
    rsvpInfo: "Iltimos, 10 Iyungacha javob bering",
    dresscode: "Rasmiy kiyim",
    giftInfo: "Sizning kelishingiz bizning eng katta sovg'amiz",
  });

  const [config, setConfig] = useState<TemplateConfig>({
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#1e293b",
      gradient1: "#3b82f6",
      gradient2: "#8b5cf6",
      shadow: "#00000020",
      border: "#e2e8f0",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      accent: "Dancing Script",
      caption: "Source Code Pro",
    },
    layout: {
      style: "elegant",
      spacing: 24,
      borderRadius: 16,
      shadowIntensity: 12,
      padding: 32,
      margin: 16,
      width: 100,
      height: 100,
      alignment: "center",
      direction: "vertical",
    },
    animations: {
      enabled: true,
      type: "fade",
      duration: 0.5,
      delay: 0,
      easing: "ease-in-out",
    },
    effects: {
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      opacity: 100,
    },
    border: {
      width: 1,
      style: "solid",
      color: "#e2e8f0",
      radius: 8,
    },
    background: {
      type: "solid",
      gradientDirection: "to right",
      imageUrl: "",
      pattern: "none",
      blendMode: "normal",
    },
    typography: {
      letterSpacing: 0,
      lineHeight: 1.5,
      textTransform: "none",
      fontWeight: 400,
      textDecoration: "none",
      textShadow: "none",
    },
  });

  // Preset configurations
  const colorPresets = [
    {
      name: "TaklifNoma Professional",
      emoji: "💎",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#1e293b",
        gradient1: "#3b82f6",
        gradient2: "#8b5cf6",
        shadow: "#00000020",
        border: "#e2e8f0",
      },
    },
    {
      name: "Romantik Pushti",
      emoji: "🌸",
      colors: {
        primary: "#be185d",
        secondary: "#fda4af",
        accent: "#fb7185",
        background: "#fdf2f8",
        text: "#881337",
        gradient1: "#be185d",
        gradient2: "#f472b6",
        shadow: "#be185d20",
        border: "#fce7f3",
      },
    },
    {
      name: "Zarhal Oltin",
      emoji: "✨",
      colors: {
        primary: "#d97706",
        secondary: "#fbbf24",
        accent: "#f59e0b",
        background: "#fffbeb",
        text: "#92400e",
        gradient1: "#d97706",
        gradient2: "#fbbf24",
        shadow: "#d9770620",
        border: "#fed7aa",
      },
    },
    {
      name: "Tabiat Yashil",
      emoji: "🌿",
      colors: {
        primary: "#059669",
        secondary: "#34d399",
        accent: "#10b981",
        background: "#ecfdf5",
        text: "#064e3b",
        gradient1: "#059669",
        gradient2: "#34d399",
        shadow: "#05966920",
        border: "#a7f3d0",
      },
    },
    {
      name: "Hashamatli Binafsha",
      emoji: "💜",
      colors: {
        primary: "#7c3aed",
        secondary: "#a78bfa",
        accent: "#8b5cf6",
        background: "#f5f3ff",
        text: "#581c87",
        gradient1: "#7c3aed",
        gradient2: "#a78bfa",
        shadow: "#7c3aed20",
        border: "#c4b5fd",
      },
    },
    {
      name: "Klassik Qora",
      emoji: "🖤",
      colors: {
        primary: "#1f2937",
        secondary: "#6b7280",
        accent: "#d97706",
        background: "#ffffff",
        text: "#111827",
        gradient1: "#1f2937",
        gradient2: "#4b5563",
        shadow: "#1f293720",
        border: "#d1d5db",
      },
    },
    {
      name: "Kuch-qudrat Ko'k",
      emoji: "💙",
      colors: {
        primary: "#1e40af",
        secondary: "#60a5fa",
        accent: "#3b82f6",
        background: "#eff6ff",
        text: "#1e3a8a",
        gradient1: "#1e40af",
        gradient2: "#60a5fa",
        shadow: "#1e40af20",
        border: "#93c5fd",
      },
    },
    {
      name: "Issiq Qizil",
      emoji: "❤️",
      colors: {
        primary: "#dc2626",
        secondary: "#f87171",
        accent: "#ef4444",
        background: "#fef2f2",
        text: "#7f1d1d",
        gradient1: "#dc2626",
        gradient2: "#f87171",
        shadow: "#dc262620",
        border: "#fecaca",
      },
    },
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter (Zamonaviy)", category: "Sans Serif" },
    { value: "Poppins", label: "Poppins (Yumaloq)", category: "Sans Serif" },
    { value: "Montserrat", label: "Montserrat (Aniq)", category: "Sans Serif" },
    { value: "Open Sans", label: "Open Sans (Sodda)", category: "Sans Serif" },
    { value: "Roboto", label: "Roboto (Texnologik)", category: "Sans Serif" },
    {
      value: "Playfair Display",
      label: "Playfair Display (Klassik)",
      category: "Serif",
    },
    { value: "Lora", label: "Lora (O'qish uchun)", category: "Serif" },
    {
      value: "Merriweather",
      label: "Merriweather (Jurnalistik)",
      category: "Serif",
    },
    {
      value: "Crimson Text",
      label: "Crimson Text (Akademik)",
      category: "Serif",
    },
    {
      value: "Libre Baskerville",
      label: "Libre Baskerville (Klassik)",
      category: "Serif",
    },
    {
      value: "Dancing Script",
      label: "Dancing Script (Qo'lyozma)",
      category: "Script",
    },
    { value: "Great Vibes", label: "Great Vibes (Nafis)", category: "Script" },
    { value: "Pacifico", label: "Pacifico (Dam olish)", category: "Script" },
    {
      value: "Source Code Pro",
      label: "Source Code Pro (Kod)",
      category: "Monospace",
    },
    {
      value: "JetBrains Mono",
      label: "JetBrains Mono (Zamonaviy)",
      category: "Monospace",
    },
  ];

  const layoutStyles = [
    {
      value: "classic",
      label: "Klassik",
      description: "An'anaviy va rasmiiy",
      icon: "📜",
    },
    {
      value: "modern",
      label: "Zamonaviy",
      description: "Minimalistik va sodda",
      icon: "✨",
    },
    {
      value: "elegant",
      label: "Nafis",
      description: "Chiroyli va mukammal",
      icon: "💎",
    },
    {
      value: "rustic",
      label: "Tabiy",
      description: "Tabiy va issiq his",
      icon: "🌿",
    },
    {
      value: "luxury",
      label: "Hashamatli",
      description: "Dabdabali va noyob",
      icon: "👑",
    },
    {
      value: "minimalist",
      label: "Minimalist",
      description: "Juda sodda va toza",
      icon: "⚪",
    },
    {
      value: "artistic",
      label: "San'atiy",
      description: "Ijodiy va noyob",
      icon: "🎨",
    },
    {
      value: "vintage",
      label: "Vintage",
      description: "Eski uslub va nostalgia",
      icon: "📷",
    },
  ];

  const animationTypes = [
    { value: "fade", label: "Fade (Paydo bo'lish)" },
    { value: "slide", label: "Slide (Sirpanish)" },
    { value: "scale", label: "Scale (Kattayish)" },
    { value: "bounce", label: "Bounce (Sakrash)" },
    { value: "rotate", label: "Rotate (Aylanish)" },
    { value: "flip", label: "Flip (Ag'darish)" },
  ];

  const gradientDirections = [
    { value: "to right", label: "Chapdan o'ngga" },
    { value: "to left", label: "O'ngdan chapga" },
    { value: "to bottom", label: "Yuqoridan pastga" },
    { value: "to top", label: "Pastdan yuqoriga" },
    { value: "to bottom right", label: "Diagonal 1" },
    { value: "to bottom left", label: "Diagonal 2" },
    { value: "to top right", label: "Diagonal 3" },
    { value: "to top left", label: "Diagonal 4" },
    { value: "radial", label: "Markazdan atrofga" },
  ];

  // Save history for undo/redo
  const saveToHistory = (newConfig: TemplateConfig) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newConfig);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setConfig(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setConfig(history[historyIndex + 1]);
    }
  };

  // Update config with history
  const updateConfig = (newConfig: TemplateConfig) => {
    setConfig(newConfig);
    saveToHistory(newConfig);
  };

  const handleColorChange = (
    colorType: keyof TemplateConfig["colors"],
    value: string,
  ) => {
    const newConfig = {
      ...config,
      colors: {
        ...config.colors,
        [colorType]: value,
      },
    };
    updateConfig(newConfig);
  };

  const handleFontChange = (
    fontType: keyof TemplateConfig["fonts"],
    value: string,
  ) => {
    const newConfig = {
      ...config,
      fonts: {
        ...config.fonts,
        [fontType]: value,
      },
    };
    updateConfig(newConfig);
  };

  const handleLayoutChange = (
    layoutKey: keyof TemplateConfig["layout"],
    value: any,
  ) => {
    const newConfig = {
      ...config,
      layout: {
        ...config.layout,
        [layoutKey]: value,
      },
    };
    updateConfig(newConfig);
  };

  const handleEffectChange = (
    effectKey: keyof TemplateConfig["effects"],
    value: number,
  ) => {
    const newConfig = {
      ...config,
      effects: {
        ...config.effects,
        [effectKey]: value,
      },
    };
    updateConfig(newConfig);
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
    const newConfig = {
      ...config,
      colors: preset.colors,
    };
    updateConfig(newConfig);
    toast.success(`${preset.name} rang palitasi qo'llandi!`);
  };

  const resetToDefaults = () => {
    const defaultConfig: TemplateConfig = {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#1e293b",
        gradient1: "#3b82f6",
        gradient2: "#8b5cf6",
        shadow: "#00000020",
        border: "#e2e8f0",
      },
      fonts: {
        heading: "Playfair Display",
        body: "Inter",
        accent: "Dancing Script",
        caption: "Source Code Pro",
      },
      layout: {
        style: "elegant",
        spacing: 24,
        borderRadius: 16,
        shadowIntensity: 12,
        padding: 32,
        margin: 16,
        width: 100,
        height: 100,
        alignment: "center",
        direction: "vertical",
      },
      animations: {
        enabled: true,
        type: "fade",
        duration: 0.5,
        delay: 0,
        easing: "ease-in-out",
      },
      effects: {
        blur: 0,
        brightness: 100,
        contrast: 100,
        saturate: 100,
        sepia: 0,
        grayscale: 0,
        hueRotate: 0,
        opacity: 100,
      },
      border: {
        width: 1,
        style: "solid",
        color: "#e2e8f0",
        radius: 8,
      },
      background: {
        type: "solid",
        gradientDirection: "to right",
        imageUrl: "",
        pattern: "none",
        blendMode: "normal",
      },
      typography: {
        letterSpacing: 0,
        lineHeight: 1.5,
        textTransform: "none",
        fontWeight: 400,
        textDecoration: "none",
        textShadow: "none",
      },
    };
    updateConfig(defaultConfig);
    toast.success("Standart sozlamalar qayta tiklandi!");
  };

  // Check connection status with enhanced testing
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus("checking");

        // Use enhanced connection testing
        const connectionResult = await testSupabaseConnection();

        if (connectionResult.isConnected && connectionResult.authenticated) {
          setConnectionStatus("online");
          console.log("✅ Supabase to'liq ulanish:", {
            latency: connectionResult.latency,
            authenticated: connectionResult.authenticated
          });
        } else if (connectionResult.isConnected && !connectionResult.authenticated) {
          setConnectionStatus("online"); // Connected but need auth
          console.log("⚠️ Supabase ulangan lekin autentifikatsiya kerak");
        } else {
          setConnectionStatus("offline");
          console.log("❌ Supabase ulanmagan:", connectionResult.error);
        }
      } catch (error) {
        console.error("❌ Connection check error:", error);
        setConnectionStatus("offline");
      }
    };

    // Initialize auth on mount
    initializeAuth();
    checkConnection();

    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const saveTemplate = async () => {
    console.log("🚀 Enhanced template save process started...");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Use enhanced auth-aware save
      const result = await saveTemplateWithAuth(templateData, config);

      if (result.success) {
        if (result.isSupabase) {
          setSuccess("Professional shablon Supabase ga saqlandi!");
        } else if (result.isDemo) {
          setSuccess("Demo shablon muvaffaqiyatli saqlandi!");
        } else if (result.isLocal) {
          setSuccess("Shablon mahalliy xotiraga saqlandi");
        }

        setTimeout(() => {
          navigate("/templates");
        }, 1500);
      } else {
        setError(result.error || "Shablon saqlashda xatolik");
      }
    } catch (error: any) {
      console.error("❌ Template save error:", error);
      setError(error.message || "Kutilmagan xatolik yuz berdi");
    }

    setLoading(false);
  };

  const saveToLocalStorageDirectly = async () => {
    console.log("💾 Saving directly to localStorage...");

    const { saveTemplateToLocalStorage } = await import("@/lib/templateSaver");
    const result = saveTemplateToLocalStorage(user, templateData, config);

    if (result.success) {
      toast.success("💾 Shablon mahalliy xotiraga saqlandi!", {
        description: "Keyinroq internet orqali sinxronlanadi",
        duration: 4000,
      });
      setSuccess("Shablon mahalliy xotiraga saqlandi");
      setTimeout(() => {
        navigate("/templates");
      }, 1500);
    } else {
      toast.error("❌ Mahalliy saqlashda xatolik");
      setError("Mahalliy saqlashda xatolik");
    }
  };

  // Generate CSS for preview
  const getPreviewStyle = () => {
    const backgroundStyle =
      config.background.type === "gradient"
        ? `linear-gradient(${config.background.gradientDirection}, ${config.colors.gradient1}, ${config.colors.gradient2})`
        : config.colors.background;

    return {
      backgroundColor:
        config.background.type === "solid"
          ? config.colors.background
          : "transparent",
      backgroundImage:
        config.background.type === "gradient" ? backgroundStyle : "none",
      color: config.colors.text,
      fontFamily: config.fonts.body,
      padding: `${config.layout.padding}px`,
      margin: `${config.layout.margin}px`,
      borderRadius: `${config.layout.borderRadius}px`,
      boxShadow: `0 ${config.layout.shadowIntensity}px ${config.layout.shadowIntensity * 2}px ${config.colors.shadow}`,
      border: `${config.border.width}px ${config.border.style} ${config.border.color}`,
      filter: `blur(${config.effects.blur}px) brightness(${config.effects.brightness}%) contrast(${config.effects.contrast}%) saturate(${config.effects.saturate}%) sepia(${config.effects.sepia}%) grayscale(${config.effects.grayscale}%) hue-rotate(${config.effects.hueRotate}deg)`,
      opacity: config.effects.opacity / 100,
      transition: config.animations.enabled
        ? `all ${config.animations.duration}s ${config.animations.easing}`
        : "none",
      textAlign: config.layout.alignment as any,
      letterSpacing: `${config.typography.letterSpacing}px`,
      lineHeight: config.typography.lineHeight,
      textTransform: config.typography.textTransform as any,
      fontWeight: config.typography.fontWeight,
      textDecoration: config.typography.textDecoration as any,
      textShadow:
        config.typography.textShadow !== "none"
          ? config.typography.textShadow
          : "none",
    };
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Enhanced Header */}
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 p-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-slate-100 transition-colors"
              >
                <Link to="/templates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Shablonlar
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                    Professional Shablon Yaratuvchi
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Advanced customization tools
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                {connectionStatus === "checking" && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Tekshirilmoqda
                    </span>
                  </>
                )}
                {connectionStatus === "online" && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-700">Online</span>
                  </>
                )}
                {connectionStatus === "offline" && (
                  <>
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-xs text-orange-700">Offline</span>
                  </>
                )}
              </div>

              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="outline"
                size="sm"
                className="hover:bg-slate-50"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="outline"
                size="sm"
                className="hover:bg-slate-50"
              >
                <Redo className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setFullScreenPreview(true)}
                variant="outline"
                size="sm"
                className="hover:bg-slate-50"
              >
                <Maximize className="w-4 h-4 mr-2" />
                To'liq Ekran
              </Button>
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
                className="hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={async () => {
                  const results = await runSupabaseIntegrationTest();
                  displayTestResults(results);
                }}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
              >
                <Target className="w-4 h-4 mr-2" />
                Test DB
              </Button>
              <div className="flex gap-2">
                {connectionStatus === "offline" && (
                  <Button
                    onClick={saveToLocalStorageDirectly}
                    variant="outline"
                    size="sm"
                    className="hover:bg-orange-50 dark:hover:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Tez Saqlash
                  </Button>
                )}
                <Button
                  onClick={saveTemplate}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {connectionStatus === "offline"
                    ? "Mahalliy Saqlash"
                    : "Saqlash"}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4 md:p-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Advanced Controls */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 bg-white/90 dark:bg-slate-800/90 p-2 shadow-md border border-slate-200 dark:border-slate-700 rounded-lg gap-1 h-auto min-h-[60px]">
                  <TabsTrigger
                    value="info"
                    className="flex flex-col items-center gap-1 text-xs p-3 h-auto min-h-[50px] data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-200 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-xs font-medium">Ma'lumot</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="colors"
                    className="flex flex-col items-center gap-1 text-xs p-3 h-auto min-h-[50px] data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-200 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    <Palette className="w-4 h-4" />
                    <span className="text-xs font-medium">Ranglar</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="fonts"
                    className="flex flex-col items-center gap-1 text-xs p-3 h-auto min-h-[50px] data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-200 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    <Type className="w-4 h-4" />
                    <span className="text-xs font-medium">Shrift</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="flex flex-col items-center gap-1 text-xs p-3 h-auto min-h-[50px] data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-200 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    <Layout className="w-4 h-4" />
                    <span className="text-xs font-medium">Layout</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="effects"
                    className="flex flex-col items-center gap-1 text-xs p-3 h-auto min-h-[50px] data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-200 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-medium">Effekt</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="animation"
                    className="flex flex-col items-center gap-1 text-xs p-3 h-auto min-h-[50px] data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-medium">Animatsiya</span>
                  </TabsTrigger>
                </TabsList>

                {/* Template Information Tab */}
                <TabsContent value="info" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-500" />
                        Shablon Ma'lumotlari
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                            handleTemplateDataChange(
                              "templateName",
                              e.target.value,
                            )
                          }
                          placeholder="Professional shablon nomi"
                          className="mt-1"
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
                              handleTemplateDataChange(
                                "groomName",
                                e.target.value,
                              )
                            }
                            className="mt-1"
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
                              handleTemplateDataChange(
                                "brideName",
                                e.target.value,
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="weddingDate"
                            className="text-sm font-medium"
                          >
                            To'y Sanasi
                          </Label>
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
                          <Label
                            htmlFor="weddingTime"
                            className="text-sm font-medium"
                          >
                            Vaqt
                          </Label>
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
                        <Label htmlFor="venue" className="text-sm font-medium">
                          Joy
                        </Label>
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
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium"
                        >
                          Manzil
                        </Label>
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
                        <Label
                          htmlFor="customMessage"
                          className="text-sm font-medium"
                        >
                          Maxsus Xabar
                        </Label>
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

                      <div>
                        <Label
                          htmlFor="dresscode"
                          className="text-sm font-medium"
                        >
                          Kiyim Kodi
                        </Label>
                        <Input
                          id="dresscode"
                          value={templateData.dresscode}
                          onChange={(e) =>
                            handleTemplateDataChange(
                              "dresscode",
                              e.target.value,
                            )
                          }
                          className="mt-1"
                          placeholder="Rasmiy kiyim"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="rsvpInfo"
                          className="text-sm font-medium"
                        >
                          RSVP Ma'lumoti
                        </Label>
                        <Input
                          id="rsvpInfo"
                          value={templateData.rsvpInfo}
                          onChange={(e) =>
                            handleTemplateDataChange("rsvpInfo", e.target.value)
                          }
                          className="mt-1"
                          placeholder="Javob berish sanasi"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Colors Tab */}
                <TabsContent value="colors" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Palette className="w-5 h-5 text-blue-500" />
                        Rang Sozlamalari
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Color Presets */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Rang Shablonlari
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {colorPresets.map((preset, index) => (
                            <button
                              key={index}
                              onClick={() => applyColorPreset(preset)}
                              className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-all hover:shadow-md group"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{preset.emoji}</span>
                                <div className="flex gap-1">
                                  <div
                                    className="w-3 h-3 rounded-full border border-white shadow-sm group-hover:scale-110 transition-transform"
                                    style={{
                                      backgroundColor: preset.colors.primary,
                                    }}
                                  />
                                  <div
                                    className="w-3 h-3 rounded-full border border-white shadow-sm group-hover:scale-110 transition-transform"
                                    style={{
                                      backgroundColor: preset.colors.secondary,
                                    }}
                                  />
                                  <div
                                    className="w-3 h-3 rounded-full border border-white shadow-sm group-hover:scale-110 transition-transform"
                                    style={{
                                      backgroundColor: preset.colors.accent,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="text-xs font-medium text-slate-700 text-left">
                                {preset.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Individual Color Controls */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Individual Ranglar
                        </Label>
                        <div className="space-y-3">
                          {Object.entries(config.colors).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <Label className="text-sm font-medium capitalize min-w-[80px]">
                                {key === "primary"
                                  ? "Asosiy"
                                  : key === "secondary"
                                    ? "Ikkinchi"
                                    : key === "accent"
                                      ? "Urg'u"
                                      : key === "background"
                                        ? "Fon"
                                        : key === "text"
                                          ? "Matn"
                                          : key === "gradient1"
                                            ? "Gradient 1"
                                            : key === "gradient2"
                                              ? "Gradient 2"
                                              : key === "shadow"
                                                ? "Soya"
                                                : key === "border"
                                                  ? "Chegara"
                                                  : key}
                              </Label>
                              <Input
                                type="color"
                                value={value}
                                onChange={(e) =>
                                  handleColorChange(
                                    key as keyof TemplateConfig["colors"],
                                    e.target.value,
                                  )
                                }
                                className="w-12 h-10 p-1 border border-slate-200 rounded-lg cursor-pointer"
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
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Fonts Tab */}
                <TabsContent value="fonts" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Type className="w-5 h-5 text-blue-500" />
                        Shrift Sozlamalari
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(config.fonts).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="text-sm font-medium capitalize">
                            {key === "heading"
                              ? "Sarlavha Shrifti"
                              : key === "body"
                                ? "Asosiy Shrift"
                                : key === "accent"
                                  ? "Dekorativ Shrift"
                                  : key === "caption"
                                    ? "Kichik Matn Shrifti"
                                    : key}
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
                            <SelectTrigger className="border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fontOptions.map((font) => (
                                <SelectItem
                                  key={font.value}
                                  value={font.value}
                                  style={{ fontFamily: font.value }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span>{font.label}</span>
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 text-xs"
                                    >
                                      {font.category}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}

                      <Separator />

                      {/* Typography Controls */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">
                          Tipografiya Sozlamalari
                        </Label>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Harf Orasidagi Masofa:{" "}
                            {config.typography.letterSpacing}px
                          </Label>
                          <Slider
                            value={[config.typography.letterSpacing]}
                            onValueChange={(value) =>
                              updateConfig({
                                ...config,
                                typography: {
                                  ...config.typography,
                                  letterSpacing: value[0],
                                },
                              })
                            }
                            max={10}
                            min={-2}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Qator Balandligi: {config.typography.lineHeight}
                          </Label>
                          <Slider
                            value={[config.typography.lineHeight]}
                            onValueChange={(value) =>
                              updateConfig({
                                ...config,
                                typography: {
                                  ...config.typography,
                                  lineHeight: value[0],
                                },
                              })
                            }
                            max={3}
                            min={0.8}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Shrift Og'irligi: {config.typography.fontWeight}
                          </Label>
                          <Slider
                            value={[config.typography.fontWeight]}
                            onValueChange={(value) =>
                              updateConfig({
                                ...config,
                                typography: {
                                  ...config.typography,
                                  fontWeight: value[0],
                                },
                              })
                            }
                            max={900}
                            min={100}
                            step={100}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Matn Shakli
                          </Label>
                          <Select
                            value={config.typography.textTransform}
                            onValueChange={(val) =>
                              updateConfig({
                                ...config,
                                typography: {
                                  ...config.typography,
                                  textTransform: val as any,
                                },
                              })
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Oddiy</SelectItem>
                              <SelectItem value="uppercase">
                                BOSH HARFLAR
                              </SelectItem>
                              <SelectItem value="lowercase">
                                kichik harflar
                              </SelectItem>
                              <SelectItem value="capitalize">
                                Har So'z Bosh Harf
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layout className="w-5 h-5 text-blue-500" />
                        Layout Sozlamalari
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Layout Style */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Layout Uslubi
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {layoutStyles.map((style) => (
                            <button
                              key={style.value}
                              onClick={() =>
                                handleLayoutChange("style", style.value)
                              }
                              className={`p-3 border rounded-lg text-left transition-all ${
                                config.layout.style === style.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-slate-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{style.icon}</span>
                                <div>
                                  <div className="font-medium text-slate-700">
                                    {style.label}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {style.description}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Spacing Controls */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">
                          Bo'shliq Sozlamalari
                        </Label>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Ichki Bo'shliq: {config.layout.padding}px
                          </Label>
                          <Slider
                            value={[config.layout.padding]}
                            onValueChange={(value) =>
                              handleLayoutChange("padding", value[0])
                            }
                            max={80}
                            min={8}
                            step={4}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Tashqi Bo'shliq: {config.layout.margin}px
                          </Label>
                          <Slider
                            value={[config.layout.margin]}
                            onValueChange={(value) =>
                              handleLayoutChange("margin", value[0])
                            }
                            max={40}
                            min={0}
                            step={2}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Element Orasidagi Masofa: {config.layout.spacing}px
                          </Label>
                          <Slider
                            value={[config.layout.spacing]}
                            onValueChange={(value) =>
                              handleLayoutChange("spacing", value[0])
                            }
                            max={60}
                            min={8}
                            step={2}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Burchak Radiusi: {config.layout.borderRadius}px
                          </Label>
                          <Slider
                            value={[config.layout.borderRadius]}
                            onValueChange={(value) =>
                              handleLayoutChange("borderRadius", value[0])
                            }
                            max={40}
                            min={0}
                            step={2}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600">
                            Soya Kuchi: {config.layout.shadowIntensity}
                          </Label>
                          <Slider
                            value={[config.layout.shadowIntensity]}
                            onValueChange={(value) =>
                              handleLayoutChange("shadowIntensity", value[0])
                            }
                            max={30}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Alignment */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Matn Joylashuvi
                        </Label>
                        <div className="flex gap-2">
                          {[
                            { value: "left", icon: AlignLeft, label: "Chap" },
                            {
                              value: "center",
                              icon: AlignCenter,
                              label: "Markaz",
                            },
                            { value: "right", icon: AlignRight, label: "O'ng" },
                          ].map(({ value, icon: Icon, label }) => (
                            <Button
                              key={value}
                              variant={
                                config.layout.alignment === value
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleLayoutChange("alignment", value)
                              }
                              className="flex-1"
                            >
                              <Icon className="w-4 h-4 mr-1" />
                              {label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Effects Tab */}
                <TabsContent value="effects" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-500" />
                        Visual Effektlar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Filter Effects */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Filter Effektlari
                        </Label>

                        <div className="space-y-4">
                          {Object.entries(config.effects).map(
                            ([key, value]) => {
                              const max =
                                key === "blur"
                                  ? 10
                                  : key === "hueRotate"
                                    ? 360
                                    : 200;
                              const step =
                                key === "blur"
                                  ? 0.5
                                  : key === "hueRotate"
                                    ? 15
                                    : 5;
                              const unit =
                                key === "blur"
                                  ? "px"
                                  : key === "hueRotate"
                                    ? "°"
                                    : "%";

                              return (
                                <div key={key}>
                                  <Label className="text-sm text-slate-600">
                                    {key === "blur"
                                      ? "Bulaniqlik"
                                      : key === "brightness"
                                        ? "Yorqinlik"
                                        : key === "contrast"
                                          ? "Kontrast"
                                          : key === "saturate"
                                            ? "To'yinganlik"
                                            : key === "sepia"
                                              ? "Sepia"
                                              : key === "grayscale"
                                                ? "Kulrang"
                                                : key === "hueRotate"
                                                  ? "Rang Aylanishi"
                                                  : key === "opacity"
                                                    ? "Shaffoflik"
                                                    : key}
                                    : {value}
                                    {unit}
                                  </Label>
                                  <Slider
                                    value={[value]}
                                    onValueChange={(val) =>
                                      handleEffectChange(
                                        key as keyof TemplateConfig["effects"],
                                        val[0],
                                      )
                                    }
                                    max={max}
                                    min={0}
                                    step={step}
                                    className="mt-2"
                                  />
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Border Controls */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Chegara Sozlamalari
                        </Label>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-slate-600">
                              Chegara Kengligi: {config.border.width}px
                            </Label>
                            <Slider
                              value={[config.border.width]}
                              onValueChange={(value) =>
                                updateConfig({
                                  ...config,
                                  border: { ...config.border, width: value[0] },
                                })
                              }
                              max={10}
                              min={0}
                              step={1}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-slate-600">
                              Chegara Uslubi
                            </Label>
                            <Select
                              value={config.border.style}
                              onValueChange={(val) =>
                                updateConfig({
                                  ...config,
                                  border: {
                                    ...config.border,
                                    style: val as any,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solid">Uzluksiz</SelectItem>
                                <SelectItem value="dashed">
                                  Tire-tire
                                </SelectItem>
                                <SelectItem value="dotted">
                                  Nuqta-nuqta
                                </SelectItem>
                                <SelectItem value="double">
                                  Ikki tomonlama
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm text-slate-600">
                              Chegara Rangi
                            </Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                type="color"
                                value={config.border.color}
                                onChange={(e) =>
                                  updateConfig({
                                    ...config,
                                    border: {
                                      ...config.border,
                                      color: e.target.value,
                                    },
                                  })
                                }
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                type="text"
                                value={config.border.color}
                                onChange={(e) =>
                                  updateConfig({
                                    ...config,
                                    border: {
                                      ...config.border,
                                      color: e.target.value,
                                    },
                                  })
                                }
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Background */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Fon Sozlamalari
                        </Label>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-slate-600">
                              Fon Turi
                            </Label>
                            <Select
                              value={config.background.type}
                              onValueChange={(val) =>
                                updateConfig({
                                  ...config,
                                  background: {
                                    ...config.background,
                                    type: val as any,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solid">
                                  Oddiy Rang
                                </SelectItem>
                                <SelectItem value="gradient">
                                  Gradient
                                </SelectItem>
                                <SelectItem value="image">Rasm</SelectItem>
                                <SelectItem value="pattern">Naqsh</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {config.background.type === "gradient" && (
                            <div>
                              <Label className="text-sm text-slate-600">
                                Gradient Yo'nalishi
                              </Label>
                              <Select
                                value={config.background.gradientDirection}
                                onValueChange={(val) =>
                                  updateConfig({
                                    ...config,
                                    background: {
                                      ...config.background,
                                      gradientDirection: val,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {gradientDirections.map((dir) => (
                                    <SelectItem
                                      key={dir.value}
                                      value={dir.value}
                                    >
                                      {dir.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Animation Tab */}
                <TabsContent value="animation" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        Animatsiya Sozlamalari
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Animatsiyani Yoqish
                        </Label>
                        <Switch
                          checked={config.animations.enabled}
                          onCheckedChange={(checked) =>
                            updateConfig({
                              ...config,
                              animations: {
                                ...config.animations,
                                enabled: checked,
                              },
                            })
                          }
                        />
                      </div>

                      {config.animations.enabled && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Animatsiya Turi
                            </Label>
                            <Select
                              value={config.animations.type}
                              onValueChange={(val) =>
                                updateConfig({
                                  ...config,
                                  animations: {
                                    ...config.animations,
                                    type: val as any,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {animationTypes.map((anim) => (
                                  <SelectItem
                                    key={anim.value}
                                    value={anim.value}
                                  >
                                    {anim.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm text-slate-600">
                              Davomiyligi: {config.animations.duration}s
                            </Label>
                            <Slider
                              value={[config.animations.duration]}
                              onValueChange={(value) =>
                                updateConfig({
                                  ...config,
                                  animations: {
                                    ...config.animations,
                                    duration: value[0],
                                  },
                                })
                              }
                              max={3}
                              min={0.1}
                              step={0.1}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-slate-600">
                              Kechikish: {config.animations.delay}s
                            </Label>
                            <Slider
                              value={[config.animations.delay]}
                              onValueChange={(value) =>
                                updateConfig({
                                  ...config,
                                  animations: {
                                    ...config.animations,
                                    delay: value[0],
                                  },
                                })
                              }
                              max={2}
                              min={0}
                              step={0.1}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-slate-600">
                              Animatsiya Uslubi
                            </Label>
                            <Select
                              value={config.animations.easing}
                              onValueChange={(val) =>
                                updateConfig({
                                  ...config,
                                  animations: {
                                    ...config.animations,
                                    easing: val,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ease">Ease</SelectItem>
                                <SelectItem value="ease-in">Ease In</SelectItem>
                                <SelectItem value="ease-out">
                                  Ease Out
                                </SelectItem>
                                <SelectItem value="ease-in-out">
                                  Ease In Out
                                </SelectItem>
                                <SelectItem value="linear">Linear</SelectItem>
                                <SelectItem value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">
                                  Bounce
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel - Enhanced Live Preview */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <Card className="shadow-xl border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-blue-500" />
                        <div>
                          <CardTitle className="text-lg">
                            Jonli Oldindan Ko'rish
                          </CardTitle>
                          <p className="text-sm text-slate-600">
                            Real vaqtda yangilanadi
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={
                            previewDevice === "desktop" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setPreviewDevice("desktop")}
                        >
                          <Monitor className="w-4 h-4 mr-1" />
                          Desktop
                        </Button>
                        <Button
                          variant={
                            previewDevice === "mobile" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setPreviewDevice("mobile")}
                        >
                          <Smartphone className="w-4 h-4 mr-1" />
                          Mobil
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white min-h-[400px] flex items-center justify-center">
                      <div
                        className={`transition-all duration-500 ${
                          previewDevice === "mobile"
                            ? "max-w-sm"
                            : "max-w-2xl w-full"
                        }`}
                      >
                        {/* Enhanced Preview */}
                        <div
                          className="transition-all duration-500 hover:scale-105"
                          style={getPreviewStyle()}
                        >
                          <div
                            className={`space-y-${Math.floor(config.layout.spacing / 4)}`}
                          >
                            {/* Decorative Header */}
                            <div className="flex justify-center items-center space-x-2 mb-6">
                              <div
                                className="w-16 h-0.5 transition-all duration-300"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                              <Heart
                                className="w-5 h-5 animate-pulse"
                                style={{ color: config.colors.accent }}
                              />
                              <div
                                className="w-16 h-0.5 transition-all duration-300"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                            </div>

                            {/* Header Text */}
                            <div className="text-center space-y-2">
                              <div
                                className="text-sm font-medium tracking-widest uppercase opacity-75"
                                style={{
                                  color: config.colors.secondary,
                                  fontFamily: config.fonts.caption,
                                  letterSpacing: `${config.typography.letterSpacing}px`,
                                }}
                              >
                                To'y Taklifnomasi
                              </div>
                            </div>

                            {/* Names */}
                            <div className="text-center space-y-4">
                              <h1
                                className={`${previewDevice === "mobile" ? "text-2xl" : "text-4xl"} font-bold tracking-wide transition-all duration-300`}
                                style={{
                                  color: config.colors.primary,
                                  fontFamily: config.fonts.heading,
                                  letterSpacing: `${config.typography.letterSpacing}px`,
                                  lineHeight: config.typography.lineHeight,
                                  fontWeight: config.typography.fontWeight,
                                  textTransform: config.typography
                                    .textTransform as any,
                                  textDecoration: config.typography
                                    .textDecoration as any,
                                  textShadow:
                                    config.typography.textShadow !== "none"
                                      ? config.typography.textShadow
                                      : "none",
                                }}
                              >
                                {templateData.groomName}
                              </h1>
                              <div
                                className={`${previewDevice === "mobile" ? "text-3xl" : "text-5xl"}`}
                                style={{
                                  color: config.colors.accent,
                                  fontFamily: config.fonts.accent,
                                }}
                              >
                                &
                              </div>
                              <h1
                                className={`${previewDevice === "mobile" ? "text-2xl" : "text-4xl"} font-bold tracking-wide transition-all duration-300`}
                                style={{
                                  color: config.colors.primary,
                                  fontFamily: config.fonts.heading,
                                  letterSpacing: `${config.typography.letterSpacing}px`,
                                  lineHeight: config.typography.lineHeight,
                                  fontWeight: config.typography.fontWeight,
                                  textTransform: config.typography
                                    .textTransform as any,
                                  textDecoration: config.typography
                                    .textDecoration as any,
                                  textShadow:
                                    config.typography.textShadow !== "none"
                                      ? config.typography.textShadow
                                      : "none",
                                }}
                              >
                                {templateData.brideName}
                              </h1>
                            </div>

                            {/* Decorative Divider */}
                            <div className="flex justify-center items-center space-x-3 my-6">
                              <Star
                                className="w-4 h-4 animate-spin"
                                style={{
                                  color: config.colors.accent,
                                  animationDuration: "3s",
                                }}
                              />
                              <div
                                className="w-12 h-0.5"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                              <Sparkles
                                className="w-4 h-4 animate-pulse"
                                style={{ color: config.colors.accent }}
                              />
                              <div
                                className="w-12 h-0.5"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                              <Star
                                className="w-4 h-4 animate-spin"
                                style={{
                                  color: config.colors.accent,
                                  animationDuration: "3s",
                                  animationDirection: "reverse",
                                }}
                              />
                            </div>

                            {/* Date and Time */}
                            <div className="text-center space-y-2">
                              <div
                                className={`${previewDevice === "mobile" ? "text-lg" : "text-xl"} font-semibold`}
                                style={{
                                  color: config.colors.primary,
                                  fontFamily: config.fonts.body,
                                }}
                              >
                                {templateData.weddingDate}
                              </div>
                              <div
                                className={`${previewDevice === "mobile" ? "text-base" : "text-lg"}`}
                                style={{
                                  color: config.colors.secondary,
                                  fontFamily: config.fonts.body,
                                }}
                              >
                                {templateData.weddingTime}
                              </div>
                            </div>

                            {/* Venue */}
                            <div className="text-center space-y-3">
                              <div
                                className="w-16 h-0.5 mx-auto"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                              <div
                                className={`${previewDevice === "mobile" ? "text-lg" : "text-xl"} font-medium`}
                                style={{
                                  color: config.colors.primary,
                                  fontFamily: config.fonts.body,
                                }}
                              >
                                {templateData.venue}
                              </div>
                              <div
                                className={`${previewDevice === "mobile" ? "text-sm" : "text-base"} leading-relaxed`}
                                style={{
                                  color: config.colors.secondary,
                                  fontFamily: config.fonts.body,
                                }}
                              >
                                {templateData.address}
                              </div>
                            </div>

                            {/* Message */}
                            <div
                              className={`${previewDevice === "mobile" ? "text-sm px-3" : "text-base px-6"} leading-relaxed italic text-center`}
                              style={{
                                color: config.colors.text,
                                fontFamily: config.fonts.body,
                              }}
                            >
                              "{templateData.customMessage}"
                            </div>

                            {/* Additional Info */}
                            {templateData.dresscode && (
                              <div className="text-center">
                                <div
                                  className="text-sm font-medium"
                                  style={{
                                    color: config.colors.primary,
                                    fontFamily: config.fonts.caption,
                                  }}
                                >
                                  Kiyim kodi: {templateData.dresscode}
                                </div>
                              </div>
                            )}

                            {/* RSVP Info */}
                            {templateData.rsvpInfo && (
                              <div className="text-center">
                                <div
                                  className="text-sm"
                                  style={{
                                    color: config.colors.secondary,
                                    fontFamily: config.fonts.caption,
                                  }}
                                >
                                  {templateData.rsvpInfo}
                                </div>
                              </div>
                            )}

                            {/* Footer Decoration */}
                            <div className="flex justify-center items-center space-x-3 mt-8">
                              <div
                                className="w-20 h-0.5"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                              <Heart
                                className="w-5 h-5 animate-bounce"
                                style={{ color: config.colors.accent }}
                              />
                              <div
                                className="w-20 h-0.5"
                                style={{
                                  backgroundColor: config.colors.accent,
                                }}
                              />
                            </div>

                            {/* Real-time indicator */}
                            <div className="flex justify-center items-center mt-4 opacity-50">
                              <Zap className="w-3 h-3 text-green-500 animate-pulse mr-1" />
                              <span
                                className="text-xs"
                                style={{
                                  color: config.colors.text,
                                  fontFamily: config.fonts.caption,
                                }}
                              >
                                Real-time • Professional
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Yuklab olish
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Ulashish
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        Nusxalash
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Screen Preview Modal */}
        {fullScreenPreview && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="absolute top-4 right-4 z-10">
              <Button
                onClick={() => setFullScreenPreview(false)}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4 mr-2" />
                Yopish
              </Button>
            </div>

            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Button
                onClick={() => setPreviewDevice("desktop")}
                variant={previewDevice === "desktop" ? "default" : "outline"}
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button
                onClick={() => setPreviewDevice("mobile")}
                variant={previewDevice === "mobile" ? "default" : "outline"}
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobil
              </Button>
            </div>

            <div className="w-full h-full p-8 overflow-auto">
              <div
                className={`mx-auto transition-all duration-300 ${
                  previewDevice === "mobile" ? "max-w-sm" : "max-w-4xl"
                }`}
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div style={getPreviewStyle()}>
                    {/* Full preview content would go here */}
                    <div className="text-center p-8">
                      <h1
                        className="text-4xl font-bold mb-4"
                        style={{ color: config.colors.primary }}
                      >
                        {templateData.groomName} & {templateData.brideName}
                      </h1>
                      <p
                        className="text-xl"
                        style={{ color: config.colors.secondary }}
                      >
                        {templateData.weddingDate} • {templateData.weddingTime}
                      </p>
                      <p
                        className="text-lg mt-4"
                        style={{ color: config.colors.text }}
                      >
                        {templateData.venue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
