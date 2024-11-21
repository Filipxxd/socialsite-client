import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./Routes";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

type CustomRouterProviderProps = {
  children: ReactNode;
}

export const RouteProvider: React.FC<CustomRouterProviderProps> = ({ children}) => {
  return (
    <BrowserRouter>
      {children}
      <Routes>
        {ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.requiresAuth ? (
                <ProtectedRoute requiredRoles={route.requiredRoles}>
                  {route.component}
                </ProtectedRoute>
              ) : (
                route.component
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
