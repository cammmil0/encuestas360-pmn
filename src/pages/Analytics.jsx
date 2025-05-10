import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../assets/Analytics.css';

Chart.register(...registerables);

const Analytics = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  // Cargar encuestas con preguntas de selección
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const q = query(
          collection(db, 'surveys'),
          where('questions', '!=', [])
        );
        const querySnapshot = await getDocs(q);
        
        const surveysData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          questions: doc.data().questions.filter(
            q => q.type === 'radio' || q.type === 'checkbox'
          )
        })).filter(survey => survey.questions.length > 0);

        setSurveys(surveysData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading surveys:", error);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Función para guardar el gráfico como imagen
  const saveChartAsImage = () => {
    if (!chartRef.current) return;
    
    const link = document.createElement('a');
    link.download = `resultados-${selectedSurvey.title}-${selectedSurvey.questions[selectedQuestionIndex].text}.png`;
    link.href = chartRef.current.toDataURL('image/png');
    link.click();
  };

  // Cargar respuestas y generar gráfico
  useEffect(() => {
    if (!selectedSurvey) return;

    const fetchResponsesAndRenderChart = async () => {
      try {
        const responsesQuery = query(
          collection(db, 'responses'),
          where('surveyId', '==', selectedSurvey.id)
        );
        const responsesSnapshot = await getDocs(responsesQuery);

        // Procesar respuestas para el gráfico
        const questionData = selectedSurvey.questions.map(question => {
          const optionsCount = {};
          question.options.forEach(option => {
            optionsCount[option] = 0;
          });

          responsesSnapshot.forEach(doc => {
            const answer = doc.data().answers[question.id];
            if (question.type === 'radio') {
              if (answer && optionsCount[answer] !== undefined) {
                optionsCount[answer]++;
              }
            } else if (question.type === 'checkbox') {
              answer?.forEach(opt => {
                if (optionsCount[opt] !== undefined) {
                  optionsCount[opt]++;
                }
              });
            }
          });

          return {
            questionText: question.text,
            options: question.options,
            counts: Object.values(optionsCount)
          };
        });

        // Renderizar gráfico
        if (chartRef.current) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          const ctx = chartRef.current.getContext('2d');
          
          if (questionData.length > 0) {
            const currentQuestion = questionData[selectedQuestionIndex];
            
            chartInstance.current = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: currentQuestion.options,
                datasets: [{
                  label: currentQuestion.questionText,
                  data: currentQuestion.counts,
                  backgroundColor: [
                    '#4f46e5',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                  ],
                  borderColor: [
                    '#3730a3',
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#7c3aed'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Número de respuestas'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Opciones'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: true,
                    text: `Resultados: ${selectedSurvey.title} - ${currentQuestion.questionText}`,
                    font: {
                      size: 16
                    }
                  }
                }
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading responses:", error);
      }
    };

    fetchResponsesAndRenderChart();
  }, [selectedSurvey, selectedQuestionIndex]);

  if (loading) {
    return <div className="analytics-container">Cargando encuestas...</div>;
  }

  return (
    <div className="analytics-container">
      <h1>Analíticas de Encuestas</h1>
      
      <div className="survey-selector">
        <h2>Selecciona una encuesta</h2>
        <select 
          onChange={(e) => {
            setSelectedSurvey(surveys.find(s => s.id === e.target.value));
            setSelectedQuestionIndex(0);
          }}
          value={selectedSurvey?.id || ''}
        >
          <option value="">-- Seleccione una encuesta --</option>
          {surveys.map(survey => (
            <option key={survey.id} value={survey.id}>
              {survey.title} ({survey.questions.length} preguntas)
            </option>
          ))}
        </select>
      </div>

      {selectedSurvey && (
        <div className="chart-section">
          <div className="chart-controls">
            <button 
              onClick={saveChartAsImage}
              className="download-button"
            >
              Descargar Gráfico
            </button>
          </div>

          <div className="chart-wrapper">
            <canvas 
              ref={chartRef} 
              height="400"
              width="800"
            />
          </div>
          
          <div className="survey-info">
            <h3>{selectedSurvey.title}</h3>
            <p>Selecciona una pregunta para visualizar:</p>
            <div className="questions-list">
              {selectedSurvey.questions.map((question, index) => (
                <div 
                  key={index} 
                  className={`question-item ${index === selectedQuestionIndex ? 'active' : ''}`}
                  onClick={() => setSelectedQuestionIndex(index)}
                >
                  <h4>{question.text}</h4>
                  <ul>
                    {question.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;