import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Upload,
  Users,
  Plus,
  X,
  Filter,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveInvitationToSupabase } from "@/lib/invitationSaver";
import {
  templateManager,
  defaultWeddingTemplates,
  templateCategories,
  getTemplatesByCategory,
  type DefaultTemplate,
} from "@/lib/defaultTemplates";
import TemplateRenderer from "@/components/TemplateRenderer";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function CreateInvitation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get selected template from location state
  const selectedTemplateFromLocation = location?.state?.selectedTemplate;

  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    weddingDate: "",
    weddingTime: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    customMessage: "",
    selectedTemplate: selectedTemplateFromLocation || "classic-rose",
    rsvpDeadline: "",
  });

  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);

  // URL generation is now handled in invitationSaver.ts

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    console.log("🚀 Enhanced invitation creation started...");

    setIsLoading(true);
    setError("");
    setSuccess("");

    // Enhanced invitation save with URL generation
    const result = await saveInvitationToSupabase(user, formData);

    if (result.success) {
      if (result.url) {
        setSuccess(`Taklifnoma yaratildi! URL: ${result.url}`);
        console.log("🔗 Invitation URL generated:", result.url);
      } else {
        setSuccess("Taklifnoma muvaffaqiyatli yaratildi!");
      }

      // Navigate to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Slightly longer to show URL
    } else {
      if (result.data && result.url) {
        // Saved to localStorage as fallback but still has URL
        setSuccess(`Taklifnoma mahalliy saqlandi. URL: ${result.url}`);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(result.error || "Taklifnoma yaratishda xatolik");
      }
    }

    setIsLoading(false);
  };

  const addGuest = () => {
    const newGuest: Guest = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
    };
    setGuests([...guests, newGuest]);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest,
      ),
    );
  };

  const templates =
    selectedCategory === "all"
      ? defaultWeddingTemplates
      : getTemplatesByCategory(selectedCategory);

  // Mock invitation data for preview
  const getMockInvitationData = () => ({
    id: "preview",
    groom_name: formData.groomName || "Jahongir",
    bride_name: formData.brideName || "Sarvinoz",
    wedding_date: formData.weddingDate || "2024-06-15",
    wedding_time: formData.weddingTime || "16:00",
    venue: formData.venue || "Atirgul Bog'i",
    address:
      formData.address || "Toshkent sh., Yunusobod t., Bog' ko'chasi 123",
    city: formData.city || "Toshkent",
    custom_message:
      formData.customMessage ||
      "Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz.",
    template_id: formData.selectedTemplate,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 p-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                    Taklifnoma Yaratish
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Chiroyli taklifnoma yarating
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setPreviewOpen(true)}
                variant="outline"
                size="sm"
                className="hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Eye className="w-4 h-4 mr-2" />
                Oldindan Ko'rish
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Saqlash
              </Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Form */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Asosiy Ma'lumotlar
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="groomName"
                        className="text-sm font-medium"
                      >
                        Kuyov Ismi *
                      </Label>
                      <Input
                        id="groomName"
                        value={formData.groomName}
                        onChange={(e) =>
                          handleInputChange("groomName", e.target.value)
                        }
                        placeholder="Jahongir"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="brideName"
                        className="text-sm font-medium"
                      >
                        Kelin Ismi *
                      </Label>
                      <Input
                        id="brideName"
                        value={formData.brideName}
                        onChange={(e) =>
                          handleInputChange("brideName", e.target.value)
                        }
                        placeholder="Sarvinoz"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="weddingDate"
                        className="text-sm font-medium"
                      >
                        To'y Sanasi *
                      </Label>
                      <Input
                        id="weddingDate"
                        type="date"
                        value={formData.weddingDate}
                        onChange={(e) =>
                          handleInputChange("weddingDate", e.target.value)
                        }
                        className="mt-1"
                        required
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
                        type="time"
                        value={formData.weddingTime}
                        onChange={(e) =>
                          handleInputChange("weddingTime", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="venue" className="text-sm font-medium">
                      Joy Nomi *
                    </Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) =>
                        handleInputChange("venue", e.target.value)
                      }
                      placeholder="Atirgul Bog'i"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      To'liq Manzil *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Toshkent sh., Yunusobod t., Bog' ko'chasi 123"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        Shahar
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Toshkent"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        Viloyat
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="Toshkent viloyati"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-medium">
                        Pochta Indeksi
                      </Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        placeholder="100000"
                        className="mt-1"
                      />
                    </div>
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
                      value={formData.customMessage}
                      onChange={(e) =>
                        handleInputChange("customMessage", e.target.value)
                      }
                      placeholder="Bizning sevgi va baxt to'la kunimizni birga nishonlash uchun sizni taklif qilamiz."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="rsvpDeadline"
                      className="text-sm font-medium"
                    >
                      RSVP Muddati
                    </Label>
                    <Input
                      id="rsvpDeadline"
                      type="date"
                      value={formData.rsvpDeadline}
                      onChange={(e) =>
                        handleInputChange("rsvpDeadline", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Shablon Tanlash
                </h2>

                {/* Category Filter */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {templateCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="text-xs"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() =>
                        handleInputChange("selectedTemplate", template.id)
                      }
                      className={`p-3 border rounded-lg text-left transition-all hover:shadow-md ${
                        formData.selectedTemplate === template.id
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div
                        className="aspect-[3/4] mb-2 rounded-md flex items-center justify-center text-2xl"
                        style={{
                          backgroundColor: template.colors.background,
                          color: template.colors.primary,
                        }}
                      >
                        {template.preview}
                      </div>
                      <div className="text-xs font-medium text-slate-700">
                        {template.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {template.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests (Optional) */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Mehmonlar (Ixtiyoriy)
                  </h2>
                  <Button
                    onClick={addGuest}
                    size="sm"
                    variant="outline"
                    className="hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Mehmon Qo'shish
                  </Button>
                </div>

                {guests.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">
                    Mehmonlar qo'shilmagan. Keyin ham qo'shishingiz mumkin.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex gap-3 items-center p-3 border border-slate-200 rounded-lg"
                      >
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <Input
                            placeholder="Ism"
                            value={guest.name}
                            onChange={(e) =>
                              updateGuest(guest.id, "name", e.target.value)
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={guest.email}
                            onChange={(e) =>
                              updateGuest(guest.id, "email", e.target.value)
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Telefon"
                            value={guest.phone}
                            onChange={(e) =>
                              updateGuest(guest.id, "phone", e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                        <Button
                          onClick={() => removeGuest(guest.id)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:border-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Oldindan Ko'rish
                </h2>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <TemplateRenderer
                    invitation={getMockInvitationData()}
                    guestName="Hurmatli Mehmon"
                  />
                </div>

                <div className="mt-4 text-center">
                  <Button
                    onClick={() => setPreviewOpen(true)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    To'liq Ekranda Ko'rish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Preview Modal */}
        {previewOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Taklifnoma Oldindan Ko'rish
                </h3>
                <Button
                  onClick={() => setPreviewOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6">
                <TemplateRenderer
                  invitation={getMockInvitationData()}
                  guestName="Hurmatli Mehmon"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
