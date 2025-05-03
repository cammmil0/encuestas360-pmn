import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import Button from '../components/Button';
import '../assets/Login.css';

function Login() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Redirigir según el rol (puedes almacenar el rol en Firestore)
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/encuestas');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register', { state: { isClient: true } });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">ENCUESTAS<span className="title-highlight">360</span></h1>
        <p className="login-subtitle">Plataforma de feedback para clientes</p>
        
        {error && (
          <div className="login-message error">
            {error}
          </div>
        )}

        {/* Selector de rol */}
        <div className="role-toggle">
          <button
            type="button"
            className={`toggle-option ${isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(true)}
            disabled={isLoading}
          >
            Administrador
          </button>
          <button
            type="button"
            className={`toggle-option ${!isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(false)}
            disabled={isLoading}
          >
            Cliente
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder={isAdmin ? "admin@empresa.com" : "cliente@empresa.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button 
            text={isLoading ? "Cargando..." : (isAdmin ? "Ingresar como Admin" : "Ingresar como Cliente")} 
            type="submit" 
            isPrimary 
            fullWidth 
            disabled={isLoading}
          />
          
          {/* Sección de registro solo para clientes */}
          {!isAdmin && (
            <div className="register-section">
              <p className="register-text">¿No tienes una cuenta?</p>
              <Button 
                text="Registrarse" 
                onClick={handleRegister}
                isSecondary
                fullWidth
                disabled={isLoading}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;