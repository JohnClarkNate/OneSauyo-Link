import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Users, DollarSign, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// TODO: Modify the services array below to add/remove/edit services
// Each service should have: id, title, description, icon, and category
const services = [
  {
    id: "1",
    title: "Barangay Clearance",
    description: "Official document certifying residency and good moral character. Required for employment, business permits, and other official transactions.",
    icon: FileText,
    category: "Documents",
  },
  {
    id: "2",
    title: "Business Permits",
    description: "Registration and permits for small businesses operating within the barangay. Includes guidelines and requirements for entrepreneurs.",
    icon: Briefcase,
    category: "Business",
  },
  {
    id: "3",
    title: "Community Programs",
    description: "Various community development programs including livelihood training, health services, and educational assistance for residents.",
    icon: Users,
    category: "Community",
  },
  {
    id: "4",
    title: "Assistance Programs",
    description: "Financial and material assistance for underprivileged residents. Includes disaster relief and emergency aid.",
    icon: DollarSign,
    category: "Assistance",
  },
  {
    id: "5",
    title: "Safety & Security",
    description: "Emergency response, peace and order maintenance, and community safety programs to ensure resident protection.",
    icon: AlertCircle,
    category: "Security",
  },
  {
    id: "6",
    title: "Utility Services",
    description: "Support for water, electricity, and waste management services. Assistance with billing disputes and service complaints.",
    icon: Zap,
    category: "Utilities",
  },
];


const ServicesPage = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isResident = user?.role === "resident";

  const handleMakeRequest = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container py-8 md:py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Our Services</h1>
        <p className="text-muted-foreground">
          From essential documents to community programs, we are here to assist you with your needs. {isResident || !user ? "Hover over any service below to make a request!" : "Explore our available services and programs."}
        </p>
      </div>

      {/* Services Grid */}
      {/* TODO: Customize the grid layout or styling as needed */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-bold mb-8">Available Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="relative rounded-lg border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:border-primary/50"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground mb-2">
                      {service.category}
                    </span>
                    <h3 className="font-heading text-lg font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Hover Button for Residents and Non-Logged-In Users */}
                {(isResident || !user) && hoveredService === service.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-lg flex items-center justify-center border border-white/30 shadow-2xl">
                    <Button
                      onClick={isResident ? () => navigate("/resident/submit-request") : handleMakeRequest}
                      className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg backdrop-blur-sm"
                    >
                      {isResident ? "Make a Request" : "Login or Register to Make a Request"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* How to Access Section */}
      {/* TODO: Modify the steps or contact information below */}
      <section className="mb-16 bg-muted rounded-lg p-8">
        <h2 className="font-heading text-2xl font-bold mb-8 text-center">How to Access Our Services</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-heading font-bold mb-2">Visit</h3>
            <p className="text-sm text-muted-foreground">
              Click any service above to view details and submit your request. You may also visit our office for in-person assistance during working hours.
            </p>
          </div>
          <div className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-heading font-bold mb-2">Apply</h3>
            <p className="text-sm text-muted-foreground">
              Fill out the application form and submit all required documents. You can track your request status online or through our hotline for updates.
            </p>
          </div>
          <div className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-heading font-bold mb-2">Receive</h3>
            <p className="text-sm text-muted-foreground">
              Track your request status online or through our hotline. Once approved, you can receive your documents or assistance as scheduled.
            </p>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
  );
};

export default ServicesPage;
