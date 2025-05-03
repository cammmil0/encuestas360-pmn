import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../assets/Header.css';

function Header({ title, subtitle }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Escuchar cambios en la autenticación
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Ocurrió un error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        
        <div className="user-info">
          {currentUser && (
            <div className="user-details">
              <span className="user-name">{currentUser.displayName || currentUser.email}</span>
              <span className="user-role">
                {currentUser.email === 'admin@example.com' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          )}
          
          <Button 
            text={isLoading ? "Saliendo..." : "Cerrar sesión"} 
            onClick={handleLogout}
            isSecondary
            small
            disabled={isLoading}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;