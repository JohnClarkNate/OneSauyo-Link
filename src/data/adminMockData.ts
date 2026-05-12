export const adminStats = {
  totalUsers: 1842,
  totalRequests: 356,
  pendingRequests: 42,
  resolvedRequests: 289,
  processingRequests: 25,
  activeStaff: 8,
};

export const requestsByCategory = [
  { category: "Infrastructure", count: 98 },
  { category: "Document Request", count: 142 },
  { category: "Sanitation", count: 45 },
  { category: "Peace & Order", count: 38 },
  { category: "Social Services", count: 33 },
];

export const requestsByStatus = [
  { status: "Pending", count: 42 },
  { status: "Processing", count: 25 },
  { status: "Resolved", count: 289 },
];

export const requestsByCommittee = [
  { committee: "Infrastructure", count: 98 },
  { committee: "Health", count: 52 },
  { committee: "Education", count: 34 },
  { committee: "Peace & Order", count: 38 },
  { committee: "Social Services", count: 33 },
  { committee: "Environment", count: 45 },
];

export const recentActivityLogs = [
  { id: "1", user: "Maria Santos", action: "Updated request REQ-2026-00231 to Processing", dateTime: "2026-02-12 09:15:00", role: "Staff", ip: "192.168.1.45" },
  { id: "2", user: "Carlos Reyes", action: "Added new event: Barangay Assembly", dateTime: "2026-02-12 08:30:00", role: "Admin", ip: "192.168.1.10" },
  { id: "3", user: "Juan Dela Cruz", action: "Submitted request REQ-2026-00260", dateTime: "2026-02-10 14:22:00", role: "Resident", ip: "110.23.45.67" },
  { id: "4", user: "Carlos Reyes", action: "Deactivated account of Roberto Tan", dateTime: "2026-02-09 16:00:00", role: "Admin", ip: "192.168.1.10" },
  { id: "5", user: "Maria Santos", action: "Resolved request REQ-2026-00245", dateTime: "2026-02-08 11:45:00", role: "Staff", ip: "192.168.1.45" },
];

export const auditLogs = [
  { id: "1", user: "Carlos Reyes", action: "Changed role of Maria Santos to Staff", dateTime: "2026-02-12 09:00:00", role: "Admin", ip: "192.168.1.10" },
  { id: "2", user: "Maria Santos", action: "Updated request REQ-2026-00231 status to Processing", dateTime: "2026-02-12 09:15:00", role: "Staff", ip: "192.168.1.45" },
  { id: "3", user: "Carlos Reyes", action: "Created event: Barangay Assembly", dateTime: "2026-02-12 08:30:00", role: "Admin", ip: "192.168.1.10" },
  { id: "4", user: "Juan Dela Cruz", action: "Submitted service request REQ-2026-00260", dateTime: "2026-02-10 14:22:00", role: "Resident", ip: "110.23.45.67" },
  { id: "5", user: "Carlos Reyes", action: "Deactivated account ID RES-2026-00089", dateTime: "2026-02-09 16:00:00", role: "Admin", ip: "192.168.1.10" },
  { id: "6", user: "Maria Santos", action: "Assigned REQ-2026-00245 to self", dateTime: "2026-02-08 10:00:00", role: "Staff", ip: "192.168.1.45" },
  { id: "7", user: "Carlos Reyes", action: "Verified account of Elena Cruz", dateTime: "2026-02-07 13:30:00", role: "Admin", ip: "192.168.1.10" },
  { id: "8", user: "Maria Santos", action: "Resolved request REQ-2026-00245", dateTime: "2026-02-08 11:45:00", role: "Staff", ip: "192.168.1.45" },
  { id: "9", user: "Carlos Reyes", action: "Exported monthly report for January 2026", dateTime: "2026-02-01 08:00:00", role: "Admin", ip: "192.168.1.10" },
  { id: "10", user: "Carlos Reyes", action: "System backup initiated", dateTime: "2026-01-31 23:00:00", role: "Admin", ip: "192.168.1.10" },
];

export interface ManagedUser {
  id: string;
  name: string;
  role: "Resident" | "Staff" | "Admin";
  status: "Active" | "Inactive";
  verified: boolean;
  email: string;
}

export const mockManagedUsers: ManagedUser[] = [
  { id: "RES-2026-00142", name: "Juan Dela Cruz", role: "Resident", status: "Active", verified: true, email: "juan@email.com" },
  { id: "STF-2026-00010", name: "Maria Santos", role: "Staff", status: "Active", verified: true, email: "maria@barangay.gov" },
  { id: "RES-2026-00089", name: "Roberto Tan", role: "Resident", status: "Inactive", verified: true, email: "roberto@email.com" },
  { id: "RES-2026-00200", name: "Elena Cruz", role: "Resident", status: "Active", verified: false, email: "elena@email.com" },
  { id: "RES-2026-00155", name: "Pedro Villanueva", role: "Resident", status: "Active", verified: true, email: "pedro@email.com" },
  { id: "RES-2026-00178", name: "Lorna Mendoza", role: "Resident", status: "Active", verified: true, email: "lorna@email.com" },
];

export const monthlySummary = [
  { month: "Sep", requests: 28 },
  { month: "Oct", requests: 35 },
  { month: "Nov", requests: 42 },
  { month: "Dec", requests: 30 },
  { month: "Jan", requests: 48 },
  { month: "Feb", requests: 22 },
];
