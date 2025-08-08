import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Globe, Users, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create beautiful invitations in under 3 minutes"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Share Instantly",
      description: "One link, unlimited guests, instant RSVPs"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Smart Management",
      description: "Track responses and manage guests effortlessly"
    }
  ];

  const templates = [
    { name: "Classic", emoji: "💝", popular: true },
    { name: "Modern", emoji: "✨", popular: false },
    { name: "Elegant", emoji: "🌸", popular: false },
    { name: "Minimal", emoji: "🤍", popular: true }
  ];

  const testimonials = [
    {
      name: "Sarah & John",
      text: "Perfect for our wedding! Saved us so much time and money.",
      rating: 5
    },
    {
      name: "Emily & David", 
      text: "Our guests loved the digital invitations. So easy to use!",
      rating: 5
    },
    {
      name: "Maria & Alex",
      text: "Beautiful templates and seamless RSVP process.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">InviteNow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link to="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="button-modern">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Over 10,000 couples trust InviteNow
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Wedding Invitations
              <span className="text-gradient block">Made Simple</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Create, customize, and share stunning wedding invitations in minutes. 
              No design experience needed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" asChild className="primary-gradient px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/create">
                  Create Your Invitation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="px-8 py-4 text-lg rounded-xl">
                <Link to="#demo">
                  View Demo
                </Link>
              </Button>
            </div>

            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-theme-success" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-theme-success" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-theme-success" />
                Ready in 3 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-theme-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need for perfect invitations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From creation to celebration, we handle all the technical details so you can focus on your special day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Beautiful templates for every style
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose from our curated collection of professional designs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {templates.map((template, index) => (
              <div key={index} className="relative group">
                <div className="card-modern p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl mb-4">{template.emoji}</div>
                  <h3 className="font-heading font-semibold text-foreground">{template.name}</h3>
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-theme-accent text-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild className="button-modern">
              <Link to="/templates">
                View All Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-theme-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Loved by couples worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-modern p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-theme-accent text-theme-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-medium text-foreground">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to create your perfect invitation?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of couples who've made their wedding planning easier with InviteNow.
          </p>
          <Button size="lg" asChild className="primary-gradient px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/create">
              Start Creating Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-theme-gray-light/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">InviteNow</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Making your special day even more special, one invitation at a time.
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
