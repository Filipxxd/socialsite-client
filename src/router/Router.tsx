import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./Routes";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

type CustomRouterProviderProps = {
  children: ReactNode;
}

export const RouteProvider: React.FC<CustomRouterProviderProps> = ({ children}) => {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      {children}
      <Routes>
        {ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.requiredRoles.length != 0 ? (
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
