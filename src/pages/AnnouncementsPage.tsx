import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, ArrowLeft, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementCard from "@/components/AnnouncementCard";
import { contentService } from "@/services/contentService";
import type { AnnouncementItem, HotlineItem } from "@/types/content";

const AnnouncementsPage = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [hotlines, setHotlines] = useState<HotlineItem[]>([]);

  useEffect(() => {
    contentService.getAnnouncements().then(setAnnouncements).catch(() => setAnnouncements([]));
    contentService.getHotlines().then(setHotlines).catch(() => setHotlines([]));
  }, []);

  const item = useMemo(
    () => (id ? announcements.find((announcement) => announcement.id === id) : null),
    [announcements, id]
  );

  if (id) {
    if (!item) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="container flex-1 py-16 text-center">
            <p>Announcement not found.</p>
            <Link to="/announcements" className="mt-4 inline-block text-primary underline">Back</Link>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container flex-1 max-w-3xl py-8 md:py-12">
          <Link to="/announcements" className="mb-6 flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Announcements
          </Link>
          <span className="mb-3 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{item.category}</span>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">{item.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(item.date).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <div className="mt-6 leading-relaxed text-muted-foreground">{item.content}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const filtered = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(search.toLowerCase()) ||
    announcement.summary.toLowerCase().includes(search.toLowerCase())
  );
  const featured = filtered.filter((announcement) => announcement.featured);
  const regular = filtered.filter((announcement) => !announcement.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-1 py-8 md:py-12">
        <h1 className="mb-2 font-heading text-3xl font-bold">Announcements</h1>
        <p className="mb-6 text-muted-foreground">Stay updated with the latest news and announcements from Barangay Sauyo.</p>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {featured.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-heading text-xl font-bold">Featured</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map((announcement) => <AnnouncementCard key={announcement.id} {...announcement} />)}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-xl font-bold">All Announcements</h2>
          {regular.length === 0 && featured.length === 0 ? (
            <p className="text-muted-foreground">No announcements found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(regular.length > 0 ? regular : filtered).map((announcement) => (
                <AnnouncementCard key={announcement.id} {...announcement} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
            <Phone className="h-5 w-5 text-accent" /> Emergency Hotlines
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {hotlines.map((hotline) => (
              <div key={hotline.id} className="text-sm">
                <span className="font-semibold">{hotline.name}:</span> <span className="text-muted-foreground">{hotline.number}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AnnouncementsPage;
