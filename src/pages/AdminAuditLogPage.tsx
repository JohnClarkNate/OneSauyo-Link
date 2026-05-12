import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { auditLogs } from "@/data/adminMockData";
import { Search } from "lucide-react";

const AdminAuditLogPage = () => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = auditLogs.filter((l) => {
    const matchSearch = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || l.dateTime.startsWith(dateFilter);
    return matchSearch && matchDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container py-8 space-y-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Audit Log</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search user or action..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No logs found.</TableCell></TableRow>
                ) : (
                  filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.user}</TableCell>
                      <TableCell>{l.action}</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{l.dateTime}</TableCell>
                      <TableCell><Badge variant="outline">{l.role}</Badge></TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{l.ip}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminAuditLogPage;
