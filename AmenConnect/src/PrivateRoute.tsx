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
        // For the OTP page, allow access if pendingUser exists.
        if (props.location.pathname === "/otp" && !pendingUser) {
          return <Redirect to="/login" />;
        }
        return isAuthenticated || pendingUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
