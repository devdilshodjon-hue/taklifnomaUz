import { Link } from "react-router-dom";
import { Heart, Plus, Calendar, Eye, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Mock data for invitations
  const invitations = [
    {
      id: 1,
      groomName: "John",
      brideName: "Sarah",
      date: "2024-06-15",
      guests: 120,
      rsvps: 85,
    },
    {
      id: 2,
      groomName: "Michael",
      brideName: "Emma",
      date: "2024-08-20",
      guests: 80,
      rsvps: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-wedding-cream">
      {/* Navigation */}
      <nav className="bg-card border-b border-wedding-blush/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-wedding-rose" />
            <span className="font-script text-2xl text-wedding-rose">ForeverTogether</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Link>
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl text-foreground mb-2">Your Invitations</h1>
            <p className="text-foreground/70">Manage and track your wedding invitations</p>
          </div>
          <Button className="bg-wedding-rose hover:bg-wedding-rose/90 text-white" asChild>
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              Create New Invitation
            </Link>
          </Button>
        </div>

        {invitations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="bg-card p-6 rounded-2xl shadow-sm border border-wedding-blush/20 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-script text-2xl text-wedding-rose">
                    {invitation.groomName} & {invitation.brideName}
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/invitation/${invitation.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(invitation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{invitation.rsvps} of {invitation.guests} responded</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/invitation/${invitation.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/invitation/${invitation.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-wedding-blush mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-foreground mb-4">No invitations yet</h2>
            <p className="text-foreground/70 mb-8">Create your first beautiful wedding invitation</p>
            <Button className="bg-wedding-rose hover:bg-wedding-rose/90 text-white" asChild>
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Invitation
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
