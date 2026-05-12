export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  category: string;
  featured: boolean;
  summary: string;
  content: string;
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  category: string;
}

export interface OfficialItem {
  id: string;
  name: string;
  position: string;
  term: string;
  photo: string;
  responsibilities: string;
}

export interface HotlineItem {
  id: string;
  name: string;
  number: string;
}
