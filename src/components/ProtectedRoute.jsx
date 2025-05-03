import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthStatus('unauthenticated');
        navigate('/', { 
          state: { 
            from: location.pathname,
            message: 'Por favor inicia sesión para continuar' 
          } 
        });
        return;
      }

      try {
        // Verificar rol del usuario en Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          await auth.signOut();
          setAuthStatus('unauthenticated');
          navigate('/', { 
            state: { 
              error: 'Tu cuenta no está configurada correctamente' 
            } 
          });
          return;
        }

        const userData = userDoc.data();
        setUserRole(userData.role);

        // Verificar si el rol está autorizado
        if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
          setAuthStatus('unauthorized');
          navigate('/unauthorized', { 
            state: { 
              requiredRoles: allowedRoles,
              userRole: userData.role,
              from: location.pathname
            } 
          });
          return;
        }

        setAuthStatus('authenticated');
      } catch (error) {
        console.error('Error de autenticación:', error);
        setAuthStatus('unauthenticated');
        navigate('/', { 
          state: { 
            error: 'Error al verificar tu autenticación' 
          } 
        });
      }
    });

    return () => unsubscribe();
  }, [navigate, location, allowedRoles]);

  if (authStatus === 'checking') {
    return <LoadingSpinner fullPage />;
  }

  if (authStatus === 'authenticated') {
    return children;
  }

  return null;
};

export default ProtectedRoute;