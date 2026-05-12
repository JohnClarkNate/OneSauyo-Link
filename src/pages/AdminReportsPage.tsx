import AdminNavbar from "@/components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requestsByCategory, requestsByStatus, monthlySummary } from "@/data/adminMockData";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(260, 60%, 24%)", "hsl(46, 90%, 58%)", "hsl(6, 76%, 36%)", "hsl(200, 60%, 45%)", "hsl(140, 50%, 40%)"];

const AdminReportsPage = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-primary">Reports & Analytics</h1>
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Download", description: "Report download started (mock)." })}>
            <Download className="h-4 w-4" /> Download Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Requests per Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
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
            <CardHeader><CardTitle className="text-base">Status Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={requestsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
                    {requestsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Summary (Last 6 Months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlySummary}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="hsl(260, 60%, 24%)" strokeWidth={2} dot={{ fill: "hsl(46, 90%, 58%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminReportsPage;
