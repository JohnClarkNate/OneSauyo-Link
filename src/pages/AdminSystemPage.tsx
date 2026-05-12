import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { contentService } from "@/services/contentService";
import type { ManagedUser } from "@/types/admin";
import { Shield, Database, Archive, Download, Upload, UserPlus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const emptyUserForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
};

const AdminSystemPage = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);
  const [staffForm, setStaffForm] = useState(emptyUserForm);
  const [adminForm, setAdminForm] = useState(emptyUserForm);

  const loadUsers = async () => {
    const items = await contentService.getUsers();
    setUsers(items.filter((item) => item.role !== "Resident"));
  };

  useEffect(() => {
    loadUsers().catch(() => {
      toast({ title: "Error", description: "Failed to load users.", variant: "destructive" });
    });
  }, []);

  const updateUser = async (userId: number, payload: Record<string, unknown>, successMessage: string) => {
    try {
      await contentService.updateUser(userId, payload);
      await loadUsers();
      toast({ title: "User Updated", description: successMessage });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = (user: ManagedUser) => {
    const nextStatus = user.status === "Active" ? "inactive" : "active";
    updateUser(user.userId, { status: nextStatus }, "User account status updated.");
  };

  const verifyUser = (user: ManagedUser) => {
    updateUser(user.userId, { verified: true }, "User account has been verified.");
  };

  const openDeleteDialog = (user: ManagedUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      await contentService.deleteUser(userToDelete.userId);
      await loadUsers();
      toast({ title: "User Deleted", description: `${userToDelete.name} has been removed.` });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const createManagedUser = async (role: "staff" | "admin", form: typeof emptyUserForm) => {
    if (!form.firstName || !form.lastName || !form.email || !form.username || !form.password) {
      toast({ title: "Error", description: `Please complete all required ${role} fields.`, variant: "destructive" });
      return;
    }

    try {
      await contentService.createUser({
        ...form,
        role,
        verified: true,
        status: "active",
      });
      await loadUsers();
      if (role === "staff") {
        setStaffDialogOpen(false);
        setStaffForm(emptyUserForm);
      } else {
        setAdminDialogOpen(false);
        setAdminForm(emptyUserForm);
      }
      toast({ title: role === "staff" ? "Staff Added" : "Admin Added", description: `New ${role} account created successfully.` });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to create ${role} account.`,
        variant: "destructive",
      });
    }
  };

  const isCurrentAdminRow = (managedUser: ManagedUser) => currentUser?.id === managedUser.userId;

  const roleBadgeClass = (role: ManagedUser["role"]) => {
    if (role === "Admin") return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
    if (role === "Staff") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container py-8 space-y-8">
        <h1 className="font-heading text-2xl font-bold text-primary">System Administration</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5" /> User Management</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><UserPlus className="h-4 w-4" /> Add Staff</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Staff Account</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>First Name</Label><Input value={staffForm.firstName} onChange={(event) => setStaffForm({ ...staffForm, firstName: event.target.value })} /></div>
                      <div><Label>Last Name</Label><Input value={staffForm.lastName} onChange={(event) => setStaffForm({ ...staffForm, lastName: event.target.value })} /></div>
                    </div>
                    <div><Label>Middle Name</Label><Input value={staffForm.middleName} onChange={(event) => setStaffForm({ ...staffForm, middleName: event.target.value })} /></div>
                    <div><Label>Email</Label><Input type="email" value={staffForm.email} onChange={(event) => setStaffForm({ ...staffForm, email: event.target.value })} /></div>
                    <div><Label>Username</Label><Input value={staffForm.username} onChange={(event) => setStaffForm({ ...staffForm, username: event.target.value })} /></div>
                    <div><Label>Temporary Password</Label><Input type="password" value={staffForm.password} onChange={(event) => setStaffForm({ ...staffForm, password: event.target.value })} /></div>
                    <Button onClick={() => createManagedUser("staff", staffForm)} className="w-full">Create Staff Account</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2"><UserPlus className="h-4 w-4" /> Add Admin</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Admin Account</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>First Name</Label><Input value={adminForm.firstName} onChange={(event) => setAdminForm({ ...adminForm, firstName: event.target.value })} /></div>
                      <div><Label>Last Name</Label><Input value={adminForm.lastName} onChange={(event) => setAdminForm({ ...adminForm, lastName: event.target.value })} /></div>
                    </div>
                    <div><Label>Middle Name</Label><Input value={adminForm.middleName} onChange={(event) => setAdminForm({ ...adminForm, middleName: event.target.value })} /></div>
                    <div><Label>Email</Label><Input type="email" value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} /></div>
                    <div><Label>Username</Label><Input value={adminForm.username} onChange={(event) => setAdminForm({ ...adminForm, username: event.target.value })} /></div>
                    <div><Label>Temporary Password</Label><Input type="password" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} /></div>
                    <Button onClick={() => createManagedUser("admin", adminForm)} className="w-full">Create Admin Account</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <Dialog
            open={deleteDialogOpen}
            onOpenChange={(open) => {
              setDeleteDialogOpen(open);
              if (!open) {
                setUserToDelete(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete User Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Delete {userToDelete?.name ? <span className="font-medium text-foreground">{userToDelete.name}</span> : "this user"} permanently from the system?
                </p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={() => void deleteUser()}>Delete User</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleBadgeClass(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.verified ? <Badge variant="outline" className="text-emerald-600">Verified</Badge> : <Badge variant="outline" className="text-amber-600">Pending</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {isCurrentAdminRow(user) ? (
                          <span className="text-xs text-muted-foreground self-center">Current account</span>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toggleStatus(user)}>
                              {user.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                            {!user.verified && <Button size="sm" variant="outline" onClick={() => verifyUser(user)}>Verify</Button>}
                            <Button
                              size="icon"
                              variant="outline"
                              aria-label={`Delete ${user.name}`}
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="h-5 w-5" /> Backup & Restore</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Create a system backup or restore from a previous backup.</p>
              <div className="flex gap-3">
                <Button className="gap-2" onClick={() => toast({ title: "Backup Started", description: "System backup initiated (mock)." })}>
                  <Download className="h-4 w-4" /> Backup
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Restore", description: "Restore from backup initiated (mock)." })}>
                  <Upload className="h-4 w-4" /> Restore
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Archive className="h-5 w-5" /> Data Archive</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Archive old records to improve system performance.</p>
              <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Archive", description: "Data archiving initiated (mock)." })}>
                <Archive className="h-4 w-4" /> Archive Old Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSystemPage;
