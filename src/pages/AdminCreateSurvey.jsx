import { useState } from 'react';
import React from 'react';
import '../assets/AdminCreateSurvey.css'; // <-- Recuerda crear este CSS o ponlo en el que uses
import { useNavigate } from "react-router-dom";

const Surveys = () => {
    const navigate = useNavigate();
    const [surveyData, setSurveyData] = useState({
        title: '',
        description: '',
        questions: ['']
    });

    const handleClick = () => {
        // Verificar que los campos esenciales no estén vacíos
        if (!surveyData.title || !surveyData.description || surveyData.questions.some(q => !q.trim())) {
            alert('Por favor, completa todos los campos obligatorios.');
            return; // No continuar si hay campos vacíos
        }

        alert('¡Encuesta enviada!');
        navigate('/admin/dashboard');
    };

    const handleAddQuestion = () => {
        setSurveyData({
            ...surveyData,
            questions: [...surveyData.questions, '']
        });
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...surveyData.questions];
        newQuestions[index] = value;
        setSurveyData({
            ...surveyData,
            questions: newQuestions
        });
    };

    const handleRemoveQuestion = (index) => {
        if (surveyData.questions.length > 1) {
            const newQuestions = surveyData.questions.filter((_, i) => i !== index);
            setSurveyData({
                ...surveyData,
                questions: newQuestions
            });
        }
    };

    return (
        <div className="create-survey-container">
            <h1>Crear Nueva Encuesta</h1>
            
            <div className="survey-form">
                <div className="form-group">
                    <label>Título de la encuesta</label>
                    <input
                        type="text"
                        value={surveyData.title}
                        onChange={(e) => setSurveyData({...surveyData, title: e.target.value})}
                        placeholder="Ej: Satisfacción del cliente"
                    />
                </div>
                
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        value={surveyData.description}
                        onChange={(e) => setSurveyData({...surveyData, description: e.target.value})}
                        placeholder="Describe el propósito de esta encuesta"
                        rows="3"
                    />
                </div>
                
                <div className="questions-section">
                    <h3>Preguntas</h3>
                    {surveyData.questions.map((question, index) => (
                        <div key={index} className="question-item">
                            <div className="question-input-group">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder={`Pregunta ${index + 1}`}
                                />
                                {surveyData.questions.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="remove-question-btn"
                                        onClick={() => handleRemoveQuestion(index)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        type="button" 
                        className="add-question-btn"
                        onClick={handleAddQuestion}
                    >
                        + Añadir otra pregunta
                    </button>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => navigate('/admin/surveys')}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        className="publish-btn"
                        onClick={handleClick}
                    >
                        Publicar Encuesta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Surveys;
