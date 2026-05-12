import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { contentService } from "@/services/contentService";
import type { AnnouncementItem } from "@/types/content";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const emptyForm = {
  title: "",
  date: "",
  category: "",
  featured: false,
  summary: "",
  content: "",
  image: "",
};

const ManageAnnouncementsPage = () => {
  const { toast } = useToast();
  const [list, setList] = useState<AnnouncementItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AnnouncementItem | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  const loadAnnouncements = async () => {
    const items = await contentService.getAnnouncements();
    setList(items);
  };

  useEffect(() => {
    loadAnnouncements().catch(() => {
      toast({ title: "Error", description: "Failed to load announcements.", variant: "destructive" });
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: AnnouncementItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      date: item.date,
      category: item.category,
      featured: item.featured,
      summary: item.summary,
      content: item.content,
      image: item.image,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.category) {
      toast({ title: "Error", description: "Title, date, and category are required.", variant: "destructive" });
      return;
    }

    try {
      if (editing) {
        await contentService.updateAnnouncement(editing.id, form);
        toast({ title: "Announcement Updated", description: `"${form.title}" has been updated.` });
      } else {
        await contentService.createAnnouncement(form);
        toast({ title: "Announcement Added", description: `"${form.title}" has been added.` });
      }

      await loadAnnouncements();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save announcement.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteAnnouncement(id);
      await loadAnnouncements();
      toast({ title: "Announcement Deleted", description: "Announcement has been removed." });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete announcement.",
        variant: "destructive",
      });
    }
  };

  const filtered = list.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container space-y-6 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="font-heading text-2xl font-bold text-primary">Announcements Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Announcement</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
              <DialogHeader><DialogTitle>{editing ? "Edit Announcement" : "Add Announcement"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Date</Label><Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></div>
                  <div><Label>Category</Label><Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Health, Governance" /></div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: checked })} />
                  <Label>Featured announcement</Label>
                </div>
                <div><Label>Summary</Label><Textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} rows={2} /></div>
                <div><Label>Full Content</Label><Textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={4} /></div>
                <div><Label>Image URL (optional)</Label><Input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update Announcement" : "Add Announcement"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search announcements..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" />
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[200px] truncate font-medium">{item.title}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell>{item.featured ? <Badge className="border-primary/20 bg-primary/10 text-primary">Featured</Badge> : <span className="text-xs text-muted-foreground">-</span>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No announcements found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ManageAnnouncementsPage;
