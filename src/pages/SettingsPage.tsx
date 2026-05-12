import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Eye, Trash2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    requestUpdates: true,
    announcements: true,
    events: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEmail: false,
  });

  if (!user) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Password updated", description: "Your password has been changed (mock)." });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Preferences saved", description: "Notification preferences updated (mock)." });
  };

  const handleSavePrivacy = () => {
    toast({ title: "Privacy settings saved", description: "Your privacy settings have been updated (mock)." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8 md:py-12 max-w-3xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">Settings</h1>

        {/* Change Password */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" size="sm">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" /> Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "email" as const, label: "Email Notifications", desc: "Receive updates via email" },
              { key: "sms" as const, label: "SMS Notifications", desc: "Receive updates via text message" },
              { key: "requestUpdates" as const, label: "Request Updates", desc: "Notifications when your requests are updated" },
              { key: "announcements" as const, label: "Announcements", desc: "Barangay announcements and news" },
              { key: "events" as const, label: "Event Reminders", desc: "Upcoming community events" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                />
              </div>
            ))}
            <Separator />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSaveNotifications}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" /> Privacy
            </CardTitle>
            <CardDescription>Control your profile visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Show Profile Publicly</p>
                <p className="text-xs text-muted-foreground">Allow other residents to see your profile</p>
              </div>
              <Switch checked={privacy.showProfile} onCheckedChange={(v) => setPrivacy({ ...privacy, showProfile: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Show Email Address</p>
                <p className="text-xs text-muted-foreground">Display email on your public profile</p>
              </div>
              <Switch checked={privacy.showEmail} onCheckedChange={(v) => setPrivacy({ ...privacy, showEmail: v })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSavePrivacy}>Save Privacy Settings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add extra security to your account</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming soon", description: "2FA setup is not yet available." })}>
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Manage your logged-in devices</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "1 active session", description: "Current browser session." })}>
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm" onClick={() => toast({ title: "Not available", description: "Account deletion is disabled in mock mode." })}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
