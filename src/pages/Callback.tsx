import { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/Auth';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const navigate = useNavigate();
  const { setToken, setIsAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  }, []);

  return <div>Callback</div>;
}
