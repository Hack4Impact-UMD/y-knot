import React from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../components/LoadingScreen/Loading';
import { AuthProvider, useAuth } from './AuthProvider';

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return <Loading />;
  } else if (!authContext.user) {
    return <Navigate to="/login" />;
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAuth;
