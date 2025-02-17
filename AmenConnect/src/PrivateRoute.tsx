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
  const { pendingUser } = useAuth();  // Access pendingUser from context

  return (
    <Route
      {...rest}
      render={(props) => {
        // Allow access to /otp route when pendingUser exists, else check for authentication
        if (props.location.pathname === '/otp' && !pendingUser) {
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
