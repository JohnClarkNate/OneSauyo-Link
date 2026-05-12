import StaffNavbar from "@/components/StaffNavbar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { StaffRequest } from "@/data/staffMockData";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const StaffRequestsPage = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<StaffRequest[]>([]);

  const updateStatus = (id: string, status: StaffRequest["status"]) => {
    setRequests((prev) => prev.map((request) => request.id === id ? { ...request, status } : request));
    toast({ title: "Status Updated", description: `Request updated to ${status}.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <StaffNavbar />
      <main className="container py-8 space-y-6">
        <h1 className="font-heading text-2xl font-bold text-primary">All Requests</h1>
        <Card>
          {requests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-card-foreground">No requests available.</p>
              <p className="mt-1 text-xs text-muted-foreground">Once residents submit requests, they will be listed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref #</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs">{request.referenceNumber}</TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                      <TableCell>{request.residentName}</TableCell>
                      <TableCell>{request.dateSubmitted}</TableCell>
                      <TableCell><Badge className={statusColors[request.status]}>{request.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
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
      </main>
    </div>
  );
};

export default StaffRequestsPage;
