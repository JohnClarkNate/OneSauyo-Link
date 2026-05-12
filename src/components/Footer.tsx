import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentService } from "@/services/contentService";
import type { HotlineItem } from "@/types/content";

const barangayLogo = "/favicon.png";

const Footer = () => {
  const [hotlines, setHotlines] = useState<HotlineItem[]>([]);

  useEffect(() => {
    contentService.getHotlines().then(setHotlines).catch(() => setHotlines([]));
  }, []);

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src={barangayLogo} alt="Logo" className="h-12 w-12 object-contain" />
              <div>
                <p className="font-heading text-lg font-bold">Barangay Sauyo</p>
                <p className="text-sm text-primary-foreground/70">Lungsod ng Quezon</p>
              </div>
            </div>
            <p className="mt-2 max-w-xs text-sm text-primary-foreground/70">
              Serving the community with transparency, integrity, and dedication since 1975.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-bold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="transition-colors hover:text-secondary">Home</Link></li>
              <li><Link to="/calendar" className="transition-colors hover:text-secondary">Calendar</Link></li>
              <li><Link to="/announcements" className="transition-colors hover:text-secondary">Announcements</Link></li>
              <li><Link to="/officials" className="transition-colors hover:text-secondary">Officials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-bold">Emergency Hotlines</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/80">
              {hotlines.slice(0, 4).map((hotline) => (
                <li key={hotline.id}>
                  <span className="font-medium">{hotline.name}:</span> {hotline.number}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/50">
          © 2026 Barangay Sauyo, Lungsod ng Quezon. All rights reserved. | e-Barangay Digital Management System
        </div>
      </div>
    </footer>
  );
};

export default Footer;
