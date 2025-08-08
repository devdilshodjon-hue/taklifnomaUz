import { Link } from "react-router-dom";
import { Sparkles, Plus, Calendar, Eye, Users, LogOut, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // localStorage dan taklifnomalarni olish
  const getStoredInvitations = () => {
    const invitations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('invitation_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          invitations.push({
            id: data.id,
            groomName: data.groom_name,
            brideName: data.bride_name,
            date: data.wedding_date,
            guests: 50, // Default
            rsvps: 12, // Default
            status: "active"
          });
        } catch (error) {
          console.error('Error parsing invitation data:', error);
        }
      }
    }
    return invitations;
  };

  const invitations = getStoredInvitations();

  const stats = [
    {
      label: "Jami Taklifnomalar",
      value: invitations.length,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      label: "Jami Mehmonlar",
      value: invitations.reduce((sum, inv) => sum + inv.guests, 0),
      icon: <Users className="w-5 h-5" />
    },
    {
      label: "Javob Berganlar",
      value: invitations.reduce((sum, inv) => sum + inv.rsvps, 0),
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">TaklifNoma</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </Link>
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Taklifnomalaringiz</h1>
            <p className="text-muted-foreground">To'y taklifnomalaringizni boshqaring va kuzating</p>
          </div>
          <Button className="button-modern" asChild>
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              Yangi Taklifnoma Yaratish
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-modern p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Invitations List */}
        {invitations.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Sizning taklifnomalaringiz</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="card-modern p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {invitation.groomName} & {invitation.brideName}
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/invitation/${invitation.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-3 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(invitation.date).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{invitation.rsvps}/{invitation.guests} javob berdi</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Javob foizi</span>
                      <span>{Math.round((invitation.rsvps / invitation.guests) * 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(invitation.rsvps / invitation.guests) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/invitation/${invitation.id}/edit`}>Tahrirlash</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/invitation/${invitation.id}`}>Ko'rish</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Hali taklifnomalar yo'q</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Birinchi chiroyli to'y taklifnomangizni yaratish uchun quyidagi tugmani bosing
            </p>
            <Button className="button-modern" asChild>
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                Birinchi Taklifnomangizni Yarating
              </Link>
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-theme-gray-light/30 rounded-2xl p-8">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Tezkor harakatlar</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-auto p-4 text-left">
              <Link to="/templates">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Shablonlarni Ko'rish</h4>
                  <p className="text-sm text-muted-foreground">Turli dizayn variantlarini o'rganing</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 text-left">
              <Link to="/help">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Yordam</h4>
                  <p className="text-sm text-muted-foreground">Ko'p beriladigan savollarga javob toping</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 text-left">
              <Link to="/settings">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Sozlamalar</h4>
                  <p className="text-sm text-muted-foreground">Hisobingizni boshqaring</p>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
