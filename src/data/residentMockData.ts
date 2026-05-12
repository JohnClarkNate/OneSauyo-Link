export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  category: string;
  description: string;
  status: "Pending" | "Processing" | "Received" | "Resolved";
  dateSubmitted: string;
  timeline: { status: string; date: string; note: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const mockRequests: ServiceRequest[] = [
  {
    id: "1",
    referenceNumber: "REQ-2026-00231",
    category: "Infrastructure",
    description: "Pothole along Purok 3 main road needs repair",
    status: "Processing",
    dateSubmitted: "2026-02-01",
    timeline: [
      { status: "Pending", date: "2026-02-01", note: "Request submitted" },
      { status: "Processing", date: "2026-02-05", note: "Assigned to infrastructure team" },
    ],
  },
  {
    id: "2",
    referenceNumber: "REQ-2026-00245",
    category: "Document Request",
    description: "Barangay Clearance for employment purposes",
    status: "Resolved",
    dateSubmitted: "2026-01-20",
    timeline: [
      { status: "Pending", date: "2026-01-20", note: "Request submitted" },
      { status: "Processing", date: "2026-01-22", note: "Document being prepared" },
      { status: "Resolved", date: "2026-01-25", note: "Ready for pickup at Barangay Hall" },
    ],
  },
  {
    id: "3",
    referenceNumber: "REQ-2026-00260",
    category: "Sanitation",
    description: "Garbage collection missed on our street for 2 weeks",
    status: "Pending",
    dateSubmitted: "2026-02-10",
    timeline: [
      { status: "Pending", date: "2026-02-10", note: "Request submitted" },
    ],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Request Update",
    message: "Your infrastructure request REQ-2026-00231 is now being processed.",
    date: "2026-02-05",
    read: false,
  },
  {
    id: "2",
    title: "Document Ready",
    message: "Your Barangay Clearance is ready for pickup.",
    date: "2026-01-25",
    read: false,
  },
  {
    id: "3",
    title: "Community Notice",
    message: "Barangay Assembly scheduled for February 20, 2026.",
    date: "2026-02-08",
    read: true,
  },
  {
    id: "4",
    title: "Welcome!",
    message: "Your resident account has been successfully created.",
    date: "2026-01-15",
    read: true,
  },
];
