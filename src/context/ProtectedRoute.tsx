import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optionally show a loading indicator while the auth state is being determined
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
