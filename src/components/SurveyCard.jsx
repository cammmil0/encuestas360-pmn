import '../assets/SurveyCard.css';

function SurveyCard({ survey, onStart }) {
  return (
    <div className={`survey-card ${survey.completed ? 'completed' : ''}`}>
      <div className="card-header">
        <span className="category-badge">{survey.category}</span>
        {survey.completed && <span className="completed-badge">Completada</span>}
      </div>
      <div className="card-body">
        <h3>{survey.title}</h3>
        <p>{survey.description}</p>
      </div>
      <div className="card-footer">
        <span className="deadline">⏳ {survey.deadline}</span>
        <button
          onClick={onStart}
          disabled={survey.completed}
          className={`action-btn ${survey.completed ? 'completed' : ''}`}
        >
          {survey.completed ? '✓ Listo' : 'Comenzar'}
        </button>
      </div>
    </div>
  );
}

export default SurveyCard;