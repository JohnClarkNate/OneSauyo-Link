import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavbar from "@/components/AdminNavbar";
import StaffNavbar from "@/components/StaffNavbar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { contentService } from "@/services/contentService";
import type { EventItem } from "@/types/content";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = { title: "", date: "", time: "", location: "", organizer: "", description: "", category: "" };

const ManageCalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const Navbar = user?.role === "admin" ? AdminNavbar : StaffNavbar;

  const loadEvents = async () => {
    const items = await contentService.getEvents();
    setEventList(items);
  };

  useEffect(() => {
    loadEvents().catch(() => {
      toast({ title: "Error", description: "Failed to load events.", variant: "destructive" });
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setEditing(event);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      description: event.description,
      category: event.category,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) {
      toast({ title: "Error", description: "Title and date are required.", variant: "destructive" });
      return;
    }

    try {
      if (editing) {
        await contentService.updateEvent(editing.id, form);
        toast({ title: "Event Updated", description: `"${form.title}" has been updated.` });
      } else {
        await contentService.createEvent(form);
        toast({ title: "Event Added", description: `"${form.title}" has been added.` });
      }

      await loadEvents();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save event.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteEvent(id);
      await loadEvents();
      toast({ title: "Event Deleted", description: "Event has been removed." });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container space-y-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-primary">Calendar Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Date</Label><Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></div>
                  <div><Label>Time</Label><Input value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} placeholder="e.g. 8:00 AM - 5:00 PM" /></div>
                </div>
                <div><Label>Location</Label><Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></div>
                <div><Label>Organizer</Label><Input value={form.organizer} onChange={(event) => setForm({ ...form, organizer: event.target.value })} /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></div>
                <div><Label>Description</Label><Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update Event" : "Add Event"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventList.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(event)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ManageCalendarPage;
