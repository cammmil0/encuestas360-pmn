import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import '../assets/Analytics.css';

Chart.register(...registerables);

const Analytics = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
          datasets: [{
            label: 'Respuestas Totales',
            data: [12, 19, 8, 15, 24],
            backgroundColor: '#4f46e5',
            borderColor: '#3730a3',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // ¡Importante para control manual!
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12 // Tamaño de fuente más pequeño
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: 12
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="analytics-container">
      <h1>Analíticas de Encuestas</h1>
      <div className="chart-wrapper">
        <canvas 
          ref={chartRef} 
          height="250" // Altura fija (en píxeles)
          width="600"  // Ancho fijo
        />
      </div>
    </div>
  );
};

export default Analytics;