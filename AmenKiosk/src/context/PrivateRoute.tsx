// PrivateRoute.tsx
import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, profile, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated || profile ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
