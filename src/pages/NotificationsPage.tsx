import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/data/residentMockData";
import { Bell, Check } from "lucide-react";
import ResidentNavbar from "@/components/ResidentNavbar";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="min-h-screen bg-background">
      <ResidentNavbar />
      <main className="container py-8 max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <Check className="h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-card-foreground">No notifications yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">Account updates and request alerts will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`transition-shadow ${!notification.read ? "border-primary/30 shadow-card" : "opacity-80"}`}>
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                    <Bell className={`h-4 w-4 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>{notification.title}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="mt-1.5 h-7 text-xs text-primary px-2">
                        Mark as read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
