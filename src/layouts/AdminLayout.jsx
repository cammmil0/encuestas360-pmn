import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import "../layouts/AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Si no hay usuario autenticado, redirigir al login
        navigate("/", { 
          state: { 
            from: location.pathname,
            message: "Sesión expirada" 
          },
          replace: true // Evita que pueda volver atrás
        });
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirigir al login con replace: true para evitar navegación atrás
      navigate("/", { 
        state: { message: "Sesión cerrada correctamente" },
        replace: true 
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/", { 
        state: { error: "Error al cerrar sesión" },
        replace: true
      });
    }
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