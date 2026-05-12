import { Calendar, ArrowRight, Megaphone, Heart, Briefcase, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface AnnouncementCardProps {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  featured?: boolean;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, typeof Megaphone> = {
    "Health": Heart,
    "Infrastructure": Briefcase,
    "Governance": Users,
    "Social Services": Megaphone,
  };
  return icons[category] || Megaphone;
};

const getCategoryStyle = (category: string) => {
  const styles: Record<string, { bg: string; text: string; accent: string }> = {
    "Health": { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", accent: "bg-red-500" },
    "Infrastructure": { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", accent: "bg-blue-500" },
    "Governance": { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", accent: "bg-purple-500" },
    "Social Services": { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", accent: "bg-emerald-500" },
  };
  return styles[category] || { bg: "bg-muted", text: "text-muted-foreground", accent: "bg-primary" };
};

const AnnouncementCard = ({ id, title, date, category, summary, featured }: AnnouncementCardProps) => {
  const CategoryIcon = getCategoryIcon(category);
  const style = getCategoryStyle(category);

  return (
    <Link to={`/announcements/${id}`} className="group block h-full">
      <div
        className={`relative h-full rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col ${
          featured
            ? "bg-gradient-to-br from-primary/[0.04] to-secondary/[0.08] border-2 border-secondary/40 shadow-lg hover:shadow-xl"
            : "bg-card border border-border shadow-card hover:shadow-card-hover hover:border-primary/20"
        }`}
      >
        {/* Accent stripe */}
        <div className={`h-1.5 w-full ${style.accent}`} />

        <div className="p-5 flex-1 flex flex-col gap-3">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
              <CategoryIcon className="h-3 w-3" />
              {category}
            </span>
            {featured && (
              <span className="inline-flex items-center gap-1 rounded-full gradient-gold px-2.5 py-0.5 text-[11px] font-bold text-secondary-foreground tracking-wide uppercase">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-[15px] font-bold leading-snug text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {summary}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between">
            <time className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
            </time>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary translate-x-0 group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
              Read more
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnnouncementCard;
