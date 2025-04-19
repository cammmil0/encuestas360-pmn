import { useNavigate } from "react-router-dom";
import Card from "../components/Card"; // Componente reutilizable
import Button from "../components/Button"; // Componente reutilizable
import "../assets/Dashboard.css"; // Estilos específicos (opcional)

function Dashboard() {
  const navigate = useNavigate();

  // Datos de ejemplo para encuestas
  const surveys = [
    { id: 1, title: "Satisfacción de clientes", responses: 24 },
    { id: 2, title: "Feedback de producto", responses: 15 },
  ];

  // Función para cerrar sesión (simulada)
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>ENCUESTAS360</h2>
        <nav>
          <ul>
            <li>
              <Button
                text="Encuestas"
                onClick={() => alert("Navegaría a encuestas")}
              />
            </li>
            <li>
              <Button
                text="Clientes"
                onClick={() => alert("Navegaría a clientes")}
              />
            </li>
            <li>
              <Button
                text="Analíticas"
                onClick={() => alert("Navegaría a gráficos")}
              />
            </li>
          </ul>
        </nav>
        <Button text="Cerrar sesión" onClick={handleLogout} isSecondary />
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <h1>Panel de Administrador</h1>
        <div className="survey-grid">
          {surveys.map((survey) => (
            <Card
              key={survey.id}
              title={survey.title}
              description={`${survey.responses} respuestas`}
              onButtonClick={() => alert(`Ver detalles de ${survey.title}`)}
              buttonText="Ver detalles"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
