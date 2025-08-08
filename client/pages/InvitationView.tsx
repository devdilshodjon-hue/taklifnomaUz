import { useParams } from "react-router-dom";
import { Heart, MapPin, Calendar, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvitationView() {
  const { id } = useParams();
  
  // Mock invitation data
  const invitation = {
    id: id,
    groomName: "John",
    brideName: "Sarah",
    date: "June 15, 2024",
    time: "4:00 PM",
    location: "Rose Garden Chapel",
    address: "123 Garden Lane, City, State",
    message: "We request the honor of your presence as we celebrate our love and begin our journey together as husband and wife.",
    guestName: "Alex Johnson", // This would come from URL params or guest list
  };

  return (
    <div className="min-h-screen wedding-gradient">
      {/* Invitation Display */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-card p-12 rounded-3xl shadow-2xl border border-wedding-blush/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4">
            <Heart className="w-8 h-8 text-wedding-blush/30" />
          </div>
          <div className="absolute top-4 right-4">
            <Heart className="w-8 h-8 text-wedding-blush/30" />
          </div>
          <div className="absolute bottom-4 left-4">
            <Heart className="w-8 h-8 text-wedding-blush/30" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Heart className="w-8 h-8 text-wedding-blush/30" />
          </div>

          <div className="text-center space-y-8">
            {/* Header */}
            <div>
              <p className="text-foreground/60 text-lg mb-4">You are cordially invited to the wedding of</p>
              <h1 className="font-script text-5xl md:text-6xl wedding-text-gradient">
                {invitation.groomName} & {invitation.brideName}
              </h1>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-xl text-foreground/80">
                <Calendar className="w-6 h-6 text-wedding-rose" />
                <span className="font-serif">{invitation.date}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xl text-foreground/80">
                <Clock className="w-6 h-6 text-wedding-rose" />
                <span className="font-serif">{invitation.time}</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 text-xl text-foreground/80">
                <MapPin className="w-6 h-6 text-wedding-rose" />
                <span className="font-serif">{invitation.location}</span>
              </div>
              <p className="text-foreground/60">{invitation.address}</p>
            </div>

            {/* Message */}
            <div className="border-t border-b border-wedding-blush/30 py-8">
              <p className="text-lg text-foreground/80 leading-relaxed italic">
                "{invitation.message}"
              </p>
            </div>

            {/* Guest Name */}
            {invitation.guestName && (
              <div>
                <p className="text-foreground/60 mb-2">Dear</p>
                <p className="font-serif text-2xl text-wedding-rose">{invitation.guestName}</p>
              </div>
            )}
          </div>
        </div>

        {/* RSVP Section */}
        <div className="mt-8 bg-card p-8 rounded-2xl shadow-lg border border-wedding-blush/20">
          <h2 className="font-serif text-2xl text-center mb-6 text-foreground">Will you be joining us?</h2>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-wedding-rose hover:bg-wedding-rose/90 text-white px-8 py-3 rounded-full"
              onClick={() => alert("RSVP: Will attend! (Demo)")}
            >
              <Check className="w-5 h-5 mr-2" />
              I will attend
            </Button>
            <Button 
              variant="outline" 
              className="border-wedding-dusty text-wedding-dusty hover:bg-wedding-dusty hover:text-white px-8 py-3 rounded-full"
              onClick={() => alert("RSVP: Cannot attend (Demo)")}
            >
              <X className="w-5 h-5 mr-2" />
              I can't make it
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/60">
              Please respond by May 1st, 2024
            </p>
          </div>
        </div>

        {/* Thank you message */}
        <div className="mt-8 text-center">
          <p className="text-foreground/70 italic">
            Thank you for being a part of our special day!
          </p>
        </div>
      </div>
    </div>
  );
}
