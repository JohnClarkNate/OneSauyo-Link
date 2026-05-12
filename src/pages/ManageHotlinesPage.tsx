import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { contentService } from "@/services/contentService";
import type { HotlineItem } from "@/types/content";
import { Plus, Pencil, Trash2, Phone } from "lucide-react";

const emptyForm = { name: "", number: "" };

const ManageHotlinesPage = () => {
  const { toast } = useToast();
  const [list, setList] = useState<HotlineItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HotlineItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadHotlines = async () => {
    const items = await contentService.getHotlines();
    setList(items);
  };

  useEffect(() => {
    loadHotlines().catch(() => {
      toast({ title: "Error", description: "Failed to load hotlines.", variant: "destructive" });
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: HotlineItem) => {
    setEditing(item);
    setForm({ name: item.name, number: item.number });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.number) {
      toast({ title: "Error", description: "Name and number are required.", variant: "destructive" });
      return;
    }

    try {
      if (editing) {
        await contentService.updateHotline(editing.id, form);
        toast({ title: "Hotline Updated", description: `"${form.name}" has been updated.` });
      } else {
        await contentService.createHotline(form);
        toast({ title: "Hotline Added", description: `"${form.name}" has been added.` });
      }

      await loadHotlines();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save hotline.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await contentService.deleteHotline(id);
      await loadHotlines();
      toast({ title: "Hotline Removed", description: `"${name}" has been removed.` });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete hotline.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container space-y-6 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-primary">
            <Phone className="h-6 w-6" /> Hotlines Management
          </h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Hotline</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Hotline" : "Add Hotline"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Barangay Hall" /></div>
                <div><Label>Contact Number</Label><Input value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} placeholder="e.g. (02) 8123-4567" /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update Hotline" : "Add Hotline"}</Button>
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
                  <TableHead>Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.number}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id, item.name)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No hotlines found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ManageHotlinesPage;
