import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, LogIn, Bell, ChevronDown, LayoutDashboard, FileText, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const barangayLogo = "/favicon.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Calendar", path: "/calendar" },
  { label: "Announcements", path: "/announcements" },
  { label: "Officials", path: "/officials" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadCount = 0;

  useEffect(() => {
    const handleScroll = () => {
      const officialsSection = document.getElementById('officials');
      const aboutSection = document.getElementById('about');
      if (officialsSection && aboutSection) {
        const officialsTop = officialsSection.offsetTop;
        const aboutTop = aboutSection.offsetTop;
        const scrollY = window.scrollY + 100; // offset for header
        if (scrollY < aboutTop) {
          setActiveSection('officials');
        } else {
          setActiveSection('about');
        }
      }
    };

    if (location.pathname === '/officials' || location.pathname === '/about') {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // initial check
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setActiveSection('');
    }
  }, [location.pathname]);

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "staff") return "/staff/dashboard";
    return "/resident/dashboard";
  };

  const handleLogout = () => {
    setAvatarOpen(false);
    logout();
    navigate("/");
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "";

  const dropdownItems = user
    ? [
        { label: "Dashboard", icon: LayoutDashboard, path: getDashboardPath() },
        ...(user.role === "resident"
          ? [{ label: "My Requests", icon: FileText, path: "/resident/track-request" }]
          : []),
        { label: "Profile", icon: User, path: "/profile" },
        { label: "Settings", icon: Settings, path: "/settings" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={barangayLogo} alt="Barangay Sauyo Logo" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight text-primary">Barangay Sauyo</p>
            <p className="text-xs text-muted-foreground">Lungsod ng Quezon</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const isActive = (location.pathname === '/officials' || location.pathname === '/about') && activeSection
              ? activeSection === l.label.toLowerCase()
              : location.pathname === l.path;
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href="tel:911" className="hidden lg:flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
            <Phone className="h-4 w-4" />
            Hotline
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "resident" && (
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-md hover:bg-muted transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-lg border border-border bg-card shadow-lg z-50">
                      <div className="p-3 border-b border-border">
                        <h4 className="font-heading text-sm font-semibold">Notifications</h4>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-3 py-4 text-sm text-muted-foreground">
                          No notifications yet.
                        </div>
                      </div>
                      <Link
                        to="/resident/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block text-center text-sm text-primary py-2 hover:bg-muted transition-colors"
                      >
                        View All
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <div className="relative">
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-1.5 rounded-full p-0.5 hover:ring-2 hover:ring-primary/30 transition-all"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {avatarOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-lg border border-border bg-card shadow-lg">
                      <div className="flex items-center gap-3 border-b border-border p-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-card-foreground truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="p-1">
                        {dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setAvatarOpen(false)}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-card-foreground hover:bg-muted transition-colors"
                          >
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-border p-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <LogIn className="h-4 w-4" />
              Resident Portal
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {user && user.role === "resident" && (
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-md p-2 hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}
          <button onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-muted" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile notification panel */}
      {notifOpen && user?.role === "resident" && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-2">
          <div className="p-3 border-b border-border mb-2">
            <h4 className="font-heading text-sm font-semibold">Notifications</h4>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            <div className="px-3 py-4 rounded border border-border text-sm text-muted-foreground">
              No notifications yet.
            </div>
          </div>
          <Link
            to="/resident/notifications"
            onClick={() => setNotifOpen(false)}
            className="block text-center text-sm text-primary py-2 hover:bg-muted transition-colors rounded mt-2"
          >
            View All
          </Link>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-border bg-card px-4 pb-4 pt-2 animate-fade-in">
          {navLinks.map((l) => {
            const isActive = (location.pathname === '/officials' || location.pathname === '/about') && activeSection
              ? activeSection === l.label.toLowerCase()
              : location.pathname === l.path;
            return (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a href="tel:911" className="mt-2 flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">
            <Phone className="h-4 w-4" /> Emergency Hotline
          </a>

          {user ? (
            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center gap-3 px-4 py-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              {dropdownItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="mt-1 flex w-full items-center gap-2.5 rounded-md px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <LogIn className="h-4 w-4" /> Resident Portal
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
