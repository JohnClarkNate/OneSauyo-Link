import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Home, LayoutDashboard, Megaphone, CalendarDays, Users, Phone, BarChart3, ScrollText, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const barangayLogo = "/favicon.png";

const mainLinks = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
];

const contentLinks = [
  { label: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { label: "Calendar", path: "/admin/calendar", icon: CalendarDays },
  { label: "Officials", path: "/admin/officials", icon: Users },
  { label: "Hotlines", path: "/admin/hotlines", icon: Phone },
];

const systemLinks = [
  { label: "Audit Log", path: "/admin/audit-log", icon: ScrollText },
  { label: "System", path: "/admin/system", icon: Settings },
];

const AdminNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/"); };

  const isActive = (path: string) => location.pathname === path;
  const isContentActive = contentLinks.some((l) => isActive(l.path));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setContentOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const linkClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`;

  const mobileLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <img src={barangayLogo} alt="Logo" className="h-9 w-9 object-contain" />
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight text-primary">e-Barangay</p>
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Admin</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map((l) => (
            <Link key={l.path} to={l.path} className={linkClass(isActive(l.path))}>
              <l.icon className="h-4 w-4" />{l.label}
            </Link>
          ))}

          {/* Content dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setContentOpen(!contentOpen)}
              className={`${linkClass(isContentActive)} cursor-pointer`}
            >
              <Megaphone className="h-4 w-4" />
              Content
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${contentOpen ? "rotate-180" : ""}`} />
            </button>
            {contentOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 rounded-lg border border-border bg-card shadow-lg py-1.5 animate-fade-in">
                {contentLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    onClick={() => setContentOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isActive(l.path) ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}`}
                  >
                    <l.icon className="h-4 w-4" />{l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {systemLinks.map((l) => (
            <Link key={l.path} to={l.path} className={linkClass(isActive(l.path))}>
              <l.icon className="h-4 w-4" />{l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <Link to="/" className="p-2 rounded-md hover:bg-muted transition-colors hidden md:flex" title="Public Site">
            <Home className="h-4.5 w-4.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm font-medium hover:bg-destructive/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />Logout
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-card px-4 pb-4 pt-3 animate-fade-in space-y-1">
          {mainLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className={mobileLinkClass(isActive(l.path))}>
              <l.icon className="h-4 w-4" />{l.label}
            </Link>
          ))}

          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">Content</p>
          {contentLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className={mobileLinkClass(isActive(l.path))}>
              <l.icon className="h-4 w-4" />{l.label}
            </Link>
          ))}

          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">System</p>
          {systemLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className={mobileLinkClass(isActive(l.path))}>
              <l.icon className="h-4 w-4" />{l.label}
            </Link>
          ))}

          <div className="border-t border-border pt-3 mt-2 flex gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
              <Home className="h-4 w-4" /> Public Site
            </Link>
            <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 rounded-md bg-destructive/10 text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive/20">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default AdminNavbar;
