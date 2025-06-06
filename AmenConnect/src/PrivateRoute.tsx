// PrivateRoute.tsx
import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingProgressBar from "./components/LoadingProgressBar";
interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, profile, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingProgressBar />;
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

