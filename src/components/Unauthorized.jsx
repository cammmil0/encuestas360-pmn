import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../assets/Unauthorized.css';

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requiredRoles, userRole, from } = location.state || {};

  const handleGoBack = () => {
    from ? navigate(-1) : navigate('/');
  };

  return (
    <div className="unauthorized-container">
      <h1>Acceso no autorizado ⚠️</h1>
      <p>No tienes los permisos necesarios para acceder a esta página.</p>
      
      <div className="role-info">
        {requiredRoles && (
          <p>
            <strong>Roles requeridos:</strong> {requiredRoles.join(', ')}
          </p>
        )}
        {userRole && (
          <p>
            <strong>Tu rol:</strong> {userRole}
          </p>
        )}
      </div>
      
      <div className="action-buttons">
        <Button 
          text="Volver atrás" 
          onClick={handleGoBack}
          isSecondary
        />
        <Button 
          text="Ir al inicio" 
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default Unauthorized;