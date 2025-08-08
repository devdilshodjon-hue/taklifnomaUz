import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  Share2,
  MoreVertical,
  LogOut,
  User,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  venue: string;
  template_id: string;
  is_active: boolean;
  created_at: string;
  slug: string;
}

interface InvitationStats {
  views: number;
  rsvps: number;
  guests: number;
}

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<Record<string, InvitationStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setInvitations(data || []);

      // Load stats for each invitation
      const statsData: Record<string, InvitationStats> = {};
      for (const invitation of data || []) {
        // Get RSVP count
        const { count: rsvpCount } = await supabase
          .from("rsvps")
          .select("*", { count: "exact", head: true })
          .eq("invitation_id", invitation.id);

        // Get guests count
        const { count: guestCount } = await supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("invitation_id", invitation.id);

        statsData[invitation.id] = {
          views: Math.floor(Math.random() * 100), // For demo - would need view tracking
          rsvps: rsvpCount || 0,
          guests: guestCount || 0,
        };
      }
      setStats(statsData);
    } catch (error) {
      console.error("Error loading invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 animate-scale-in">
        Faol
      </Badge>
    ) : (
      <Badge variant="secondary" className="animate-scale-in">
        Noaktiv
      </Badge>
    );
  };

  const totalStats = invitations.reduce(
    (acc, inv) => {
      const invStats = stats[inv.id] || { views: 0, rsvps: 0, guests: 0 };
      return {
        views: acc.views + invStats.views,
        rsvps: acc.rsvps + invStats.rsvps,
        guests: acc.guests + invStats.guests,
      };
    },
    { views: 0, rsvps: 0, guests: 0 },
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-purple-50/30 animate-fade-in">
        {/* Navigation Bar */}
        <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 animate-fade-in">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-foreground">
                  TaklifNoma
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <Button asChild className="button-modern hover-lift">
                  <Link to="/create">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Yangi Taklifnoma
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover-scale"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={profile?.avatar_url || ""}
                          alt={profile?.first_name || ""}
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {profile?.first_name?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Sozlamalar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Chiqish</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              Salom, {profile?.first_name || "Foydalanuvchi"}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Taklifnomalaringizni boshqaring va mehmonlar statistikasini
              kuzatib boring
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 animate-fade-in">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-muted-foreground">
                  Taklifnomalar yuklanmoqda...
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="card-modern p-6 hover-lift animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Jami Taklifnomalar
                      </p>
                      <p className="text-3xl font-bold text-foreground animate-scale-in">
                        {invitations.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="card-modern p-6 hover-lift animate-slide-up delay-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Jami Ko'rishlar
                      </p>
                      <p className="text-3xl font-bold text-foreground animate-scale-in">
                        {totalStats.views}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="card-modern p-6 hover-lift animate-slide-up delay-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Jami RSVP</p>
                      <p className="text-3xl font-bold text-foreground animate-scale-in">
                        {totalStats.rsvps}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invitations List */}
              {invitations.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6 animate-fade-in">
                    Sizning Taklifnomalaringiz
                  </h2>
                  {invitations.map((invitation, index) => {
                    const invStats = stats[invitation.id] || {
                      views: 0,
                      rsvps: 0,
                      guests: 0,
                    };
                    return (
                      <div
                        key={invitation.id}
                        className="card-modern p-6 hover-lift transition-smooth animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="font-heading text-xl font-semibold text-foreground">
                                {invitation.groom_name} &{" "}
                                {invitation.bride_name}
                              </h3>
                              {getStatusBadge(invitation.is_active)}
                            </div>
                            <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p className="font-medium text-foreground">
                                  Sana:
                                </p>
                                <p>
                                  {new Date(
                                    invitation.wedding_date,
                                  ).toLocaleDateString("uz-UZ")}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  Joy:
                                </p>
                                <p>{invitation.venue}</p>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  Shablon:
                                </p>
                                <p className="capitalize">
                                  {invitation.template_id}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  Statistika:
                                </p>
                                <p>
                                  {invStats.views} ko'rish, {invStats.rsvps}{" "}
                                  RSVP
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="hover-scale"
                            >
                              <Link to={`/invitation/${invitation.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                Ko'rish
                              </Link>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover-scale"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Tahrirlash
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Ulashish
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  O'chirish
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
                    <Calendar className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                    Hali taklifnomalar yo'q
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Birinchi taklifnomangizni yaratib, mehmonlarni taklif
                    qilishni boshlang. Bu juda oson va faqat bir necha daqiqa
                    vaqt oladi!
                  </p>
                  <Button
                    asChild
                    className="button-modern hover-lift primary-gradient"
                  >
                    <Link to="/create">
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Birinchi Taklifnomani Yaratish
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
