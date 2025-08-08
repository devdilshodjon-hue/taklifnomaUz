import { Link, useLocation } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  showBackButton?: boolean;
  className?: string;
}

export default function Navigation({
  showBackButton = false,
  className = "",
}: NavigationProps) {
  const location = useLocation();

  const navLinks = [
    { href: "/#features", label: "Imkoniyatlar", isAnchor: true },
    { href: "/templates", label: "Shablonlar", isAnchor: false },
    { href: "/pricing", label: "Narxlar", isAnchor: false },
  ];

  const isCurrentPage = (href: string) => {
    if (href.startsWith("/#")) return false; // Anchor links don't highlight
    return location.pathname === href;
  };

  return (
    <nav
      className={`bg-card border-b border-border p-4 sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Bosh sahifaga qaytish
              </Link>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              TaklifNoma
            </span>
          </Link>
        </div>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`transition-colors font-medium ${
                  isCurrentPage(link.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Kirish</Link>
          </Button>
          <Button asChild className="button-modern">
            <Link to="/register">
              Boshlash
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
