import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "../assets/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const surveys = [
    { id: 1, title: "Satisfacción de clientes", responses: 24 },
    { id: 2, title: "Feedback de producto", responses: 15 },
  ];

  return (
    <div className="dashboard-content">
      <h1>Panel de Administrador</h1>
      <div className="survey-grid">
        {surveys.map((survey) => (
          <Card
            key={survey.id}
            title={survey.title}
            description={`${survey.responses} respuestas`}
            onButtonClick={() => navigate('/admin/analytics')}
            buttonText="Ver detalles"
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;