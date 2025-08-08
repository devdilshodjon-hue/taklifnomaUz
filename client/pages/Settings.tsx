import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Shield,
  Bell,
  Eye,
  Lock,
  Trash2,
  Download,
  Key,
  Smartphone,
  Mail,
  Globe,
  Palette,
  Moon,
  Sun,
  Monitor,
  Save,
  AlertTriangle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProtectedRoute from "@/components/ProtectedRoute";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  rsvpUpdates: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "private";
  showEmail: boolean;
  showPhone: boolean;
  allowSearchIndexing: boolean;
  dataProcessing: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    rsvpUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "private",
    showEmail: false,
    showPhone: false,
    allowSearchIndexing: false,
    dataProcessing: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // In a real app, you would load these from the database
    // For now, we'll use default values
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, save to database
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess("Bildirishnoma sozlamalari saqlandi!");
    } catch (error: any) {
      setError("Sozlamalar saqlanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, save to database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Maxfiylik sozlamalari saqlandi!");
    } catch (error: any) {
      setError("Sozlamalar saqlanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Parollar mos kelmaydi");
      return;
    }

    if (newPassword.length < 6) {
      setError("Parol kamida 6 ta belgi bo'lishi kerak");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess("Parol muvaffaqiyatli o'zgartirildi!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.message || "Parol o'zgartirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      // First delete user data
      if (user) {
        // Delete user's invitations
        await supabase.from("invitations").delete().eq("user_id", user.id);

        // Delete profile
        await supabase.from("profiles").delete().eq("id", user.id);
      }

      // Then delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user?.id || "");
      if (error) throw error;

      navigate("/");
    } catch (error: any) {
      setError("Hisobni o'chirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      // Get user data
      const { data: invitations } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const exportData = {
        profile,
        invitations,
        exportDate: new Date().toISOString(),
      };

      // Download as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taklifnoma-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess("Ma'lumotlar muvaffaqiyatli yuklab olindi!");
    } catch (error: any) {
      setError("Ma'lumotlarni yuklab olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
        {/* Header */}
        <nav className="bg-card/80 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover-scale">
                <Link to="/profile">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Profilga qaytish
                </Link>
              </Button>
              <h1 className="font-heading text-xl font-bold text-foreground">
                Sozlamalar
              </h1>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-6">
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

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="notifications">Bildirishnomalar</TabsTrigger>
              <TabsTrigger value="privacy">Maxfiylik</TabsTrigger>
              <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
              <TabsTrigger value="appearance">Ko'rinish</TabsTrigger>
              <TabsTrigger value="account">Hisob</TabsTrigger>
            </TabsList>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="card-modern p-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Bildirishnoma Sozlamalari
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Email Bildirishnomalar
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Muhim yangilanishlar haqida email orqali xabardor
                        bo'ling
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        SMS Bildirishnomalar
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tezkor xabarlar uchun SMS bildirishnomalar
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smsNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        RSVP Yangilanishlari
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Mehmonlar javob berganida xabardor bo'ling
                      </p>
                    </div>
                    <Switch
                      checked={notifications.rsvpUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          rsvpUpdates: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Marketing Xabarlari
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Yangi imkoniyatlar va takliflar haqida xabarlar
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          marketingEmails: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Haftalik Hisobotlar
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Taklifnomalar statistikasi bo'yicha haftalik hisobot
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          weeklyReports: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={saveNotificationSettings}
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
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <div className="card-modern p-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Maxfiylik Sozlamalari
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Email Ko'rsatish
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Boshqalar sizning email manzilingizni ko'ra olsinmi
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({ ...prev, showEmail: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Telefon Ko'rsatish
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Boshqalar sizning telefon raqamingizni ko'ra olsinmi
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({ ...prev, showPhone: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Qidiruv Indexlash
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Google kabi qidiruv tizimlarida ko'rinishga ruxsat
                        bering
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowSearchIndexing}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({
                          ...prev,
                          allowSearchIndexing: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Ma'lumotlar Qayta Ishlash
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Xizmatni yaxshilash uchun ma'lumotlaringizni ishlatishga
                        rozilik
                      </p>
                    </div>
                    <Switch
                      checked={privacy.dataProcessing}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({
                          ...prev,
                          dataProcessing: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={savePrivacySettings}
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
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <div className="card-modern p-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Xavfsizlik Sozlamalari
                  </h2>
                </div>

                {/* Password Change */}
                <div className="border border-border rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Parolni O'zgartirish
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="currentPassword">Joriy parol</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Yangi parol</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Parolni tasdiqlang
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={changePassword}
                    disabled={loading || !newPassword || !confirmPassword}
                    variant="outline"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Parolni O'zgartirish
                  </Button>
                </div>

                {/* Other Security Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Kirish Ogohlantirishlari
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Yangi qurilmadan kirilganida xabardor bo'ling
                      </p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) =>
                        setSecurity((prev) => ({
                          ...prev,
                          loginAlerts: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="card-modern p-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Ko'rinish Sozlamalari
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Mavzu
                    </Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "light", label: "Yorqin", icon: Sun },
                        { value: "dark", label: "Qorong'i", icon: Moon },
                        { value: "system", label: "Avtomatik", icon: Monitor },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value as any)}
                            className={`p-4 border-2 rounded-lg transition-all hover:border-primary/50 ${
                              theme === option.value
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">
                              {option.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <div className="card-modern p-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Hisob Sozlamalari
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Export Data */}
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Ma'lumotlarni Yuklab Olish
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Barcha shaxsiy ma'lumotlaringizni JSON formatda yuklab
                      oling
                    </p>
                    <Button
                      onClick={exportData}
                      disabled={loading}
                      variant="outline"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Ma'lumotlarni Yuklab Olish
                    </Button>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50/50">
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Xavfli Zona
                    </h3>
                    <p className="text-sm text-red-600 mb-4">
                      Hisobingizni butunlay o'chirish. Bu amal qaytarib
                      bo'lmaydi!
                    </p>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hisobni O'chirish
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Hisobni o'chirishni tasdiqlang
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu amal qaytarib bo'lmaydi. Barcha ma'lumotlaringiz,
                            taklifnomalaringiz va mehmonlar ro'yxati butunlay
                            yo'q qilinadi.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={deleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ha, o'chirish
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
