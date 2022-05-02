import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../App';

const PublicWrapper = () => {
  const currentUser = useContext(UserContext);

  return !currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default PublicWrapper;
