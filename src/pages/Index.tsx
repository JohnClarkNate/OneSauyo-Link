import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Megaphone, Users, Phone, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlideshow from "@/components/HeroSlideshow";
import AnnouncementCard from "@/components/AnnouncementCard";
import EventCard from "@/components/EventCard";
import { contentService } from "@/services/contentService";
import type { AnnouncementItem, EventItem, HotlineItem } from "@/types/content";

const barangayLogo = "/favicon.png";

const quickLinks = [
  { label: "View Calendar", icon: CalendarDays, path: "/calendar" },
  { label: "Announcements", icon: Megaphone, path: "/announcements" },
  { label: "Officials", icon: Users, path: "/officials" },
  { label: "Hotline Info", icon: Phone, path: "#hotlines" },
];

const Index = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [hotlines, setHotlines] = useState<HotlineItem[]>([]);

  useEffect(() => {
    contentService.getAnnouncements().then(setAnnouncements).catch(() => setAnnouncements([]));
    contentService.getEvents().then(setEvents).catch(() => setEvents([]));
    contentService.getHotlines().then(setHotlines).catch(() => setHotlines([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSlideshow />

      <section className="gradient-hero text-primary-foreground">
        <div className="container flex flex-col items-center py-12 text-center md:py-16">
          <img src={barangayLogo} alt="Barangay Sauyo Logo" className="mb-4 h-24 w-24 object-contain drop-shadow-lg md:h-28 md:w-28" />
          <h1 className="font-heading text-2xl font-black leading-tight md:text-4xl">Barangay Sauyo</h1>
          <p className="mt-1 text-base text-primary-foreground/70">Lungsod ng Quezon</p>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80 md:text-base">
            Welcome to the official digital portal. Stay informed with the latest news, events, and community services.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickLinks.map((quickLink) => (
              <Link
                key={quickLink.label}
                to={quickLink.path}
                className="flex flex-col items-center gap-2 rounded-lg bg-primary-foreground/10 px-5 py-4 text-sm font-medium text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/20"
              >
                <quickLink.icon className="h-6 w-6" />
                {quickLink.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Stay Informed</p>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Latest Announcements</h2>
          </div>
          <Link to="/announcements" className="group hidden items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 sm:flex">
            View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.slice(0, 3).map((announcement) => (
            <AnnouncementCard key={announcement.id} {...announcement} />
          ))}
        </div>
        <Link to="/announcements" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary sm:hidden">
          View All Announcements <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="bg-muted">
        <div className="container py-12 md:py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Upcoming Events</h2>
            <Link to="/calendar" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View Calendar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      <section id="hotlines" className="container py-12 md:py-16">
        <h2 className="mb-6 text-center font-heading text-2xl font-bold">Emergency Hotlines</h2>
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hotlines.map((hotline) => (
            <a
              key={hotline.id}
              href={`tel:${hotline.number.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{hotline.name}</p>
                <p className="text-sm text-muted-foreground">{hotline.number}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
