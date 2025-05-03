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
import { db, auth } from "../firebase/config"; // Asegúrate de exportar 'auth' en tu config
import "../assets/UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [responses, setResponses] = useState({});

  // Cargar encuestas disponibles desde Firestore
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        // Consulta para obtener solo encuestas activas
        const q = query(
          collection(db, "surveys"),
          where("status", "==", "active")
        );

        const querySnapshot = await getDocs(q);
        const surveysData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Asegurar valores por defecto
          title: doc.data().title || "Encuesta sin título",
          description: doc.data().description || "",
          questions: doc.data().questions || [],
        }));

        setSurveys(surveysData);
      } catch (error) {
        console.error("Error loading surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  const handleStartSurvey = (survey) => {
    setCurrentSurvey(survey);

    // Inicializar respuestas vacías
    const initialResponses = {};
    survey.questions.forEach((question) => {
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
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitSurvey = async () => {
    if (!currentSurvey || !auth.currentUser) {
      alert("Usuario no autenticado o encuesta no seleccionada");
      return;
    }

    // Validación de respuestas requeridas
    const hasEmptyRequired = currentSurvey.questions.some((question) => {
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
      // 1. Guardar la respuesta en la colección 'responses'
      const responseData = {
        surveyId: currentSurvey.id,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email || "no-email",
        date: new Date(),
        answers: responses,
        surveyTitle: currentSurvey.title,
      };

      await addDoc(collection(db, "responses"), responseData);

      // 2. Actualizar el contador de respuestas en la encuesta
      const surveyRef = doc(db, "surveys", currentSurvey.id);
      await updateDoc(doc(db, "surveys", currentSurvey.id), {
        responses: increment(1),
        updatedAt: serverTimestamp(), // Usa serverTimestamp en lugar de new Date()
      });

      // 3. Actualizar el estado local
      setSurveys((prev) =>
        prev.map((s) =>
          s.id === currentSurvey.id
            ? { ...s, responses: (s.responses || 0) + 1 }
            : s
        )
      );

      alert("¡Encuesta enviada con éxito!");
      handleCloseModal();
    } catch (error) {
      console.error("Detalles del error:", {
        error: error.message,
        code: error.code,
        stack: error.stack,
      });
      alert(`Error al enviar: ${error.message}`);
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
          {surveys.map((survey) => {
            // En Firestore, necesitarías consultar si el usuario ya respondió
            const completed = false; // Implementar lógica real con consulta a Firestore

            return (
              <SurveyCard
                key={survey.id}
                survey={{
                  ...survey,
                  completed,
                  responses: survey.responses || 0,
                }}
                onStart={handleStartSurvey}
              />
            );
          })}
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
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                      placeholder="Escribe tu respuesta aquí"
                      required={question.required}
                    />
                  ) : (
                    <div className="options-group">
                      {question.options.map((option, idx) => (
                        <div key={idx} className="option-item">
                          <input
                            type={
                              question.type === "radio" ? "radio" : "checkbox"
                            }
                            id={`${question.id}-${idx}`}
                            name={question.id}
                            value={option}
                            checked={
                              question.type === "radio"
                                ? responses[question.id] === option
                                : (responses[question.id] || []).includes(
                                    option
                                  )
                            }
                            onChange={(e) => {
                              if (question.type === "radio") {
                                handleResponseChange(question.id, option);
                              } else {
                                const current = responses[question.id] || [];
                                const newValue = e.target.checked
                                  ? [...current, option]
                                  : current.filter((v) => v !== option);
                                handleResponseChange(question.id, newValue);
                              }
                            }}
                            required={
                              question.required && question.type === "radio"
                            }
                          />
                          <label htmlFor={`${question.id}-${idx}`}>
                            {option}
                          </label>
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
