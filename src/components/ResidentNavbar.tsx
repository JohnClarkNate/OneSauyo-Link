import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const barangayLogo = "/favicon.png";

const navLinks = [
  { label: "Dashboard", path: "/resident/dashboard" },
  { label: "Submit Request", path: "/resident/submit-request" },
  { label: "Track Request", path: "/resident/track-request" },
];

const ResidentNavbar = () => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const unreadCount = 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/resident/dashboard" className="flex items-center gap-3">
          <img src={barangayLogo} alt="Barangay Sauyo Logo" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight text-primary">e-Barangay Portal</p>
            <p className="text-xs text-muted-foreground">Resident Services</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
                <div className="p-4 text-sm text-muted-foreground">
                  No notifications yet.
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

          <Link to="/" className="p-2 rounded-md hover:bg-muted transition-colors hidden lg:flex" title="Public Site">
            <Home className="h-5 w-5" />
          </Link>

          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-muted" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-card px-4 pb-4 pt-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/resident/notifications"
            onClick={() => setOpen(false)}
            className="block rounded-md px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Notifications
          </Link>
          <Link to="/" onClick={() => setOpen(false)} className="block rounded-md px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
            Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default ResidentNavbar;
