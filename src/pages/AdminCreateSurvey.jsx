import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import '../assets/AdminCreateSurvey.css';

const AdminCreateSurvey = () => {
    const navigate = useNavigate();
    const [surveyData, setSurveyData] = useState({
        title: '',
        description: '',
        questions: [
            {
                id: uuidv4(),
                text: '',
                type: 'text', // 'text', 'radio', 'checkbox'
                options: [],
                required: false
            }
        ]
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePublish = async () => {
        // Validación de campos
        if (!surveyData.title.trim()) {
            setError('El título de la encuesta es obligatorio');
            return;
        }

        if (surveyData.questions.some(q => !q.text.trim())) {
            setError('Todas las preguntas deben tener texto');
            return;
        }

        if (surveyData.questions.some(q => 
            (q.type === 'radio' || q.type === 'checkbox') && q.options.length < 2
        )) {
            setError('Las preguntas de selección deben tener al menos 2 opciones');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No autenticado');
            }

            // Preparar datos para Firestore
            const surveyToSave = {
                title: surveyData.title,
                description: surveyData.description,
                questions: surveyData.questions.map(q => ({
                    text: q.text,
                    type: q.type,
                    options: q.options,
                    required: q.required || false
                })),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userId: user.uid,
                responses: 0,
                status: 'active'
            };

            // Guardar en Firestore
            const docRef = await addDoc(collection(db, 'surveys'), surveyToSave);
            
            alert(`Encuesta publicada con éxito! ID: ${docRef.id}`);
            navigate('/admin/surveys');
        } catch (error) {
            console.error('Error al guardar la encuesta:', error);
            setError('Error al guardar la encuesta: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddQuestion = () => {
        setSurveyData({
            ...surveyData,
            questions: [
                ...surveyData.questions,
                {
                    id: uuidv4(),
                    text: '',
                    type: 'text',
                    options: [],
                    required: false
                }
            ]
        });
    };

    const handleQuestionChange = (id, field, value) => {
        setSurveyData({
            ...surveyData,
            questions: surveyData.questions.map(q => 
                q.id === id ? { ...q, [field]: value } : q
            )
        });
    };

    const handleQuestionTypeChange = (id, type) => {
        setSurveyData({
            ...surveyData,
            questions: surveyData.questions.map(q => 
                q.id === id ? { 
                    ...q, 
                    type,
                    options: type === 'text' ? [] : q.options.length ? q.options : ['Opción 1', 'Opción 2']
                } : q
            )
        });
    };

    const handleAddOption = (questionId) => {
        setSurveyData({
            ...surveyData,
            questions: surveyData.questions.map(q => 
                q.id === questionId ? { 
                    ...q, 
                    options: [...q.options, `Opción ${q.options.length + 1}`]
                } : q
            )
        });
    };

    const handleRemoveOption = (questionId, optionIndex) => {
        setSurveyData({
            ...surveyData,
            questions: surveyData.questions.map(q => 
                q.id === questionId ? { 
                    ...q, 
                    options: q.options.filter((_, idx) => idx !== optionIndex)
                } : q
            )
        });
    };

    const handleOptionChange = (questionId, optionIndex, value) => {
        setSurveyData({
            ...surveyData,
            questions: surveyData.questions.map(q => 
                q.id === questionId ? { 
                    ...q, 
                    options: q.options.map((opt, idx) => 
                        idx === optionIndex ? value : opt
                    )
                } : q
            )
        });
    };

    const handleRemoveQuestion = (id) => {
        if (surveyData.questions.length > 1) {
            setSurveyData({
                ...surveyData,
                questions: surveyData.questions.filter(q => q.id !== id)
            });
        }
    };

    const toggleQuestionRequired = (questionId) => {
        setSurveyData({
            ...surveyData,
            questions: surveyData.questions.map(q => 
                q.id === questionId ? { ...q, required: !q.required } : q
            )
        });
    };

    return (
        <div className="admin-create-survey">
            <h1>Crear Nueva Encuesta</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="survey-form">
                <div className="form-group">
                    <label>Título de la encuesta *</label>
                    <input
                        type="text"
                        value={surveyData.title}
                        onChange={(e) => setSurveyData({...surveyData, title: e.target.value})}
                        placeholder="Ej: Satisfacción del cliente"
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        value={surveyData.description}
                        onChange={(e) => setSurveyData({...surveyData, description: e.target.value})}
                        placeholder="Describe el propósito de esta encuesta"
                        rows="3"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="questions-section">
                    <h3>Preguntas</h3>
                    
                    {surveyData.questions.map((question) => (
                        <div key={question.id} className="question-card">
                            <div className="question-header">
                                <div className="question-controls">
                                    <select
                                        value={question.type}
                                        onChange={(e) => handleQuestionTypeChange(question.id, e.target.value)}
                                        className="question-type-select"
                                        disabled={isLoading}
                                    >
                                        <option value="text">Texto libre</option>
                                        <option value="radio">Selección única</option>
                                        <option value="checkbox">Selección múltiple</option>
                                    </select>
                                    
                                    <label className="required-toggle">
                                        <input
                                            type="checkbox"
                                            checked={question.required}
                                            onChange={() => toggleQuestionRequired(question.id)}
                                            disabled={isLoading}
                                        />
                                        Requerida
                                    </label>
                                </div>
                                
                                {surveyData.questions.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="remove-question-btn"
                                        onClick={() => handleRemoveQuestion(question.id)}
                                        disabled={isLoading}
                                    >
                                        × Eliminar pregunta
                                    </button>
                                )}
                            </div>
                            
                            <input
                                type="text"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                                placeholder="Escribe la pregunta"
                                className="question-input"
                                required
                                disabled={isLoading}
                            />
                            
                            {(question.type === 'radio' || question.type === 'checkbox') && (
                                <div className="options-section">
                                    <label>Opciones:</label>
                                    {question.options.map((option, idx) => (
                                        <div key={idx} className="option-item">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                                                className="option-input"
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className="remove-option-btn"
                                                onClick={() => handleRemoveOption(question.id, idx)}
                                                disabled={question.options.length <= 2 || isLoading}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        className="add-option-btn"
                                        onClick={() => handleAddOption(question.id)}
                                        disabled={isLoading}
                                    >
                                        + Añadir opción
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <button 
                        type="button" 
                        className="add-question-btn"
                        onClick={handleAddQuestion}
                        disabled={isLoading}
                    >
                        + Añadir nueva pregunta
                    </button>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => navigate('/admin/surveys')}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        className="publish-btn"
                        onClick={handlePublish}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Publicando...' : 'Publicar Encuesta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateSurvey;