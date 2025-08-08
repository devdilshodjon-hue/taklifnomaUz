import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, ArrowLeft, Save, Eye, Calendar, MapPin, Clock, Upload, Users, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface InvitationTemplate {
  id: string;
  name: string;
  preview: string;
  description: string;
}

export default function CreateInvitation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });

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
    selectedTemplate: "",
    uploadedImage: null as File | null,
    rsvpDeadline: "",
  });

  const templates: InvitationTemplate[] = [
    {
      id: "classic",
      name: "Classic Elegance",
      preview: "🌸",
      description: "Timeless design with floral accents",
    },
    {
      id: "modern",
      name: "Modern Minimalist",
      preview: "💍",
      description: "Clean lines and contemporary style",
    },
    {
      id: "rustic",
      name: "Rustic Romance",
      preview: "🌿",
      description: "Natural elements with warm tones",
    },
    {
      id: "luxury",
      name: "Luxury Gold",
      preview: "✨",
      description: "Sophisticated with gold accents",
    },
  ];

  const addGuest = () => {
    if (newGuest.name.trim()) {
      const guest: Guest = {
        id: Date.now().toString(),
        ...newGuest,
      };
      setGuests([...guests, guest]);
      setNewGuest({ name: "", email: "", phone: "" });
    }
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, uploadedImage: file });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call to create invitation
    setTimeout(() => {
      setIsLoading(false);
      // Generate a mock invitation ID and redirect
      const invitationId = "inv-" + Math.random().toString(36).substr(2, 9);
      navigate(`/invitation/${invitationId}`);
    }, 2000);
  };

  const handlePreview = () => {
    // Open preview in new tab or modal
    window.open(`/invitation/preview`, '_blank');
  };

  const steps = [
    { id: 1, title: "Basic Details", description: "Couple & Date Info" },
    { id: 2, title: "Venue & Location", description: "Where & When" },
    { id: 3, title: "Design & Message", description: "Personalization" },
    { id: 4, title: "Guest List", description: "Who's Invited" },
  ];

  return (
    <div className="min-h-screen bg-wedding-cream">
      {/* Navigation */}
      <nav className="bg-card border-b border-wedding-blush/20 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-wedding-rose" />
              <span className="font-script text-2xl text-wedding-rose">ForeverTogether</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              className="bg-wedding-rose hover:bg-wedding-rose/90 text-white" 
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save & Generate Link
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Create Your Invitation</h1>
          <p className="text-foreground/70">Design a beautiful invitation that perfectly captures your special day</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.id 
                      ? "bg-wedding-rose text-white" 
                      : "bg-wedding-blush/30 text-foreground/60"
                  }`}>
                    {step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-foreground/60">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 transition-colors ${
                    currentStep > step.id ? "bg-wedding-rose" : "bg-wedding-blush/30"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-wedding-blush/20">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-4">Tell us about the happy couple</h2>
                <p className="text-foreground/70 mb-6">Let's start with the most important details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="groomName" className="text-foreground/80">Groom's Full Name</Label>
                  <Input
                    id="groomName"
                    type="text"
                    placeholder="Enter groom's name"
                    className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brideName" className="text-foreground/80">Bride's Full Name</Label>
                  <Input
                    id="brideName"
                    type="text"
                    placeholder="Enter bride's name"
                    className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weddingDate" className="text-foreground/80">Wedding Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input
                      id="weddingDate"
                      type="date"
                      className="pl-10 h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weddingTime" className="text-foreground/80">Wedding Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input
                      id="weddingTime"
                      type="time"
                      className="pl-10 h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                      value={formData.weddingTime}
                      onChange={(e) => setFormData({ ...formData, weddingTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rsvpDeadline" className="text-foreground/80">RSVP Deadline</Label>
                <Input
                  id="rsvpDeadline"
                  type="date"
                  className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                  value={formData.rsvpDeadline}
                  onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Venue & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-4">Where will the magic happen?</h2>
                <p className="text-foreground/70 mb-6">Tell your guests about the venue</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="text-foreground/80">Venue Name</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    id="venue"
                    type="text"
                    placeholder="Rose Garden Chapel"
                    className="pl-10 h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground/80">Street Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Garden Lane"
                  className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground/80">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-foreground/80">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="State"
                    className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-foreground/80">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    placeholder="12345"
                    className="h-12 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-wedding-blush/10 p-4 rounded-lg">
                <p className="text-sm text-foreground/70">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  A Google Map will be automatically embedded in your invitation showing the venue location.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Design & Message */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-4">Make it personal</h2>
                <p className="text-foreground/70 mb-6">Choose a design and add your personal touch</p>
              </div>

              <div className="space-y-4">
                <Label className="text-foreground/80">Choose a Template</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                        formData.selectedTemplate === template.id
                          ? "border-wedding-rose bg-wedding-rose/5"
                          : "border-wedding-blush/30 hover:border-wedding-rose/50"
                      }`}
                      onClick={() => setFormData({ ...formData, selectedTemplate: template.id })}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{template.preview}</div>
                        <h3 className="font-serif text-lg text-foreground">{template.name}</h3>
                        <p className="text-sm text-foreground/60">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage" className="text-foreground/80">Custom Message</Label>
                <Textarea
                  id="customMessage"
                  placeholder="We request the honor of your presence as we celebrate our love and begin our journey together as husband and wife."
                  className="min-h-32 border-wedding-blush/30 focus:border-wedding-rose focus:ring-wedding-rose/20"
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                />
                <p className="text-sm text-foreground/60">This message will appear on your invitation</p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/80">Upload Photo (Optional)</Label>
                <div className="border-2 border-dashed border-wedding-blush/30 rounded-xl p-8 text-center hover:border-wedding-rose/50 transition-colors">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2" />
                    <p className="text-foreground/60">Click to upload a photo</p>
                    <p className="text-sm text-foreground/40">PNG, JPG up to 10MB</p>
                  </label>
                  {formData.uploadedImage && (
                    <p className="text-sm text-wedding-rose mt-2">
                      ✓ {formData.uploadedImage.name} uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Guest List */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-4">Who's invited?</h2>
                <p className="text-foreground/70 mb-6">Add your guests to send personalized invitations</p>
              </div>

              <div className="bg-wedding-blush/10 p-6 rounded-xl">
                <h3 className="font-medium text-foreground mb-4">Add New Guest</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Guest name"
                      value={newGuest.name}
                      onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                      className="h-10 border-wedding-blush/30"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Email (optional)"
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      className="h-10 border-wedding-blush/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Phone (optional)"
                      type="tel"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                      className="h-10 border-wedding-blush/30"
                    />
                    <Button onClick={addGuest} size="sm" className="bg-wedding-rose hover:bg-wedding-rose/90">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {guests.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Guest List ({guests.length} guests)
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {guests.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-3 bg-card border border-wedding-blush/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{guest.name}</p>
                          <div className="flex gap-4 text-sm text-foreground/60">
                            {guest.email && <span>{guest.email}</span>}
                            {guest.phone && <span>{guest.phone}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuest(guest.id)}
                          className="text-foreground/40 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {guests.length === 0 && (
                <div className="text-center py-8 text-foreground/60">
                  <Users className="w-12 h-12 mx-auto mb-4 text-wedding-blush" />
                  <p>No guests added yet</p>
                  <p className="text-sm">Add guests above to create personalized invitations</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-wedding-blush/20">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="border-wedding-blush/30"
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="bg-wedding-rose hover:bg-wedding-rose/90 text-white"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-wedding-rose hover:bg-wedding-rose/90 text-white"
              >
                {isLoading ? "Saving..." : "Create Invitation"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
