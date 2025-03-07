// src/AdminPrivateRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface AdminPrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
}

const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin/login" />
        )
      }
    />
  );
};

export default AdminPrivateRoute;
