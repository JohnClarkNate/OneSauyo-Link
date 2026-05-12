export interface StaffRequest {
  id: string;
  referenceNumber: string;
  category: string;
  description: string;
  status: "Pending" | "Processing" | "Resolved";
  dateSubmitted: string;
  residentName: string;
  assignedTo: string | null;
}

export const staffRequests: StaffRequest[] = [
  { id: "1", referenceNumber: "REQ-2026-00231", category: "Infrastructure", description: "Pothole along Purok 3 main road needs repair", status: "Processing", dateSubmitted: "2026-02-01", residentName: "Juan Dela Cruz", assignedTo: "Maria Santos" },
  { id: "2", referenceNumber: "REQ-2026-00245", category: "Document Request", description: "Barangay Clearance for employment purposes", status: "Resolved", dateSubmitted: "2026-01-20", residentName: "Ana Garcia", assignedTo: "Maria Santos" },
  { id: "3", referenceNumber: "REQ-2026-00260", category: "Sanitation", description: "Garbage collection missed on our street for 2 weeks", status: "Pending", dateSubmitted: "2026-02-10", residentName: "Pedro Villanueva", assignedTo: null },
  { id: "4", referenceNumber: "REQ-2026-00275", category: "Infrastructure", description: "Streetlight not working on Purok 7", status: "Pending", dateSubmitted: "2026-02-11", residentName: "Elena Cruz", assignedTo: null },
  { id: "5", referenceNumber: "REQ-2026-00280", category: "Document Request", description: "Certificate of Indigency for school enrollment", status: "Processing", dateSubmitted: "2026-02-09", residentName: "Carlo Aquino", assignedTo: "Maria Santos" },
  { id: "6", referenceNumber: "REQ-2026-00290", category: "Peace & Order", description: "Noise complaint from neighbor's karaoke every night", status: "Pending", dateSubmitted: "2026-02-12", residentName: "Lorna Mendoza", assignedTo: null },
];

export const staffNotifications = [
  { id: "1", title: "New Request Assigned", message: "REQ-2026-00275 has been submitted and needs assignment.", date: "2026-02-11", read: false },
  { id: "2", title: "Request Resolved", message: "REQ-2026-00245 has been marked as resolved.", date: "2026-02-10", read: false },
  { id: "3", title: "Overdue Reminder", message: "REQ-2026-00260 has been pending for over 3 days.", date: "2026-02-13", read: true },
];
