import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type RegisterPayload } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Loader2, AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const barangayLogo = "/favicon.png";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const isLeapYear = (year: number) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
const getDaysInMonth = (year: number, month: number) => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};

const yearOptions = Array.from(
  { length: new Date().getFullYear() - 1919 },
  (_, index) => new Date().getFullYear() - index
);

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return score;
};

const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const strengthColors = ["bg-destructive", "bg-accent", "bg-secondary", "bg-primary", "bg-primary"];

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

const differenceInYears = (date1: Date, date2: Date): number => {
  const diff = date1.getFullYear() - date2.getFullYear();
  const month = date1.getMonth() - date2.getMonth();
  if (month < 0 || (month === 0 && date1.getDate() < date2.getDate())) {
    return diff - 1;
  }
  return diff;
};

const RegisterPage = () => {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "",
    address: "",
    registeredVoter: false,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    validIdPhoto: null as File | null,
    schoolIdPhoto: null as File | null,
  });
  
  const [birthYear, setBirthYear] = useState<number | "">("");
  const [birthMonth, setBirthMonth] = useState<number | "">("");
  const [birthDay, setBirthDay] = useState<number | "">("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const birthDate = useMemo(() => {
    if (!birthYear || !birthMonth || !birthDay) {
      return undefined;
    }
    const date = new Date(birthYear, birthMonth - 1, birthDay);
    return date.getFullYear() === birthYear && date.getMonth() === birthMonth - 1 && date.getDate() === birthDay
      ? date
      : undefined;
  }, [birthYear, birthMonth, birthDay]);

  const age = useMemo(() => (birthDate ? differenceInYears(new Date(), birthDate) : null), [birthDate]);
  const daysInMonth = birthYear && birthMonth ? getDaysInMonth(birthYear, birthMonth) : 31;
  const pwStrength = getPasswordStrength(form.password);

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.gender.trim()) e.gender = "Gender is required";
    if (!birthYear || !birthMonth || !birthDay) e.birthDate = "Birth date is required";
    else if (!birthDate) e.birthDate = "Invalid birth date";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email";
    }
    if (!form.validIdPhoto) e.validIdPhoto = "Valid ID photo is required";

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }
    
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let payload: RegisterPayload;
    try {
      const birthDateStr = birthDate 
        ? `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`
        : "";

      payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim(),
        gender: form.gender.trim(),
        birthDate: birthDateStr,
        age: age || 0,
        address: form.address.trim(),
        registeredVoter: form.registeredVoter,
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        validIdPhoto: await readFileAsDataUrl(form.validIdPhoto as File),
        schoolIdPhoto: form.schoolIdPhoto ? await readFileAsDataUrl(form.schoolIdPhoto) : "",
        role: "resident",
      };
    } catch (err) {
      setErrors((current) => ({
        ...current,
        validIdPhoto: err instanceof Error ? err.message : "Failed to process upload.",
      }));
      return;
    }

    const success = await register(payload);
    if (success) {
      navigate("/resident/dashboard");
    }
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <img src={barangayLogo} alt="Logo" className="h-14 w-14 object-contain" />
          </div>
          <CardTitle className="font-heading text-2xl text-primary">Resident Registration</CardTitle>
          <CardDescription>Create your e-Barangay account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Last Name *</Label>
                <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} disabled={loading} />
                <FieldError field="lastName" />
              </div>
              <div>
                <Label>First Name *</Label>
                <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} disabled={loading} />
                <FieldError field="firstName" />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input value={form.middleName} onChange={(e) => update("middleName", e.target.value)} disabled={loading} />
              </div>
            </div>

            {/* Gender + Birth Date + Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => update("gender", v)} disabled={loading}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError field="gender" />
              </div>
              <div>
                <Label>Birth Date *</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={birthYear ? String(birthYear) : ""} onValueChange={(val) => setBirthYear(val ? Number(val) : "")}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={birthMonth ? String(birthMonth) : ""} 
                    onValueChange={(val) => {
                      const monthValue = val ? Number(val) : "";
                      setBirthMonth(monthValue);
                      if (birthDay && monthValue && birthYear) {
                        const maxDays = getDaysInMonth(birthYear, monthValue);
                        if (birthDay > maxDays) {
                          setBirthDay("");
                        }
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>
                      {monthNames.map((name, index) => (
                        <SelectItem key={name} value={String(index + 1)}>{name.slice(0, 3)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={birthDay ? String(birthDay) : ""} onValueChange={(val) => setBirthDay(val ? Number(val) : "")}>
                    <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => (
                        <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FieldError field="birthDate" />
              </div>
              <div>
                <Label>Age</Label>
                <Input value={age !== null ? String(age) : ""} readOnly className="bg-muted" placeholder="Auto" disabled />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>Address *</Label>
              <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} disabled={loading} />
              <FieldError field="address" />
            </div>

            {/* Registered Voter */}
            <div className="flex items-center gap-3">
              <Switch 
                checked={form.registeredVoter} 
                onCheckedChange={(checked) => setForm((p) => ({ ...p, registeredVoter: checked }))}
                disabled={loading}
              />
              <Label>Registered Voter</Label>
            </div>

            {/* Username */}
            <div>
              <Label>Username *</Label>
              <Input 
                placeholder="Choose a username"
                value={form.username} 
                onChange={(e) => update("username", e.target.value)} 
                disabled={loading}
              />
              <FieldError field="username" />
            </div>

            {/* Email */}
            <div>
              <Label>Email *</Label>
              <Input 
                type="email"
                placeholder="Enter your email address"
                value={form.email} 
                onChange={(e) => update("email", e.target.value)} 
                disabled={loading}
              />
              <FieldError field="email" />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Password *</Label>
                <Input 
                  type="password" 
                  placeholder="Enter your password"
                  value={form.password} 
                  onChange={(e) => update("password", e.target.value)} 
                  disabled={loading}
                />
                {form.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">Strength:</span>
                      <span className="text-xs">{strengthLabels[pwStrength]}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${strengthColors[pwStrength]}`}
                        style={{ width: `${((pwStrength + 1) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <FieldError field="password" />
              </div>
              <div>
                <Label>Confirm Password *</Label>
                <Input 
                  type="password" 
                  placeholder="Confirm your password"
                  value={form.confirmPassword} 
                  onChange={(e) => update("confirmPassword", e.target.value)} 
                  disabled={loading}
                />
                <FieldError field="confirmPassword" />
              </div>
            </div>

            {/* File uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Upload Valid ID *</Label>
                <label className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">{form.validIdPhoto ? form.validIdPhoto.name : "Choose file"}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={(e) => setForm((p) => ({ ...p, validIdPhoto: e.target.files?.[0] ?? null }))}
                    disabled={loading}
                  />
                </label>
                <FieldError field="validIdPhoto" />
              </div>
              <div>
                <Label>Upload School ID (Optional)</Label>
                <label className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">{form.schoolIdPhoto ? form.schoolIdPhoto.name : "Choose file"}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={(e) => setForm((p) => ({ ...p, schoolIdPhoto: e.target.files?.[0] ?? null }))}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Create Account
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Login</Link>
            </p>
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to public site</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
