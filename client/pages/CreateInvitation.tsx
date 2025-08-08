import { Link } from "react-router-dom";
import { Heart, ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateInvitation() {
  return (
    <div className="min-h-screen bg-wedding-cream">
      {/* Navigation */}
      <nav className="bg-card border-b border-wedding-blush/20 p-4">
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
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-wedding-rose hover:bg-wedding-rose/90 text-white" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save & Generate Link
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Create Your Invitation</h1>
          <p className="text-foreground/70">Fill in the details to create your perfect wedding invitation</p>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-wedding-blush/20">
          <div className="text-center py-20 text-foreground/60">
            <Heart className="w-16 h-16 text-wedding-blush mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-foreground mb-4">Invitation Creation Form</h2>
            <p className="mb-8">Complete form with all fields coming soon...</p>
            <div className="space-y-2 text-sm text-left max-w-md mx-auto">
              <p>• Groom's & Bride's names</p>
              <p>• Wedding date & time</p>
              <p>• Location with Google Map</p>
              <p>• Custom message</p>
              <p>• Design template selection</p>
              <p>• Guest list management</p>
              <p>• Photo upload option</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
