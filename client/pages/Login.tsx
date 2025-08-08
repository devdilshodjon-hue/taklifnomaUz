import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen wedding-gradient flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-wedding-rose" />
            <span className="font-script text-2xl text-wedding-rose">ForeverTogether</span>
          </Link>
          <h1 className="font-serif text-3xl text-foreground mb-2">Welcome Back</h1>
          <p className="text-foreground/70">Sign in to manage your invitations</p>
        </div>
        
        <div className="bg-card p-8 rounded-2xl shadow-lg border border-wedding-blush/20">
          {/* Login form will be implemented here */}
          <div className="text-center py-12 text-foreground/60">
            <p className="mb-4">Login form coming soon...</p>
            <Link to="/dashboard" className="text-wedding-rose hover:underline">
              Continue to Dashboard (Demo)
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-foreground/60">
          Don't have an account?{" "}
          <Link to="/register" className="text-wedding-rose hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
