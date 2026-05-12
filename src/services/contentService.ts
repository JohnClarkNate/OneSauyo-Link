import apiService from "@/services/apiService";
import type {
  AnnouncementItem,
  EventItem,
  HotlineItem,
  OfficialItem,
} from "@/types/content";
import type { ManagedUser } from "@/types/admin";

interface APIListResponse<T, K extends string> {
  status: string;
  message?: string;
  [key: string]: T[] | string | undefined;
}

interface APIItemResponse<T, K extends string> {
  status: string;
  message?: string;
  [key: string]: T | string | undefined;
}

const getList = async <T>(endpoint: string, key: string): Promise<T[]> => {
  const response = await apiService.get<APIListResponse<T, string>>(endpoint);
  return (response[key] as T[]) ?? [];
};

const getItem = async <T>(endpoint: string, key: string): Promise<T | null> => {
  const response = await apiService.get<APIItemResponse<T, string>>(endpoint);
  return (response[key] as T) ?? null;
};

export const contentService = {
  getAnnouncements: () =>
    getList<AnnouncementItem>("/api.php?action=announcements", "announcements"),
  getAnnouncement: (id: string) =>
    getItem<AnnouncementItem>(`/api.php?action=announcement&id=${id}`, "announcement"),
  createAnnouncement: (data: Omit<AnnouncementItem, "id">) =>
    apiService.post("/api.php?action=announcements", data),
  updateAnnouncement: (id: string, data: Omit<AnnouncementItem, "id">) =>
    apiService.put(`/api.php?action=announcements&id=${id}`, data),
  deleteAnnouncement: (id: string) =>
    apiService.delete(`/api.php?action=announcements&id=${id}`),

  getEvents: () => getList<EventItem>("/api.php?action=events", "events"),
  getEvent: (id: string) =>
    getItem<EventItem>(`/api.php?action=event&id=${id}`, "event"),
  createEvent: (data: Omit<EventItem, "id">) =>
    apiService.post("/api.php?action=events", data),
  updateEvent: (id: string, data: Omit<EventItem, "id">) =>
    apiService.put(`/api.php?action=events&id=${id}`, data),
  deleteEvent: (id: string) =>
    apiService.delete(`/api.php?action=events&id=${id}`),

  getOfficials: () =>
    getList<OfficialItem>("/api.php?action=officials", "officials"),
  createOfficial: (data: Omit<OfficialItem, "id">) =>
    apiService.post("/api.php?action=officials", data),
  updateOfficial: (id: string, data: Omit<OfficialItem, "id">) =>
    apiService.put(`/api.php?action=officials&id=${id}`, data),
  deleteOfficial: (id: string) =>
    apiService.delete(`/api.php?action=officials&id=${id}`),

  getHotlines: () => getList<HotlineItem>("/api.php?action=hotlines", "hotlines"),
  createHotline: (data: Omit<HotlineItem, "id">) =>
    apiService.post("/api.php?action=hotlines", data),
  updateHotline: (id: string, data: Omit<HotlineItem, "id">) =>
    apiService.put(`/api.php?action=hotlines&id=${id}`, data),
  deleteHotline: (id: string) =>
    apiService.delete(`/api.php?action=hotlines&id=${id}`),

  getUsers: () => getList<ManagedUser>("/api.php?action=users", "users"),
  createUser: (data: Record<string, unknown>) =>
    apiService.post("/api.php?action=users", data),
  updateUser: (id: number, data: Record<string, unknown>) =>
    apiService.put(`/api.php?action=users&id=${id}`, data),
  deleteUser: (id: number) =>
    apiService.delete(`/api.php?action=users&id=${id}`),
};
