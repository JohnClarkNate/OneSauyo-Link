import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Sparkles, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contentService } from "@/services/contentService";
import type { EventItem } from "@/types/content";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getCategoryStyle = (category: string) => {
  const styles: Record<string, { dot: string; bg: string; text: string; border: string }> = {
    Festival: { dot: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
    Environment: { dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
    Sports: { dot: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
    Livelihood: { dot: "bg-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" },
    Governance: { dot: "bg-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
  };

  return styles[category] || { dot: "bg-primary", bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
};

const CalendarPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    contentService.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((event) => {
      const date = new Date(event.date);
      if (date.getMonth() === month && date.getFullYear() === year) {
        const key = date.getDate().toString();
        if (!map[key]) map[key] = [];
        map[key].push(event);
      }
    });
    return map;
  }, [events, month, year]);

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => new Date(event.date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5),
    [events, today]
  );

  const monthEvents = useMemo(
    () =>
      events.filter((event) => {
        const date = new Date(event.date);
        return date.getMonth() === month && date.getFullYear() === year;
      }),
    [events, month, year]
  );

  const categories = useMemo(() => [...new Set(events.map((event) => event.category))], [events]);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
      return;
    }
    setMonth(month - 1);
  };

  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
      return;
    }
    setMonth(month + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-1 py-8 md:py-12">
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Community Events</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">View upcoming events, activities, and important dates in Barangay Sauyo.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card p-2 shadow-card md:p-3">
              <button onClick={prev} className="rounded-lg p-1.5 transition-colors hover:bg-muted md:p-2">
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <div className="flex items-center gap-2 md:gap-3">
                <select
                  value={month}
                  onChange={(event) => setMonth(Number(event.target.value))}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring md:px-3 md:text-sm"
                >
                  {MONTHS.map((monthName, index) => <option key={monthName} value={index}>{monthName}</option>)}
                </select>
                <span className="font-heading text-base font-bold text-foreground md:text-lg">{year}</span>
                <button
                  onClick={() => {
                    setMonth(today.getMonth());
                    setYear(today.getFullYear());
                  }}
                  className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/20 md:px-3 md:py-1.5 md:text-xs"
                >
                  Today
                </button>
              </div>
              <button onClick={next} className="rounded-lg p-1.5 transition-colors hover:bg-muted md:p-2">
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="grid grid-cols-7">
                {DAYS.map((day) => (
                  <div key={day} className="gradient-hero py-1.5 text-center text-[10px] font-bold uppercase tracking-wide text-primary-foreground md:py-2.5 md:text-xs">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day[0]}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="min-h-[48px] border-r border-t border-border bg-muted/30 md:min-h-[90px]" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayEvents = eventsByDate[day.toString()] || [];
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`min-h-[48px] border-r border-t border-border p-0.5 transition-colors md:min-h-[90px] md:p-1.5 ${
                        isToday ? "bg-primary/[0.06]" : "bg-card hover:bg-muted/30"
                      }`}
                    >
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold md:h-7 md:w-7 md:text-xs ${isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"}`}>
                        {day}
                      </span>
                      <div className="mt-0.5 hidden space-y-0.5 md:block">
                        {dayEvents.map((event) => {
                          const categoryStyle = getCategoryStyle(event.category);
                          return (
                            <Link
                              key={event.id}
                              to={`/events/${event.id}`}
                              className={`block w-full truncate rounded-md border px-1.5 py-0.5 text-left text-[10px] font-semibold transition-all hover:scale-[1.02] ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                            >
                              <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${categoryStyle.dot}`} />
                              {event.title}
                            </Link>
                          );
                        })}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="mt-0.5 flex justify-center gap-0.5 md:hidden">
                          {dayEvents.slice(0, 3).map((event) => {
                            const categoryStyle = getCategoryStyle(event.category);
                            return <span key={event.id} className={`h-1.5 w-1.5 rounded-full ${categoryStyle.dot}`} />;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legend:</span>
              {categories.map((category) => {
                const categoryStyle = getCategoryStyle(category);
                return (
                  <span key={category} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className={`h-2.5 w-2.5 rounded-full ${categoryStyle.dot}`} />
                    {category}
                  </span>
                );
              })}
            </div>
          </div>

          <aside className="w-full shrink-0 space-y-5 lg:w-80">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="gradient-hero flex items-center gap-2 px-5 py-4">
                <Sparkles className="h-4 w-4 text-secondary" />
                <h2 className="font-heading text-sm font-bold text-primary-foreground">Upcoming Events</h2>
              </div>
              <div className="divide-y divide-border">
                {upcomingEvents.length === 0 && (
                  <p className="px-5 py-6 text-center text-sm text-muted-foreground">No upcoming events.</p>
                )}
                {upcomingEvents.map((event) => {
                  const categoryStyle = getCategoryStyle(event.category);
                  const eventDate = new Date(event.date);
                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="group block w-full px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-primary/[0.06]">
                          <span className="text-[10px] font-bold uppercase leading-none text-primary">
                            {eventDate.toLocaleDateString("en-PH", { month: "short" })}
                          </span>
                          <span className="text-lg font-black leading-tight text-foreground">{eventDate.getDate()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-card-foreground transition-colors group-hover:text-primary">{event.title}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {event.time}
                          </p>
                          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${categoryStyle.dot}`} />
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-sm font-bold text-card-foreground">This Month</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-primary/[0.06] px-4 py-3">
                  <span className="text-2xl font-black text-primary">{monthEvents.length}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Events</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {Object.entries(
                    monthEvents.reduce((accumulator, event) => {
                      accumulator[event.category] = (accumulator[event.category] || 0) + 1;
                      return accumulator;
                    }, {} as Record<string, number>)
                  ).map(([category, count]) => {
                    const categoryStyle = getCategoryStyle(category);
                    return (
                      <div key={category} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className={`h-2 w-2 rounded-full ${categoryStyle.dot}`} />
                          {category}
                        </span>
                        <span className="font-bold text-card-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;
