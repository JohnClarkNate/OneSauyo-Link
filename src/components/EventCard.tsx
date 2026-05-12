import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

const EventCard = ({ id, title, date, time, location, category }: EventCardProps) => (
  <Link
    to={`/events/${id}`}
    className="group block w-full rounded-lg border border-border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
  >
    <span className="mb-3 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
      {category}
    </span>
    <h3 className="font-heading text-base font-bold text-card-foreground transition-colors group-hover:text-primary">
      {title}
    </h3>
    <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {new Date(date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} · {time}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        {location}
      </span>
    </div>
  </Link>
);

export default EventCard;
