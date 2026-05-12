import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Index from "./pages/Index";
import CalendarPage from "./pages/CalendarPage";
import EventDetailPage from "./pages/EventDetailPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import OfficialsPage from "./pages/OfficialsPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResidentDashboard from "./pages/ResidentDashboard";
import SubmitRequestPage from "./pages/SubmitRequestPage";
import TrackRequestPage from "./pages/TrackRequestPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import StaffDashboard from "./pages/StaffDashboard";
import StaffRequestsPage from "./pages/StaffRequestsPage";
import StaffResidentsPage from "./pages/StaffResidentsPage";
import AdminDashboard from "./pages/AdminDashboard";
// AdminReportsPage merged into AdminDashboard
import AdminAuditLogPage from "./pages/AdminAuditLogPage";
import AdminSystemPage from "./pages/AdminSystemPage";
import ManageCalendarPage from "./pages/ManageCalendarPage";
import ManageAnnouncementsPage from "./pages/ManageAnnouncementsPage";
import ManageOfficialsPage from "./pages/ManageOfficialsPage";
import ManageHotlinesPage from "./pages/ManageHotlinesPage";
import NotFound from "./pages/NotFound";
import FloatingAboutButton from "./components/FloatingAboutButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/announcements/:id" element={<AnnouncementsPage />} />
            <Route path="/officials" element={<OfficialsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<OfficialsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Resident */}
            <Route path="/resident/dashboard" element={<ProtectedRoute><ResidentDashboard /></ProtectedRoute>} />
            <Route path="/resident/submit-request" element={<ProtectedRoute><SubmitRequestPage /></ProtectedRoute>} />
            <Route path="/resident/track-request" element={<ProtectedRoute><TrackRequestPage /></ProtectedRoute>} />
            <Route path="/resident/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Staff */}
            <Route path="/staff/dashboard" element={<RoleProtectedRoute allowedRoles={["staff", "admin"]}><StaffDashboard /></RoleProtectedRoute>} />
            <Route path="/staff/requests" element={<RoleProtectedRoute allowedRoles={["staff", "admin"]}><StaffRequestsPage /></RoleProtectedRoute>} />
            <Route path="/staff/residents" element={<RoleProtectedRoute allowedRoles={["staff", "admin"]}><StaffResidentsPage /></RoleProtectedRoute>} />
            <Route path="/staff/calendar" element={<RoleProtectedRoute allowedRoles={["staff", "admin"]}><ManageCalendarPage /></RoleProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></RoleProtectedRoute>} />
            <Route path="/admin/announcements" element={<RoleProtectedRoute allowedRoles={["admin"]}><ManageAnnouncementsPage /></RoleProtectedRoute>} />
            <Route path="/admin/calendar" element={<RoleProtectedRoute allowedRoles={["admin"]}><ManageCalendarPage /></RoleProtectedRoute>} />
            <Route path="/admin/officials" element={<RoleProtectedRoute allowedRoles={["admin"]}><ManageOfficialsPage /></RoleProtectedRoute>} />
            <Route path="/admin/hotlines" element={<RoleProtectedRoute allowedRoles={["admin"]}><ManageHotlinesPage /></RoleProtectedRoute>} />
            {/* Reports merged into Dashboard */}
            <Route path="/admin/audit-log" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminAuditLogPage /></RoleProtectedRoute>} />
            <Route path="/admin/system" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminSystemPage /></RoleProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingAboutButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
