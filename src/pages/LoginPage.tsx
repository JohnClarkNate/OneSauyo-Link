import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
const barangayLogo = "/favicon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <img src={barangayLogo} alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <CardTitle className="font-heading text-2xl text-primary">e-Barangay Login</CardTitle>
          <CardDescription>Sign in to access portal services</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input 
                id="email" 
                type="text"
                placeholder="Enter your email or username" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Login
                </>
              )}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              <Link to="/register" className="text-primary hover:underline">Register</Link>
            </div>
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to public site</Link>
            </div>
          </form>
          <div className="mt-4 rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Test Credentials (after registration):</p>
            <p>Create an account to test the login feature.</p>
            <p className="text-xs mt-2">Backend powered by PHP + MySQL</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
