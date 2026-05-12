import AdminNavbar from "@/components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { adminStats, requestsByCategory, requestsByStatus, requestsByCommittee, recentActivityLogs, monthlySummary } from "@/data/adminMockData";
import { Users, FileText, Clock, CheckCircle2, AlertCircle, UserCheck, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(260, 60%, 24%)", "hsl(46, 90%, 58%)", "hsl(6, 76%, 36%)", "hsl(200, 60%, 45%)", "hsl(140, 50%, 40%)", "hsl(280, 50%, 50%)"];

const AdminDashboard = () => {
  const { toast } = useToast();

  const stats = [
    { label: "Total Users", value: adminStats.totalUsers, icon: Users, color: "text-primary" },
    { label: "Total Requests", value: adminStats.totalRequests, icon: FileText, color: "text-blue-600" },
    { label: "Pending", value: adminStats.pendingRequests, icon: AlertCircle, color: "text-amber-600" },
    { label: "Processing", value: adminStats.processingRequests, icon: Clock, color: "text-blue-600" },
    { label: "Resolved", value: adminStats.resolvedRequests, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Active Staff", value: adminStats.activeStaff, icon: UserCheck, color: "text-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-primary">Admin Dashboard</h1>
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Download", description: "Report download started (mock)." })}>
            <Download className="h-4 w-4" /> Download Report
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <s.icon className={`h-6 w-6 mx-auto mb-1 ${s.color}`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Requests by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={requestsByCategory}>
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(260, 60%, 24%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Requests by Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={requestsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                    {requestsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Trend (Last 6 Months)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlySummary}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="hsl(260, 60%, 24%)" strokeWidth={2} dot={{ fill: "hsl(46, 90%, 58%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Requests by Committee</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={requestsByCommittee} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="committee" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(46, 90%, 58%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivityLogs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.user}</TableCell>
                    <TableCell>{l.action}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{l.dateTime}</TableCell>
                    <TableCell><Badge variant="outline">{l.role}</Badge></TableCell>
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

export default AdminDashboard;
