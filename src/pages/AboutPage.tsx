import { MapPin, Users, Target, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// TODO: Modify the mission and vision statements below
const missionVision = {
  mission:
    "To provide efficient, transparent, and responsive governance that promotes the welfare and development of all residents of Barangay Sauyo.",
  vision:
    "A progressive barangay where every resident enjoys peace, security, and equal opportunities for economic and social development.",
};

// TODO: Add or modify core values as needed
const coreValues = [
  {
    id: "1",
    title: "Integrity",
    description: "Upholding honesty and transparency in all our dealings and transactions.",
    icon: Heart,
  },
  {
    id: "2",
    title: "Community Service",
    description: "Dedicated to serving the needs and interests of our residents.",
    icon: Users,
  },
  {
    id: "3",
    title: "Accountability",
    description: "Taking responsibility for our actions and decisions affecting the community.",
    icon: Target,
  },
  {
    id: "4",
    title: "Innovation",
    description: "Embracing new ideas and technologies to improve service delivery.",
    icon: MapPin,
  },
];

// TODO: Modify the barangay information below
const barangayInfo = {
  name: "Barangay Sauyo",
  city: "Lungsod ng Quezon",
  region: "National Capital Region (NCR)",
  population: "~15,000+ residents",
  area: "Located in the urban development area",
  established: "1975",
};

// TODO: Modify the history/background content below
const history =
  "Barangay Sauyo has been a vibrant community in Lungsod ng Quezon since its establishment in 1975. Throughout the decades, it has evolved from a small residential area into a progressive urban barangay. The barangay is committed to maintaining community harmony, supporting local businesses, and ensuring the welfare of all its residents. Today, Barangay Sauyo stands as a model of effective local governance, with strong community participation and strategic development initiatives.";

const AboutPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container py-8 md:py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">About Barangay Sauyo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn about our community, leadership, and commitment to progress.
        </p>
      </div>

      {/* Overview Section */}
      {/* TODO: Modify the barangay information displayed below */}
      <section className="mb-14 bg-muted rounded-lg p-8">
        <h2 className="font-heading text-2xl font-bold mb-6">Community Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">Name</p>
            <p className="text-lg font-semibold text-foreground">{barangayInfo.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">Location</p>
            <p className="text-lg font-semibold text-foreground">{barangayInfo.city}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">Region</p>
            <p className="text-lg font-semibold text-foreground">{barangayInfo.region}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">Population</p>
            <p className="text-lg font-semibold text-foreground">{barangayInfo.population}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">Area</p>
            <p className="text-lg font-semibold text-foreground">{barangayInfo.area}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">Established</p>
            <p className="text-lg font-semibold text-foreground">{barangayInfo.established}</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {/* TODO: Modify the mission and vision statements */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-bold mb-8 text-center">Mission & Vision</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-8 shadow-card">
            <h3 className="font-heading text-lg font-bold text-primary mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">{missionVision.mission}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-card">
            <h3 className="font-heading text-lg font-bold text-primary mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">{missionVision.vision}</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {/* TODO: Add or modify core values as needed */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-bold mb-8">Core Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value) => {
            const IconComponent = value.icon;
            return (
              <div
                key={value.id}
                className="rounded-lg border border-border bg-card p-6 text-center shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* History & Background */}
      {/* TODO: Modify the history/background content below */}
      <section className="mb-14">
        <h2 className="font-heading text-2xl font-bold mb-6">History & Background</h2>
        <div className="rounded-lg border border-border bg-card p-8 shadow-card">
          <p className="text-muted-foreground leading-relaxed">{history}</p>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default AboutPage;
