import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles, Mail, Lock, Eye, EyeOff, User, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Ism kiritish shart";
    if (!formData.lastName.trim()) newErrors.lastName = "Familiya kiritish shart";
    if (!formData.email.trim()) newErrors.email = "Email kiritish shart";
    if (!formData.password) newErrors.password = "Parol kiritish shart";
    if (formData.password.length < 8) newErrors.password = "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Parollar mos kelmadi";
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Shartlarga rozi bo'lishingiz kerak";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 2000);
  };

  const handleGoogleSignUp = () => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Bosh sahifaga qaytish */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Bosh sahifaga qaytish
            </Link>
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">TaklifNoma</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Hisobingizni yarating</h1>
          <p className="text-muted-foreground">Bugun chiroyli taklifnomalar yaratishni boshlang</p>
        </div>
        
        {/* Forma */}
        <div className="card-modern p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground font-medium">Ism</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jahongir"
                    className="input-modern pl-11 h-12"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground font-medium">Familiya</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Aliyev"
                  className="input-modern h-12"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
                {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jahongir@misol.com"
                  className="input-modern pl-11 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Kuchli parol yarating"
                  className="input-modern pl-11 pr-11 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Parolni tasdiqlang</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Parolni qayta kiriting"
                  className="input-modern pl-11 pr-11 h-12"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  />
                  <div className="w-5 h-5 border-2 border-border rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {formData.agreeToTerms && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span>
                  Men{" "}
                  <Link to="/terms" className="text-primary hover:underline font-medium">Foydalanish Shartlari</Link>
                  {" "}va{" "}
                  <Link to="/privacy" className="text-primary hover:underline font-medium">Maxfiylik Siyosati</Link>
                  ga roziman
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-destructive text-sm">{errors.agreeToTerms}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full button-modern h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Hisob yaratilmoqda...
                </div>
              ) : (
                "Hisob Yaratish"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">Yoki ro'yxatdan o'ting</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 h-12 border-border hover:bg-theme-gray-light/50"
              onClick={handleGoogleSignUp}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google bilan davom etish
            </Button>
          </div>
        </div>

        <p className="text-center mt-6 text-muted-foreground">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-medium">
            Bu yerda kiring
          </Link>
        </p>
      </div>
    </div>
  );
}
