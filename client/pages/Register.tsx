import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  // Password validation
  const passwordValidation = {
    length: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError("Parol talablarga javob bermaydi");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Parollar mos kelmaydi");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }

    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-background flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Muvaffaqiyatli ro'yxatdan o'tdingiz!
          </h1>
          <p className="text-muted-foreground mb-6">
            Email manzilingizni tasdiqlash uchun emailingizni tekshiring.
          </p>
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Dashboard ga yo'naltirilmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30 flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-bounce">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">TaklifNoma</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Hisobingizni Yarating
          </h1>
          <p className="text-muted-foreground">
            Chiroyli taklifnomalar yaratishni boshlang
          </p>
        </div>

        {/* Register Form */}
        <div className="card-modern p-8 shadow-2xl backdrop-blur-sm border-primary/10 animate-slide-up">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50/50 animate-shake">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Register */}
          <Button
            onClick={handleGoogleRegister}
            disabled={loading}
            variant="outline"
            className="w-full mb-6 h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Google bilan ro'yxatdan o'tish"
            )}
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">yoki</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Email Register Form */}
          <form onSubmit={handleEmailRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  Ism
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ismingiz"
                    className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Familiya
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Familiyangiz"
                    className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email manzil
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Parol
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.length ? 'text-green-700' : 'text-gray-500'}>
                      Kamida 6 ta belgi
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.hasUpperCase ? 'text-green-700' : 'text-gray-500'}>
                      Katta harf
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={passwordValidation.hasNumber ? 'text-green-700' : 'text-gray-500'}>
                      Raqam
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Parolni tasdiqlang
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {confirmPassword && (
                <div className="flex items-center gap-2 text-xs mt-2">
                  <div className={`w-2 h-2 rounded-full ${doPasswordsMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={doPasswordsMatch ? 'text-green-700' : 'text-red-700'}>
                    {doPasswordsMatch ? 'Parollar mos keladi' : 'Parollar mos kelmaydi'}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !firstName || !lastName || !email || !isPasswordValid || !doPasswordsMatch}
              className="w-full h-12 primary-gradient font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Ro'yxatdan o'tish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Ro'yxatdan o'tish orqali siz bizning{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Foydalanish shartlari
              </Link>{" "}
              va{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Maxfiylik siyosati
              </Link>
              ga roziligingizni bildirasiz.
            </p>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8 animate-fade-in delay-300">
          <p className="text-muted-foreground">
            Allaqachon hisobingiz bormi?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Kirish
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
