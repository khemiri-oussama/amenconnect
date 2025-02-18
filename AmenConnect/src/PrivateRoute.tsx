// PrivateRoute.tsx
import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { useAuth } from "./AuthContext";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isAuthenticated,
  ...rest
}) => {
  const { pendingUser, authLoading } = useAuth();

  if (authLoading) {
    // While authentication is loading, show a loading spinner or placeholder.
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authLoading) return <div>Loading...</div>;
  
        if (!isAuthenticated && !pendingUser) {
          return <Redirect to="/login" />;
        }
  
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
