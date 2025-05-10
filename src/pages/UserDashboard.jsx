import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SurveyCard from "../components/SurveyCard";
import Header from "../components/Header";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import "../assets/UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState(null);

  // Cargar encuestas disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const surveysQuery = query(
          collection(db, "surveys"),
          where("status", "==", "active")
        );
        const surveysSnapshot = await getDocs(surveysQuery);
        
        const surveysData = await Promise.all(surveysSnapshot.docs.map(async (doc) => {
          const survey = {
            id: doc.id,
            ...doc.data(),
            title: doc.data().title || "Encuesta sin título",
            description: doc.data().description || "",
            questions: doc.data().questions || []
          };
          
          if (auth.currentUser) {
            try {
              const responseQuery = query(
                collection(db, "responses"),
                where("surveyId", "==", doc.id),
                where("userId", "==", auth.currentUser.uid)
              );
              const responseSnapshot = await getDocs(responseQuery);
              survey.completed = !responseSnapshot.empty;
            } catch (err) {
              console.error("Error verificando respuestas:", err);
              survey.completed = false;
            }
          } else {
            survey.completed = false;
          }
          
          return survey;
        }));

        setSurveys(surveysData);
        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error al cargar las encuestas");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth.currentUser]);

  const handleStartSurvey = (survey) => {
    if (survey.completed) {
      alert("Ya has completado esta encuesta anteriormente");
      return;
    }

    setCurrentSurvey(survey);
    const initialResponses = {};
    survey.questions.forEach(question => {
      initialResponses[question.id] = question.type === "text" ? "" : [];
    });
    setResponses(initialResponses);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSurvey(null);
    setResponses({});
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitSurvey = async () => {
    if (!currentSurvey || !auth.currentUser) {
      alert("Debes iniciar sesión para enviar encuestas");
      return;
    }

    // Validar respuestas requeridas
    const hasEmptyRequired = currentSurvey.questions.some(question => {
      if (!question.required) return false;
      const response = responses[question.id];
      return (
        (typeof response === "string" && !response.trim()) ||
        (Array.isArray(response) && response.length === 0)
      );
    });

    if (hasEmptyRequired) {
      alert("Por favor responde todas las preguntas requeridas");
      return;
    }

    try {
      // Intento de guardar respuesta
      const responseData = {
        surveyId: currentSurvey.id,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email || "",
        answers: responses,
        createdAt: serverTimestamp()
      };

      // Paso 1: Guardar la respuesta
      await addDoc(collection(db, "responses"), responseData);

      // Paso 2: Actualizar contador (esto puede fallar sin afectar la respuesta)
      try {
        await updateDoc(doc(db, "surveys", currentSurvey.id), {
          responses: increment(1),
          updatedAt: serverTimestamp()
        });
      } catch (updateError) {
        console.warn("Error actualizando contador:", updateError);
      }

      // Actualización optimista del estado local
      setSurveys(prev => prev.map(s => 
        s.id === currentSurvey.id 
          ? { ...s, responses: (s.responses || 0) + 1, completed: true } 
          : s
      ));

      alert("¡Encuesta enviada con éxito!");
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting survey:", error);
      
      // Verificar si el error es por permisos o porque ya existe
      if (error.code === "permission-denied") {
        // Forzar recarga de datos desde Firestore
        const responseQuery = query(
          collection(db, "responses"),
          where("surveyId", "==", currentSurvey.id),
          where("userId", "==", auth.currentUser.uid)
        );
        const responseSnapshot = await getDocs(responseQuery);
        
        if (!responseSnapshot.empty) {
          // Si existe, actualizar estado
          setSurveys(prev => prev.map(s => 
            s.id === currentSurvey.id ? { ...s, completed: true } : s
          ));
          alert("Ya habías completado esta encuesta. Se ha actualizado el estado.");
        } else {
          alert("No tienes permisos para enviar esta encuesta. Por favor contacta al administrador.");
        }
      } else {
        alert(`Error al enviar: ${error.message}`);
      }
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/"));
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <Header
          title="Mis Encuestas"
          subtitle="Cargando encuestas disponibles..."
          onLogout={handleLogout}
        />
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <Header
          title="Mis Encuestas"
          onLogout={handleLogout}
        />
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <Header
        title="Mis Encuestas"
        subtitle="Responde y ayuda a mejorar nuestros servicios"
        onLogout={handleLogout}
      />

      {surveys.length === 0 ? (
        <div className="empty-state">
          <p>No hay encuestas disponibles en este momento.</p>
          <p>Por favor revisa más tarde.</p>
        </div>
      ) : (
        <div className="survey-grid">
          {surveys.map(survey => (
            <SurveyCard
              key={survey.id}
              survey={{
                ...survey,
                completed: survey.completed,
                responses: survey.responses || 0
              }}
              onStart={handleStartSurvey}
            />
          ))}
        </div>
      )}

      {/* Modal para responder encuesta */}
      {isModalOpen && currentSurvey && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{currentSurvey.title}</h2>
            <p className="survey-description">{currentSurvey.description}</p>

            <div className="survey-questions">
              {currentSurvey.questions.map((question, index) => (
                <div key={question.id} className="question-group">
                  <label>
                    {question.text}
                    {question.required && <span className="required"> *</span>}
                  </label>

                  {question.type === "text" ? (
                    <textarea
                      value={responses[question.id] || ""}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      placeholder="Escribe tu respuesta aquí"
                      required={question.required}
                    />
                  ) : (
                    <div className="options-group">
                      {question.options.map((option, idx) => (
                        <div key={idx} className="option-item">
                          <input
                            type={question.type === "radio" ? "radio" : "checkbox"}
                            id={`${question.id}-${idx}`}
                            name={question.id}
                            value={option}
                            checked={
                              question.type === "radio"
                                ? responses[question.id] === option
                                : (responses[question.id] || []).includes(option)
                            }
                            onChange={(e) => {
                              if (question.type === "radio") {
                                handleResponseChange(question.id, option);
                              } else {
                                const current = responses[question.id] || [];
                                const newValue = e.target.checked
                                  ? [...current, option]
                                  : current.filter(v => v !== option);
                                handleResponseChange(question.id, newValue);
                              }
                            }}
                            required={question.required && question.type === "radio"}
                          />
                          <label htmlFor={`${question.id}-${idx}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={handleSubmitSurvey} className="submit-btn">
                Enviar Encuesta
              </button>
              <button onClick={handleCloseModal} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;