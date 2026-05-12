import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { contentService } from "@/services/contentService";
import type { OfficialItem } from "@/types/content";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = { name: "", position: "", term: "", photo: "", responsibilities: "" };

const ManageOfficialsPage = () => {
  const { toast } = useToast();
  const [list, setList] = useState<OfficialItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OfficialItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadOfficials = async () => {
    const items = await contentService.getOfficials();
    setList(items);
  };

  useEffect(() => {
    loadOfficials().catch(() => {
      toast({ title: "Error", description: "Failed to load officials.", variant: "destructive" });
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: OfficialItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      position: item.position,
      term: item.term,
      photo: item.photo,
      responsibilities: item.responsibilities,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.position) {
      toast({ title: "Error", description: "Name and position are required.", variant: "destructive" });
      return;
    }

    try {
      if (editing) {
        await contentService.updateOfficial(editing.id, form);
        toast({ title: "Official Updated", description: `"${form.name}" has been updated.` });
      } else {
        await contentService.createOfficial(form);
        toast({ title: "Official Added", description: `"${form.name}" has been added.` });
      }

      await loadOfficials();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save official.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteOfficial(id);
      await loadOfficials();
      toast({ title: "Official Removed", description: "Official has been removed." });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete official.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container space-y-6 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="font-heading text-2xl font-bold text-primary">Officials Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Official</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
              <DialogHeader><DialogTitle>{editing ? "Edit Official" : "Add Official"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Full Name</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
                <div><Label>Position</Label><Input value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} placeholder="e.g. Punong Barangay" /></div>
                <div><Label>Term</Label><Input value={form.term} onChange={(event) => setForm({ ...form, term: event.target.value })} placeholder="e.g. 2023 - 2026" /></div>
                <div><Label>Photo URL (optional)</Label><Input value={form.photo} onChange={(event) => setForm({ ...form, photo: event.target.value })} /></div>
                <div><Label>Responsibilities</Label><Textarea value={form.responsibilities} onChange={(event) => setForm({ ...form, responsibilities: event.target.value })} rows={3} /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update Official" : "Add Official"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.position}</TableCell>
                    <TableCell>{item.term}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No officials found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ManageOfficialsPage;
