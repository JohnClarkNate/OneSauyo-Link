import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StaffNavbar from "@/components/StaffNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffRequest } from "@/data/staffMockData";
import type { Notification } from "@/data/residentMockData";
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const StaffDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const notifications: Notification[] = [];

  if (!user) return null;

  const counts = {
    assigned: requests.filter((request) => request.assignedTo === `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()).length,
    pending: requests.filter((request) => request.status === "Pending").length,
    processing: requests.filter((request) => request.status === "Processing").length,
    resolved: requests.filter((request) => request.status === "Resolved").length,
  };

  const filtered = filter === "all" ? requests : requests.filter((request) => request.status === filter);

  const updateStatus = (id: string, status: StaffRequest["status"]) => {
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, status } : request));
    toast({ title: "Status Updated", description: `Request updated to ${status}.` });
  };

  const assignToSelf = (id: string) => {
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.name;
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, assignedTo: fullName } : request));
    toast({ title: "Request Assigned", description: "Request assigned to you." });
  };

  return (
    <div className="min-h-screen bg-background">
      <StaffNavbar />
      <main className="container py-8 space-y-8">
        <h1 className="font-heading text-2xl font-bold text-primary">Staff Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.firstName || user.name}! Here's your request overview.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Assigned to Me", value: counts.assigned, icon: ClipboardList, color: "text-primary" },
            { label: "Pending", value: counts.pending, icon: AlertCircle, color: "text-amber-600" },
            { label: "Processing", value: counts.processing, icon: Clock, color: "text-blue-600" },
            { label: "Resolved", value: counts.resolved, icon: CheckCircle2, color: "text-emerald-600" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Requests</h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              {filtered.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-card-foreground">No assigned requests yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground">New resident requests will appear here once request handling is connected.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ref #</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Resident</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-xs">{request.referenceNumber}</TableCell>
                          <TableCell>{request.category}</TableCell>
                          <TableCell>{request.residentName}</TableCell>
                          <TableCell><Badge className={statusColors[request.status]}>{request.status}</Badge></TableCell>
                          <TableCell className="text-sm">{request.assignedTo || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {!request.assignedTo && <Button size="sm" variant="outline" onClick={() => assignToSelf(request.id)}>Assign</Button>}
                              {request.status === "Pending" && <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, "Processing")}>Process</Button>}
                              {request.status === "Processing" && <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, "Resolved")}>Resolve</Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</h2>
            <Card>
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-card-foreground">No notifications yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Task alerts for staff will show here once available.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`px-4 py-3 text-sm ${!notification.read ? "bg-primary/5" : ""}`}>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{notification.message}</p>
                      <p className="text-muted-foreground text-[10px] mt-1">{notification.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
