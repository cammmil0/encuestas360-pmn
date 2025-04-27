import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyCard from '../components/SurveyCard';
import Header from '../components/Header';
import '../assets/UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: "Satisfacción del Servicio",
      description: "Danos tu opinión sobre atención reciente",
      deadline: "30 Mayo 2025",
      completed: false,
      category: "Servicio al cliente"
    },
    {
      id: 2,
      title: "Preferencias de Producto",
      description: "¿Qué características valoras más en nuestros productos?",
      deadline: "15 Junio 2025",
      completed: true,
      category: "Desarrollo de producto"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSurveyId, setCurrentSurveyId] = useState(null);
  const [responses, setResponses] = useState(['', '', '']);

  const handleStartSurvey = (id) => {
    setCurrentSurveyId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResponses(['', '', '']); // Reset responses when modal is closed
  };

  const handleSubmitSurvey = () => {
    alert('¡Encuesta enviada!');

    // Marcar encuesta como completada
    setSurveys(surveys.map(survey => 
      survey.id === currentSurveyId ? { ...survey, completed: true } : survey
    ));

    setIsModalOpen(false); // Close modal after submitting
    navigate(`/user/encuestas`); // Navigate to specific survey page
  };

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      <Header 
        title="Mis Encuestas"
        subtitle="Responde y ayuda a mejorar nuestros servicios"
        onLogout={handleLogout}
      />

      <div className="survey-grid">
        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            onStart={() => handleStartSurvey(survey.id)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Comienza la Encuesta</h3>
            <div>
              <label>Pregunta 1:</label>
              <input
                type="text"
                value={responses[0]}
                onChange={(e) => handleResponseChange(0, e.target.value)}
                placeholder="Escribe tu respuesta aquí"
              />
            </div>
            <div>
              <label>Pregunta 2:</label>
              <input
                type="text"
                value={responses[1]}
                onChange={(e) => handleResponseChange(1, e.target.value)}
                placeholder="Escribe tu respuesta aquí"
              />
            </div>
            <div>
              <label>Pregunta 3:</label>
              <input
                type="text"
                value={responses[2]}
                onChange={(e) => handleResponseChange(2, e.target.value)}
                placeholder="Escribe tu respuesta aquí"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSubmitSurvey}>Enviar</button>
              <button onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
