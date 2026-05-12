import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default RoleProtectedRoute;
