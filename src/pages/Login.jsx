import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../assets/Login.css'; // Reutiliza los estilos anteriores + los nuevos para el toggle

function Login() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true); // true = Admin, false = Cliente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula redirección por rol (sin backend)
    if (isAdmin) {
      navigate('/admin/dashboard'); // Ruta para admin
    } else {
      navigate('/user/encuestas') // Ruta para cliente
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">ENCUESTAS<span className="title-highlight">360</span></h1>
        <p className="login-subtitle">Plataforma de feedback para clientes</p>

        {/* Toggle Admin/Cliente */}
        <div className="role-toggle">
          <button
            className={`toggle-option ${isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(true)}
          >
            Administrador
          </button>
          <button
            className={`toggle-option ${!isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(false)}
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
            />
          </div>

          <Button 
            text={isAdmin ? "Ingresar como Admin" : "Ingresar como Cliente"} 
            type="submit" 
            isPrimary 
            fullWidth 
          />
        </form>
      </div>
    </div>
  );
}

export default Login;