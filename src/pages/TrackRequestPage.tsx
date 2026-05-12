import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Loader2, Circle } from "lucide-react";
import type { ServiceRequest } from "@/data/residentMockData";
import ResidentNavbar from "@/components/ResidentNavbar";

const requests: ServiceRequest[] = [];

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Pending: { icon: <Circle className="h-4 w-4" />, color: "bg-muted text-muted-foreground" },
  Processing: { icon: <Loader2 className="h-4 w-4" />, color: "bg-secondary text-secondary-foreground" },
  Received: { icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-primary text-primary-foreground" },
  Resolved: { icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-primary text-primary-foreground" },
};

const TrackRequestPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<ServiceRequest | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const found = requests.find((request) => request.referenceNumber.toLowerCase() === searchTerm.trim().toLowerCase());
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <ResidentNavbar />
      <main className="container py-8 max-w-2xl space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-primary">Track Your Request</CardTitle>
            <CardDescription>Enter your reference number to check the status</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="e.g. REQ-2026-00231"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" /> Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && !result && (
          <Card className="border-destructive/30">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No request found with that reference number.</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-lg">{result.referenceNumber}</CardTitle>
                  <CardDescription>{result.category}</CardDescription>
                </div>
                <Badge className={statusConfig[result.status]?.color}>{result.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{result.description}</p>
              <p className="text-xs text-muted-foreground">Submitted: {result.dateSubmitted}</p>

              <div className="border-t border-border pt-4">
                <h4 className="font-heading text-sm font-semibold mb-4">Status Timeline</h4>
                <div className="space-y-0">
                  {result.timeline.map((entry, index) => {
                    const config = statusConfig[entry.status] || statusConfig.Pending;
                    const isLast = index === result.timeline.length - 1;
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isLast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {config.icon}
                          </div>
                          {!isLast && <div className="w-0.5 h-8 bg-border" />}
                        </div>
                        <div className="pb-6">
                          <p className="font-medium text-sm">{entry.status}</p>
                          <p className="text-xs text-muted-foreground">{entry.date}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{entry.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h3 className="font-heading text-lg font-semibold mb-3">Your Recent Requests</h3>
          {requests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-card-foreground">No requests yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Submit your first request to start tracking it here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <Card
                  key={request.id}
                  className="cursor-pointer hover:shadow-card-hover transition-shadow"
                  onClick={() => { setSearchTerm(request.referenceNumber); setResult(request); setSearched(true); }}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-sm">{request.referenceNumber}</p>
                      <p className="text-xs text-muted-foreground">{request.category} · {request.dateSubmitted}</p>
                    </div>
                    <Badge className={statusConfig[request.status]?.color}>{request.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrackRequestPage;
