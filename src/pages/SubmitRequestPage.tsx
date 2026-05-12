import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, CheckCircle2, Send } from "lucide-react";
import ResidentNavbar from "@/components/ResidentNavbar";

const categories = ["Document Request", "Peace & Order", "Sanitation", "Infrastructure", "Others"];

const documentRequestTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "First-Time Jobseeker",
  "Business Clearance",
  "Installation Endorsement"
];

const complaintTypes = [
  "Public Nuisance",
  "Neighbor Dispute",
  "VAWC Case",
  "Animal Nuisance",
  "Mediation Failure"
];

const documentRequirements: Record<string, { fields: string[]; requirements: string }> = {
  "Barangay Clearance": {
    fields: ["fullName", "idType", "cedula"],
    requirements: "Valid ID (QC ID preferred), Latest Cedula, and Application Form. Price: P50-P100"
  },
  "Certificate of Residency": {
    fields: ["fullName", "address", "utilityBill"],
    requirements: "Valid ID and utility bill (Meralco/Maynilad) under your name/address. Price: P30-P50"
  },
  "Certificate of Indigency": {
    fields: ["fullName", "referralSource"],
    requirements: "Valid ID and a referral or interview with Social Services/VAWC desk. Free"
  },
  "First-Time Jobseeker": {
    fields: ["fullName", "schoolId", "oathUndertaking"],
    requirements: "Valid School ID/Diploma and signed Oath of Undertaking. Free"
  },
  "Business Clearance": {
    fields: ["businessName", "dtiReg", "leaseContract", "businessLocation"],
    requirements: "DTI/SEC Reg., Lease Contract (if renting), and Sketch of Business Location. Price: P200-P500+"
  },
  "Installation Endorsement": {
    fields: ["propertyType", "propertyTitle", "letterOfIntent"],
    requirements: "Property Title/Tax Declaration and Letter of Intent. Price: P100-P200"
  }
};

const complaintRequirements: Record<string, { fields: string[]; requirements: string }> = {
  "Public Nuisance": {
    fields: ["respondentName", "incidentAddress", "description"],
    requirements: "Name of respondent, Address of incident, and Video/Photo evidence. Free"
  },
  "Neighbor Dispute": {
    fields: ["narrativeDetails", "description"],
    requirements: "Narrative of incident and presence of complainant. Free"
  },
  "VAWC Case": {
    fields: ["description", "perpetratorInfo"],
    requirements: "Personal appearance at VAWC desk; identification of perpetrator. Free"
  },
  "Animal Nuisance": {
    fields: ["ownerAddress", "disturbanceDetails", "description"],
    requirements: "Address of owner and details of disturbance. Free"
  },
  "Mediation Failure": {
    fields: ["description", "mediationSessions"],
    requirements: "Attendance in at least 3 failed mediation sessions. Price: P100-P150"
  }
};

