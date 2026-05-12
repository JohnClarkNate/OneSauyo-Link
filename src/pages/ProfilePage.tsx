import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MapPin, Calendar, CreditCard, Save, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    middleName: user?.middleName ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    gender: user?.gender ?? "",
    birthDate: user?.birthDate ?? "",
  });

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile updated", description: "Your changes have been saved (mock)." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8 md:py-12 max-w-3xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">My Profile</h1>

        {/* Profile header */}
        <Card className="mb-6">
          <CardContent className="flex flex-col sm:flex-row items-center gap-5 pt-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-card-foreground">
                {user.firstName} {user.middleName} {user.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                {user.registeredVoter && <Badge variant="outline">Registered Voter</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IDs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" /> Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Resident ID</p>
              <p className="font-medium text-card-foreground">{user.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Barangay ID</p>
              <p className="font-medium text-card-foreground">{user.barangayId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Username</p>
              <p className="font-medium text-card-foreground">{user.username}</p>
            </div>
          </CardContent>
        </Card>

        {/* Editable info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" /> Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.firstName} disabled={!editing} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.lastName} disabled={!editing} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" value={form.middleName} disabled={!editing} onChange={(e) => setForm({ ...form, middleName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={form.gender} disabled={!editing} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birthDate" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Birth Date
                </Label>
                <Input id="birthDate" type="date" value={form.birthDate} disabled={!editing} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
                </Label>
                <Input id="email" type="email" value={form.email} disabled={!editing} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="address" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Address
                </Label>
                <Input id="address" value={form.address} disabled={!editing} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            {editing && (
              <>
                <Separator className="my-5" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} className="gap-1.5">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
