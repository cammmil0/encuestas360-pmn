import Button from './Button';
import '../assets/Header.css';

function Header({ title, subtitle, onLogout }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <Button 
        text="Cerrar sesión" 
        onClick={onLogout}
        isSecondary
        small
      />
    </header>
  );
}

export default Header;