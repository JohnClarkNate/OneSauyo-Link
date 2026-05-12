export interface ManagedUser {
  id: string;
  userId: number;
  name: string;
  email: string;
  role: "Resident" | "Staff" | "Admin";
  status: "Active" | "Inactive";
  verified: boolean;
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  gender?: string;
  birthDate?: string;
  age?: number | null;
  registeredVoter?: boolean;
  barangayId?: string;
  validIdPhoto?: string;
  schoolIdPhoto?: string;
}
