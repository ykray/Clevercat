import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../App';

const PrivateWrapper = () => {
  const currentUser = useContext(UserContext);

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateWrapper;
