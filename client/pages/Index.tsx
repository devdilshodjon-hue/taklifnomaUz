import { Link } from "react-router-dom";
import { Heart, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-wedding-rose" />
            <span className="font-script text-2xl text-wedding-rose">ForeverTogether</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Button variant="outline" asChild className="border-wedding-rose text-wedding-rose hover:bg-wedding-rose hover:text-white">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="wedding-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Floating decoration elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Sparkles className="w-8 h-8 text-wedding-gold/30" />
          </div>
          <div className="absolute top-40 right-20 animate-float delay-1000">
            <Heart className="w-6 h-6 text-wedding-rose/40" />
          </div>
          <div className="absolute bottom-32 left-20 animate-float delay-2000">
            <Sparkles className="w-6 h-6 text-wedding-blush/40" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float delay-500">
            <Heart className="w-10 h-10 text-wedding-dusty/30" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-6 py-20">
          <div className="animate-fade-in">
            <h1 className="font-script text-6xl md:text-8xl mb-6 wedding-text-gradient">
              Your Perfect Day
            </h1>
            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground/80">
              Begins with the Perfect Invitation
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Create and share your wedding invitations in minutes. 
              Beautiful, personalized, and unforgettable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-wedding-rose hover:bg-wedding-rose/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/create">
                  <Heart className="w-5 h-5 mr-2" />
                  Create Your Invitation
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-foreground/70 hover:text-foreground px-8 py-6 text-lg"
                asChild
              >
                <Link to="#features">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-wedding-ivory">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-foreground">
              Everything You Need for Your Special Day
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              From creation to celebration, we make your wedding invitation process seamless and beautiful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-wedding-blush rounded-full flex items-center justify-center group-hover:bg-wedding-rose transition-colors">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Easy Creation</h3>
              <p className="text-foreground/70 leading-relaxed">
                Design your perfect invitation with our intuitive tools. Add your details, choose a template, and customize everything to match your style.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-wedding-blush rounded-full flex items-center justify-center group-hover:bg-wedding-rose transition-colors">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Share Instantly</h3>
              <p className="text-foreground/70 leading-relaxed">
                Get a unique link to share with your guests. They can view your beautiful invitation and RSVP with just one click.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-wedding-blush rounded-full flex items-center justify-center group-hover:bg-wedding-rose transition-colors">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Track RSVPs</h3>
              <p className="text-foreground/70 leading-relaxed">
                See who's coming in real-time. Our dashboard helps you keep track of all your guests' responses in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 wedding-gradient">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="font-script text-5xl md:text-6xl mb-6 wedding-text-gradient">
            Start Your Journey Today
          </h2>
          <p className="text-xl mb-10 text-foreground/70 max-w-2xl mx-auto">
            Join thousands of couples who've created their perfect wedding invitations with us.
          </p>
          <Button 
            size="lg" 
            className="bg-wedding-rose hover:bg-wedding-rose/90 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link to="/create">
              <Heart className="w-6 h-6 mr-3" />
              Create Your Invitation Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wedding-cream py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-wedding-rose" />
            <span className="font-script text-2xl text-wedding-rose">ForeverTogether</span>
          </div>
          <p className="text-foreground/60 mb-4">
            Making your special day even more special, one invitation at a time.
          </p>
          <div className="flex justify-center gap-6 text-sm text-foreground/50">
            <Link to="/privacy" className="hover:text-foreground/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground/70 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-foreground/70 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
