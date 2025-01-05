import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../_auth/AuthContext.tsx";
import { HomeRoute, LoginRoute } from "../_constants/routes.constants.ts";

type AuthorizedRoute = {
  children: ReactNode;
  requiredRoles: string[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
}: AuthorizedRoute) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated)
    return <Navigate to={LoginRoute} replace />;

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => role === userRole);
    if (!hasRequiredRole)
      return <Navigate to={HomeRoute} replace />;
  }

  return <>{children}</>;
};
