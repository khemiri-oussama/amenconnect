// src/AdminPrivateRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

interface AdminPrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ 
  component: Component, 
  ...rest 
}) => {
  const { isAuthenticated, authLoading } = useAdminAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authLoading) {
          return <div>Loading...</div>;
        }
        
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin/login" />
        );
      }}
    />
  );
};

export default AdminPrivateRoute;