const SubmitRequestPage = () => {
  const [category, setCategory] = useState("");
  const [requestType, setRequestType] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setRequestType("");
    setComplaintType("");
    setFormData({});
    setFile(null);
    setErrors({});
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getRequiredFields = () => {
    if (category === "Document Request" && requestType) {
      return documentRequirements[requestType].fields;
    }
    if (category === "Peace & Order" && complaintType) {
      return complaintRequirements[complaintType].fields;
    }
    return [];
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!category) errs.category = "Required";
    if (category === "Document Request" && !requestType) errs.requestType = "Required";
    if (category === "Peace & Order" && !complaintType) errs.complaintType = "Required";

    const requiredFields = getRequiredFields();
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errs[field] = "Required";
      }
    });

    if (category === "Document Request" && !file) {
      errs.file = "Document/Photo is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const ref = `REQ-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
    setRefNumber(ref);
    setShowModal(true);
  };

  const handleReset = () => {
    setCategory("");
    setRequestType("");
    setComplaintType("");
    setFormData({});
    setFile(null);
    setErrors({});
    setShowModal(false);
  };

  const renderFieldInput = (field: string, label: string) => (
    <div key={field}>
      <Label>{label}</Label>
      <Input
        value={formData[field] || ""}
        onChange={(e) => handleFormDataChange(field, e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className={errors[field] ? "border-destructive" : ""}
      />
      {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]}</p>}
    </div>
  );

  const fieldLabels: Record<string, string> = {
    fullName: "Full Name",
    idType: "ID Type",
    cedula: "Cedula Number",
    address: "Address",
    utilityBill: "Utility Bill Account Number",
    referralSource: "Referral Source",
    schoolId: "School ID/Diploma Number",
    oathUndertaking: "Oath of Undertaking Details",
    businessName: "Business Name",
    dtiReg: "DTI/SEC Registration Number",
    leaseContract: "Lease Contract Details",
    businessLocation: "Business Location",
    propertyType: "Property Type",
    propertyTitle: "Property Title/Tax Declaration Number",
    letterOfIntent: "Letter of Intent Details",
    respondentName: "Respondent Name",
    incidentAddress: "Incident Address",
    narrativeDetails: "Narrative Details",
    perpetratorInfo: "Perpetrator Information",
    ownerAddress: "Owner Address",
    disturbanceDetails: "Disturbance Details",
    mediationSessions: "Mediation Sessions Attended",
  };

  return (
    <div className="min-h-screen bg-background">
      <ResidentNavbar />
      <main className="container py-8 max-w-2xl">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-primary">Submit a Request</CardTitle>
            <CardDescription>File a service request, complaint, or document request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selection */}
              <div>
                <Label>Category *</Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
              </div>

              {/* Document Request Type Selection */}
              {category === "Document Request" && (
                <div>
                  <Label>Request Type *</Label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentRequestTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.requestType && <p className="text-xs text-destructive mt-1">{errors.requestType}</p>}
                  {requestType && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Requirements: {documentRequirements[requestType].requirements}
                    </p>
                  )}
                </div>
              )}

              {/* Peace & Order Complaint Type Selection */}
              {category === "Peace & Order" && (
                <div>
                  <Label>Complaint Type *</Label>
                  <Select value={complaintType} onValueChange={setComplaintType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.complaintType && <p className="text-xs text-destructive mt-1">{errors.complaintType}</p>}
                  {complaintType && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Requirements: {complaintRequirements[complaintType].requirements}
                    </p>
                  )}
                </div>
              )}

              {/* Dynamic Form Fields */}
              {category === "Document Request" && requestType && (
                <>
                  {documentRequirements[requestType].fields.map((field) =>
                    renderFieldInput(field, fieldLabels[field] || field)
                  )}
                </>
              )}

              {category === "Peace & Order" && complaintType && (
                <>
                  {complaintRequirements[complaintType].fields.map((field) => {
                    if (field === "description") {
                      return (
                        <div key={field}>
                          <Label>{fieldLabels[field] || "Description"}</Label>
                          <Textarea
                            value={formData[field] || ""}
                            onChange={(e) => handleFormDataChange(field, e.target.value)}
                            rows={4}
                            placeholder="Describe your complaint in detail..."
                            className={errors[field] ? "border-destructive" : ""}
                          />
                          {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]}</p>}
                        </div>
                      );
                    }
                    return renderFieldInput(field, fieldLabels[field] || field);
                  })}
                </>
              )}

              {/* Sanitation, Infrastructure, Others - Simple Form */}
              {(category === "Sanitation" || category === "Infrastructure" || category === "Others") && (
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData["description"] || ""}
                    onChange={(e) => handleFormDataChange("description", e.target.value)}
                    rows={4}
                    placeholder="Describe your request in detail..."
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                </div>
              )}

              {/* File Upload - Required for Document Request, Optional for others */}
              {(category === "Document Request" || category === "Peace & Order" || category === "Sanitation" || category === "Infrastructure" || category === "Others") && (
                <div>
                  <Label>
                    Upload Photo/Document {category === "Document Request" ? "*" : "(Optional)"}
                  </Label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate text-muted-foreground">
                      {file ? file.name : "Choose file"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {errors.file && <p className="text-xs text-destructive mt-1">{errors.file}</p>}
                </div>
              )}

              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" /> Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <div className="flex justify-center mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center font-heading">Request Submitted!</DialogTitle>
              <DialogDescription className="text-center">
                Your request has been received. Please save your reference number.
              </DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground">Reference Number</p>
                <p className="font-heading text-2xl font-bold text-primary">{refNumber}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You can track your request using this reference number.
              </p>
              <Button onClick={handleReset} className="w-full">
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default SubmitRequestPage;