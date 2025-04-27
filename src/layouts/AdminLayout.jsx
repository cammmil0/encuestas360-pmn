import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../layouts/AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="admin-container">
      {/* Sidebar clásico */}
      <div className="admin-sidebar">
        <h2>ENCUESTAS360</h2>
        <nav>
          <ul>
            <li>
              <button 
                className={`sidebar-button ${isActive('surveys') ? 'active' : ''}`}
                onClick={() => navigate("/admin/surveys")}
              >
                Encuestas
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${isActive('clients') ? 'active' : ''}`}
                onClick={() => navigate("/admin/clients")}
              >
                Clientes
              </button>
            </li>
            <li>
              <button
                className={`sidebar-button ${isActive('analytics') ? 'active' : ''}`}
                onClick={() => navigate("/admin/analytics")}
              >
                Analíticas
              </button>
            </li>
          </ul>
        </nav>
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;