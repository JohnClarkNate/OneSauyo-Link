import { User } from "lucide-react";

interface OfficialCardProps {
  name: string;
  position: string;
  term: string;
  photo: string;
  responsibilities: string;
}

const OfficialCard = ({ name, position, term, photo, responsibilities }: OfficialCardProps) => (
  <div className="group rounded-lg border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 text-center">
    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10">
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <User className="h-10 w-10 text-primary" />
      )}
    </div>
    <h3 className="font-heading text-base font-bold text-card-foreground">{name}</h3>
    <p className="mt-1 text-sm font-semibold text-secondary">{position}</p>
    <p className="mt-1 text-xs text-muted-foreground">{term}</p>
    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{responsibilities}</p>
  </div>
);

export default OfficialCard;
