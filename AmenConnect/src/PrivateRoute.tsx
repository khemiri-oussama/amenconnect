// PrivateRoute.tsx
import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { useAuth } from "./AuthContext";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, pendingUser, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated && !pendingUser) {
          console.log("Redirecting to login");
          return <Redirect to="/login" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
