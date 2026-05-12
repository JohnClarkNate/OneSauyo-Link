import { useCallback, useEffect, useState } from "react";
import StaffNavbar from "@/components/StaffNavbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { contentService } from "@/services/contentService";
import type { ManagedUser } from "@/types/admin";
import { Eye, FileText, ShieldCheck, Trash2, Users } from "lucide-react";

const documentUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `/api/${path.replace(/^\/+/, "")}`;
};

const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-medium text-foreground">{value || "Not provided"}</p>
  </div>
);

const StaffResidentsPage = () => {
  const { toast } = useToast();
  const [residents, setResidents] = useState<ManagedUser[]>([]);
  const [selectedResident, setSelectedResident] = useState<ManagedUser | null>(null);
  const [residentToDelete, setResidentToDelete] = useState<ManagedUser | null>(null);

  const loadResidents = useCallback(async () => {
    const items = await contentService.getUsers();
    setResidents(items.filter((item) => item.role === "Resident"));
  }, []);

  useEffect(() => {
    loadResidents().catch(() => {
      toast({ title: "Error", description: "Failed to load residents.", variant: "destructive" });
    });
  }, [loadResidents, toast]);

  const updateResident = async (resident: ManagedUser, payload: Record<string, unknown>, successMessage: string) => {
    try {
      await contentService.updateUser(resident.userId, payload);
      await loadResidents();
      toast({ title: "Resident Updated", description: successMessage });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update resident.",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = (resident: ManagedUser) => {
    const nextStatus = resident.status === "Active" ? "inactive" : "active";
    updateResident(resident, { status: nextStatus }, "Resident account status updated.");
  };

  const verifyResident = (resident: ManagedUser) => {
    updateResident(resident, { verified: true }, "Resident registration has been verified.");
  };

  const deleteResident = async () => {
    if (!residentToDelete) return;

    try {
      await contentService.deleteUser(residentToDelete.userId);
      await loadResidents();
      toast({ title: "Resident Deleted", description: `${residentToDelete.name} has been removed.` });
      setResidentToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete resident.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StaffNavbar />
      <main className="container py-8 space-y-8">
        <h1 className="font-heading text-2xl font-bold text-primary">Resident Management</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" /> Residents
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Voter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                      No resident registrations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  residents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-mono text-xs">{resident.id}</TableCell>
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell className="text-sm">{resident.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={resident.registeredVoter ? "text-emerald-600" : "text-muted-foreground"}>
                          {resident.registeredVoter ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={resident.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}>
                          {resident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {resident.verified ? <Badge variant="outline" className="text-emerald-600">Verified</Badge> : <Badge variant="outline" className="text-amber-600">Pending</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button size="icon" variant="outline" aria-label={`View ${resident.name}`} onClick={() => setSelectedResident(resident)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleStatus(resident)}>
                            {resident.status === "Active" ? "Deactivate" : "Activate"}
                          </Button>
                          {!resident.verified && <Button size="sm" variant="outline" onClick={() => verifyResident(resident)}>Verify</Button>}
                          <Button size="icon" variant="outline" aria-label={`Delete ${resident.name}`} onClick={() => setResidentToDelete(resident)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <Dialog open={Boolean(selectedResident)} onOpenChange={(open) => !open && setSelectedResident(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Resident Registration Details
            </DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DetailItem label="Last Name" value={selectedResident.lastName} />
                <DetailItem label="First Name" value={selectedResident.firstName} />
                <DetailItem label="Middle Name" value={selectedResident.middleName} />
                <DetailItem label="Username" value={selectedResident.username} />
                <DetailItem label="Email" value={selectedResident.email} />
                <DetailItem label="Barangay ID" value={selectedResident.barangayId} />
                <DetailItem label="Gender" value={selectedResident.gender} />
                <DetailItem label="Birth Date" value={selectedResident.birthDate} />
                <DetailItem label="Age" value={selectedResident.age} />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Address</p>
                <p className="mt-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">{selectedResident.address || "Not provided"}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={selectedResident.registeredVoter ? "text-emerald-600" : "text-muted-foreground"}>
                  Registered Voter: {selectedResident.registeredVoter ? "Yes" : "No"}
                </Badge>
                <Badge className={selectedResident.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}>
                  {selectedResident.status}
                </Badge>
                {selectedResident.verified ? <Badge variant="outline" className="text-emerald-600">Verified</Badge> : <Badge variant="outline" className="text-amber-600">Pending</Badge>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button asChild variant="outline" className="justify-start gap-2" disabled={!selectedResident.validIdPhoto}>
                  <a href={documentUrl(selectedResident.validIdPhoto)} target="_blank" rel="noreferrer">
                    <FileText className="h-4 w-4" /> View Valid ID
                  </a>
                </Button>
                <Button asChild variant="outline" className="justify-start gap-2" disabled={!selectedResident.schoolIdPhoto}>
                  <a href={documentUrl(selectedResident.schoolIdPhoto)} target="_blank" rel="noreferrer">
                    <FileText className="h-4 w-4" /> View School ID
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(residentToDelete)} onOpenChange={(open) => !open && setResidentToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resident Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Delete {residentToDelete?.name ? <span className="font-medium text-foreground">{residentToDelete.name}</span> : "this resident"} permanently from the system?
            </p>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResidentToDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => void deleteResident()}>Delete Resident</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffResidentsPage;
