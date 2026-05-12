import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, User, Tag, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contentService } from "@/services/contentService";
import type { EventItem } from "@/types/content";

const getCategoryStyle = (category: string) => {
  const styles: Record<string, { dot: string; bg: string; text: string }> = {
    Festival: { dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400" },
    Environment: { dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400" },
    Sports: { dot: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400" },
    Livelihood: { dot: "bg-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-400" },
    Governance: { dot: "bg-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-400" },
  };

  return styles[category] || { dot: "bg-primary", bg: "bg-muted", text: "text-muted-foreground" };
};

const EventDetailPage = () => {
  const { id } = useParams();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    contentService.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const event = useMemo(() => events.find((item) => item.id === id), [events, id]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container flex-1 py-16 text-center">
          <p className="text-lg text-muted-foreground">Event not found.</p>
          <Link to="/calendar" className="mt-4 inline-block text-primary underline">Back to Calendar</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const style = getCategoryStyle(event.category);
  const eventDate = new Date(event.date);
  const relatedEvents = events.filter((item) => item.category === event.category && item.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="gradient-hero">
        <div className="container py-8 md:py-12">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-primary-foreground/60">
            <Link to="/" className="transition-colors hover:text-primary-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/calendar" className="transition-colors hover:text-primary-foreground">Calendar</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="max-w-[200px] truncate text-primary-foreground/90">{event.title}</span>
          </nav>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style.bg} ${style.text}`}>
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {event.category}
          </span>

          <h1 className="mt-4 max-w-3xl font-heading text-2xl font-bold leading-tight text-primary-foreground md:text-4xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {eventDate.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {event.time}
            </span>
          </div>
        </div>
      </div>

      <main className="container flex-1 py-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <Link to="/calendar" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
              <ArrowLeft className="h-4 w-4" /> Back to Calendar
            </Link>

            <section className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-card-foreground">
                <Tag className="h-4 w-4 text-primary" />
                About This Event
              </h2>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                <p>{event.description}</p>
              </div>
            </section>

            {relatedEvents.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Related Events</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedEvents.map((relatedEvent) => {
                    const relatedStyle = getCategoryStyle(relatedEvent.category);
                    const relatedDate = new Date(relatedEvent.date);
                    return (
                      <Link
                        key={relatedEvent.id}
                        to={`/events/${relatedEvent.id}`}
                        className="group rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                      >
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${relatedStyle.bg} ${relatedStyle.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${relatedStyle.dot}`} />
                          {relatedEvent.category}
                        </span>
                        <p className="mt-2 line-clamp-2 text-sm font-bold text-card-foreground transition-colors group-hover:text-primary">
                          {relatedEvent.title}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {relatedDate.toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="w-full shrink-0 space-y-5 lg:w-80">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="gradient-hero px-5 py-3">
                <h3 className="font-heading text-sm font-bold text-primary-foreground">Event Details</h3>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/[0.06]">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Date</p>
                    <p className="text-sm font-semibold text-card-foreground">
                      {eventDate.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/[0.06]">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Time</p>
                    <p className="text-sm font-semibold text-card-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/[0.06]">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Location</p>
                    <p className="text-sm font-semibold text-card-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/[0.06]">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Organizer</p>
                    <p className="text-sm font-semibold text-card-foreground">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center shadow-card">
              <div className="mb-3 rounded-xl border border-border bg-primary/[0.06] px-6 py-4">
                <p className="text-xs font-bold uppercase text-primary">{eventDate.toLocaleDateString("en-PH", { month: "short" })}</p>
                <p className="text-4xl font-black leading-tight text-foreground">{eventDate.getDate()}</p>
                <p className="text-xs font-semibold text-muted-foreground">{eventDate.toLocaleDateString("en-PH", { weekday: "long" })}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {eventDate > new Date()
                  ? `${Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days from now`
                  : "This event has passed"}
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetailPage;
