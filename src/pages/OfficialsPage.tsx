import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, Users, Target, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfficialCard from "@/components/OfficialCard";
import { contentService } from "@/services/contentService";
import type { OfficialItem } from "@/types/content";

const missionVision = {
  mission:
    "To provide efficient, transparent, and responsive governance that promotes the welfare and development of all residents of Barangay Sauyo.",
  vision:
    "A progressive barangay where every resident enjoys peace, security, and equal opportunities for economic and social development.",
};

const coreValues = [
  { id: "1", title: "Integrity", description: "Upholding honesty and transparency in all our dealings and transactions.", icon: Heart },
  { id: "2", title: "Community Service", description: "Dedicated to serving the needs and interests of our residents.", icon: Users },
  { id: "3", title: "Accountability", description: "Taking responsibility for our actions and decisions affecting the community.", icon: Target },
  { id: "4", title: "Innovation", description: "Embracing new ideas and technologies to improve service delivery.", icon: MapPin },
];

const barangayInfo = {
  name: "Barangay Sauyo",
  city: "Lungsod ng Quezon",
  region: "National Capital Region (NCR)",
  population: "~15,000+ residents",
  area: "Located in the urban development area",
  established: "1975",
};

const history =
  "Barangay Sauyo has been a vibrant community in Lungsod ng Quezon since its establishment in 1975. Throughout the decades, it has evolved from a small residential area into a progressive urban barangay. The barangay is committed to maintaining community harmony, supporting local businesses, and ensuring the welfare of all its residents. Today, Barangay Sauyo stands as a model of effective local governance, with strong community participation and strategic development initiatives.";

const officialPhotoByName: Record<string, string> = {
  "Hon. Noel F. Vitug": "vitug.jpg",
  "Hon. Rizza Joy P. Magtibay": "magtibay.jpg",
  "Hon. Carlos Dm. Apo": "apo.jpg",
  "Hon. Symond R. Del Mundo": "delmundo.jpg",
  "Hon. Camille J. Dela Cruz-Sibal": "sibal.jpg",
  "Hon. Karina Joyce D. Quilo-Diaz": "diaz.jpg",
  "Hon. Dendo M. Alvarez": "alvarez.jpg",
  "Hon. Luz P. Savilla": "savilla.jpg",
  "Bryan Rolly G. Maliwat": "maliwat.jpg",
};

const resolveOfficialPhoto = (official: OfficialItem) => {
  const photoValue = official.photo?.trim();
  const fileName = photoValue || officialPhotoByName[official.name] || "";

  if (!fileName) {
    return "";
  }

  if (fileName.startsWith("http://") || fileName.startsWith("https://") || fileName.startsWith("/")) {
    return fileName;
  }

  return `/officials/${fileName}`;
};

const OfficialsPage = () => {
  const location = useLocation();
  const [officials, setOfficials] = useState<OfficialItem[]>([]);

  useEffect(() => {
    if (location.pathname === "/about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    contentService.getOfficials().then(setOfficials).catch(() => setOfficials([]));
  }, []);

  const officialsWithPhotos = officials.map((official) => ({
    ...official,
    photo: resolveOfficialPhoto(official),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-1 py-8 md:py-12">
        <section id="officials">
          <h1 className="mb-2 font-heading text-3xl font-bold">Barangay Officials</h1>
          <p className="mb-8 text-muted-foreground">Meet the dedicated public servants of Barangay Sauyo.</p>

          {officialsWithPhotos.length > 0 && (
            <>
              <section className="mb-10">
                <div className="mx-auto max-w-sm">
                  <OfficialCard {...officialsWithPhotos[0]} />
                </div>
              </section>

              <section className="mb-16">
                <h2 className="mb-6 text-center font-heading text-xl font-bold">Barangay Council & Staff</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {officialsWithPhotos.slice(1).map((official) => (
                    <OfficialCard key={official.id} {...official} />
                  ))}
                </div>
              </section>
            </>
          )}
        </section>

        <section id="about" className="mb-14">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">About Barangay Sauyo</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Learn about our community, leadership, and commitment to progress.
            </p>
          </div>

          <section className="mb-14 rounded-lg bg-muted p-8">
            <h3 className="mb-6 font-heading text-2xl font-bold">Community Overview</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Name</p><p className="text-lg font-semibold text-foreground">{barangayInfo.name}</p></div>
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Location</p><p className="text-lg font-semibold text-foreground">{barangayInfo.city}</p></div>
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Region</p><p className="text-lg font-semibold text-foreground">{barangayInfo.region}</p></div>
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Population</p><p className="text-lg font-semibold text-foreground">{barangayInfo.population}</p></div>
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Area</p><p className="text-lg font-semibold text-foreground">{barangayInfo.area}</p></div>
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">Established</p><p className="text-lg font-semibold text-foreground">{barangayInfo.established}</p></div>
            </div>
          </section>

          <section className="mb-14">
            <h3 className="mb-8 text-center font-heading text-2xl font-bold">Mission & Vision</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-8 shadow-card">
                <h4 className="mb-3 font-heading text-lg font-bold text-primary">Our Mission</h4>
                <p className="leading-relaxed text-muted-foreground">{missionVision.mission}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-8 shadow-card">
                <h4 className="mb-3 font-heading text-lg font-bold text-primary">Our Vision</h4>
                <p className="leading-relaxed text-muted-foreground">{missionVision.vision}</p>
              </div>
            </div>
          </section>

          <section className="mb-14">
            <h3 className="mb-8 font-heading text-2xl font-bold">Core Values</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((value) => {
                const IconComponent = value.icon;
                return (
                  <div key={value.id} className="rounded-lg border border-border bg-card p-6 text-center shadow-card transition-all hover:shadow-card-hover">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="mb-2 font-heading font-bold">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-14">
            <h3 className="mb-6 font-heading text-2xl font-bold">History & Background</h3>
            <div className="rounded-lg border border-border bg-card p-8 shadow-card">
              <p className="leading-relaxed text-muted-foreground">{history}</p>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OfficialsPage;
