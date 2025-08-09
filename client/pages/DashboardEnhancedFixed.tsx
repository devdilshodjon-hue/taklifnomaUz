import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInvitations } from "@/lib/invitationSaverFixed";
import { testSupabaseConnection } from "@/lib/supabaseAuthFixed";
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
  ExternalLink,
  Copy,
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
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
  city?: string;
  address?: string;
  url?: string;
  is_local?: boolean;
}

interface InvitationStats {
  views: number;
  rsvps: number;
  guests: number;
}

export default function DashboardEnhancedFixed() {
  const { user, profile, signOut } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<Record<string, InvitationStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "testing" | "online" | "offline"
  >("testing");

  useEffect(() => {
    checkConnection();
    loadInvitations();
  }, []);

  // Test Supabase connection
  const checkConnection = async () => {
    setConnectionStatus("testing");
    const isConnected = await testSupabaseConnection();
    setConnectionStatus(isConnected ? "online" : "offline");
  };

  // Load invitations using the new system
  const loadInvitations = async () => {
    console.log("🔄 Loading invitations...");
    setLoading(true);
    setError(null);

    try {
      const result = await getUserInvitations();

      if (result.success) {
        console.log(`✅ Loaded ${result.invitations.length} invitations`);
        setInvitations(
          result.invitations.map((inv) => ({
            ...inv,
            url: `${window.location.origin}/invitation/${inv.slug}`,
          })),
        );

        // Generate mock stats
        const mockStats: Record<string, InvitationStats> = {};
        result.invitations.forEach((inv: any) => {
          mockStats[inv.id] = {
            views: Math.floor(Math.random() * 100),
            rsvps: Math.floor(Math.random() * 20),
            guests: Math.floor(Math.random() * 50),
          };
        });
        setStats(mockStats);

        // Clear any previous errors
        setError(null);
      } else {
        console.warn("⚠️ Failed to load invitations:", result.error);
        setError(result.error || "Ma'lumotlarni yuklashda xatolik");
        setInvitations([]);
      }
    } catch (err: any) {
      console.error("❌ Critical error loading invitations:", err);
      setError("Ma'lumotlarni yuklashda kutilmagan xatolik");
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  // Copy invitation URL to clipboard
  const copyInvitationURL = async (invitation: Invitation) => {
    try {
      const url =
        invitation.url ||
        `${window.location.origin}/invitation/${invitation.slug}`;
      await navigator.clipboard.writeText(url);
      toast.success("Havola nusxalandi!", {
        description: "Taklifnoma havolasi clipboard ga nusxalandi",
      });
    } catch (err) {
      toast.error("Havolani nusxalashda xatolik");
    }
  };

  // Open invitation in new tab
  const openInvitation = (invitation: Invitation) => {
    const url =
      invitation.url ||
      `${window.location.origin}/invitation/${invitation.slug}`;
    window.open(url, "_blank");
  };

  // Calculate total stats
  const totalStats = {
    invitations: invitations.length,
    views: Object.values(stats).reduce((sum, stat) => sum + stat.views, 0),
    rsvps: Object.values(stats).reduce((sum, stat) => sum + stat.rsvps, 0),
    guests: Object.values(stats).reduce((sum, stat) => sum + stat.guests, 0),
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Connection status component
  const ConnectionStatus = () => {
    const getStatusInfo = () => {
      switch (connectionStatus) {
        case "testing":
          return {
            icon: Database,
            color: "text-yellow-500",
            text: "Tekshirilmoqda...",
          };
        case "online":
          return { icon: Wifi, color: "text-green-500", text: "Onlayn" };
        case "offline":
          return {
            icon: WifiOff,
            color: "text-orange-500",
            text: "Offline rejim",
          };
      }
    };

    const { icon: Icon, color, text } = getStatusInfo();

    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className={color}>{text}</span>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 p-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                  Dashboard
                </h1>
                <ConnectionStatus />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  checkConnection();
                  loadInvitations();
                }}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Yangilash
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt="Profile"
                      />
                      <AvatarFallback>
                        {profile?.first_name?.[0] ||
                          user?.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Sozlamalar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taklifnomalar
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalStats.invitations}
                </div>
                <p className="text-xs text-muted-foreground">Jami yaratilgan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ko'rishlar
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.views}</div>
                <p className="text-xs text-muted-foreground">
                  Umumiy ko'rishlar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">RSVP</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.rsvps}</div>
                <p className="text-xs text-muted-foreground">Javob berganlar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mehmonlar</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.guests}</div>
                <p className="text-xs text-muted-foreground">Jami mehmonlar</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Invitations List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Taklifnomalar
                </h2>
                <Button asChild>
                  <Link to="/create">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Yangi Taklifnoma
                  </Link>
                </Button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">
                    Yuklanmoqda...
                  </span>
                </div>
              )}

              {error && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <WifiOff className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                          Ma'lumotlarni yuklashda muammo
                        </h3>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {error}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadInvitations}
                          className="mt-3 text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Qayta urinish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!loading && !error && invitations.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Hali taklifnoma yo'q
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Birinchi taklifnomangizni yarating
                    </p>
                    <Button asChild>
                      <Link to="/create">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Taklifnoma Yaratish
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!loading && invitations.length > 0 && (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <Card key={invitation.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {invitation.groom_name} ♥{" "}
                                {invitation.bride_name}
                              </h3>
                              {invitation.is_local ? (
                                <Badge
                                  variant="outline"
                                  className="text-orange-600 border-orange-300"
                                >
                                  Mahalliy
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-300"
                                >
                                  Saqlangan
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(invitation.wedding_date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {invitation.venue}
                              </span>
                              {stats[invitation.id] && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {stats[invitation.id].views} ko'rish
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyInvitationURL(invitation)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInvitation(invitation)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
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
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  O'chirish
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tezkor Harakatlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link to="/create">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Yangi Taklifnoma
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/templates">
                      <Calendar className="w-4 h-4 mr-2" />
                      Shablonlar
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/template-builder">
                      <Settings className="w-4 h-4 mr-2" />
                      Shablon Yaratish
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yaqinda Yaratilgan</CardTitle>
                </CardHeader>
                <CardContent>
                  {invitations.slice(0, 3).map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center gap-3 py-2 border-b last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {invitation.groom_name} ♥ {invitation.bride_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(invitation.wedding_date)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {invitations.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                      Hali taklifnoma yo'q
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
