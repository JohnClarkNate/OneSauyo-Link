import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  Search,
  Bell,
  CalendarDays,
  Megaphone,
  Shield,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Plus,
} from "lucide-react";
import ResidentNavbar from "@/components/ResidentNavbar";
import Footer from "@/components/Footer";
import type { Notification, ServiceRequest } from "@/data/residentMockData";

const barangayLogo = "/favicon.png";

const requests: ServiceRequest[] = [];
const notifications: Notification[] = [];

const statusIcon: Record<string, React.ReactNode> = {
  Pending: <Clock className="h-4 w-4 text-secondary" />,
  Processing: <Loader2 className="h-4 w-4 text-primary" />,
  Received: <CheckCircle2 className="h-4 w-4 text-accent" />,
  Resolved: <CheckCircle2 className="h-4 w-4 text-primary" />,
};

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Pending: "secondary",
  Processing: "default",
  Received: "outline",
  Resolved: "outline",
};

const ResidentDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const stats = [
    { label: "Total Requests", value: requests.length, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Pending", value: requests.filter((request) => request.status === "Pending").length, icon: Clock, color: "bg-secondary/20 text-secondary-foreground" },
    { label: "Processing", value: requests.filter((request) => request.status === "Processing").length, icon: Loader2, color: "bg-primary/10 text-primary" },
    { label: "Resolved", value: requests.filter((request) => request.status === "Resolved").length, icon: CheckCircle2, color: "bg-accent/10 text-accent" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ResidentNavbar />

      <section className="gradient-hero text-primary-foreground">
        <div className="container py-8 md:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary-foreground/20">
              <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground text-lg font-bold">
                {initials || "R"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold">
                Welcome back, {user.firstName || user.name}!
              </h1>
              <p className="text-primary-foreground/70 text-sm mt-0.5">
                Manage your requests and stay updated with community services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground leading-none">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden shadow-card">
              <div className="gradient-hero p-3 sm:p-4 text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Republic of the Philippines</p>
                    <p className="font-heading text-sm font-bold mt-0.5">Barangay Sauyo</p>
                    <p className="text-[10px] opacity-70">Quezon City</p>
                  </div>
                  <img src={barangayLogo} alt="Logo" className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-full bg-primary-foreground/10 p-0.5 shrink-0" />
                </div>
              </div>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-xs sm:text-sm font-bold truncate">
                      {user.lastName}, {user.firstName} {user.middleName}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.address || "No address saved yet."}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1 text-[10px] sm:text-xs border-t border-border pt-2">
                  <div className="truncate"><span className="text-muted-foreground">ID:</span> <span className="font-medium">{user.barangayId || "Not assigned"}</span></div>
                  <div className="truncate"><span className="text-muted-foreground">Gender:</span> <span className="font-medium">{user.gender || "Not set"}</span></div>
                  <div className="truncate"><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{user.birthDate || "Not set"}</span></div>
                  <div className="truncate"><span className="text-muted-foreground">Voter:</span> <span className="font-medium">{user.registeredVoter ? "Yes" : "No"}</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 px-3 sm:px-6">
                <Link to="/resident/submit-request" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-muted transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-card-foreground">New Request</span>
                </Link>
                <Link to="/resident/track-request" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-muted transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20">
                    <Search className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-card-foreground">Track Request</span>
                </Link>
                <Link to="/calendar" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-muted transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-card-foreground">Calendar</span>
                </Link>
                <Link to="/announcements" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-muted transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                    <Megaphone className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-xs font-medium text-card-foreground">Announcements</span>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm">Recent Requests</CardTitle>
                <Link to="/resident/track-request" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="text-sm font-medium text-card-foreground">No requests yet.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Your submitted requests will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((request) => (
                      <div key={request.id} className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border p-2.5 sm:p-3 hover:bg-muted/50 transition-colors">
                        <div className="mt-0.5 shrink-0">{statusIcon[request.status]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <p className="text-xs sm:text-sm font-medium text-card-foreground truncate">{request.referenceNumber}</p>
                            <Badge variant={statusVariant[request.status]} className="text-[10px] px-1.5 py-0 shrink-0">
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">{request.description}</p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-[10px] text-muted-foreground">
                            <span className="truncate">{request.category}</span>
                            <span>•</span>
                            <span className="shrink-0">{request.dateSubmitted}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ml-1">
                      {unreadCount} new
                    </Badge>
                  )}
                </CardTitle>
                <Link to="/resident/notifications" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="text-sm font-medium text-card-foreground">No notifications yet.</p>
                    <p className="mt-1 text-xs text-muted-foreground">System updates and request alerts will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 4).map((notification) => (
                      <div key={notification.id} className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${!notification.read ? "bg-primary/5 border border-primary/10" : "border border-border"}`}>
                        <div className="mt-0.5">
                          {!notification.read ? (
                            <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/30 mt-1" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-card-foreground">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{notification.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResidentDashboard;
