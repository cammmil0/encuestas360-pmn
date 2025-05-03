import '../assets/SurveyCard.css';

function SurveyCard({ survey, onStart }) {
  return (
    <div className={`survey-card ${survey.completed ? 'completed' : 'available'}`}>
      <div className="card-header">
        <span className="survey-category">{survey.category || 'General'}</span>
        <span className="survey-status">
          {survey.completed ? 'Completada' : 'Disponible'}
        </span>
      </div>
      
      <div className="card-body">
        <h3>{survey.title}</h3>
        <p className="survey-description">{survey.description}</p>
        {survey.responses > 0 && (
          <div className="survey-responses">
            {survey.responses} {survey.responses === 1 ? 'respuesta' : 'respuestas'}
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <button
          onClick={() => onStart(survey)}
          disabled={survey.completed}
          className="survey-action-btn"
        >
          {survey.completed ? '✓ Completada' : 'Comenzar Encuesta'}
        </button>
      </div>
    </div>
  );
}

export default SurveyCard;