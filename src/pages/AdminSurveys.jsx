import React from 'react';
import styles from '../assets/AdminSurveys.module.css';
import { Link } from 'react-router-dom';

const AdminSurveys = () => {
  // Datos simulados de encuestas
  const surveys = [
    { id: 1, title: "Satisfacción de Clientes", responses: 24, status: "Activa" },
    { id: 2, title: "Preferencias de Producto", responses: 15, status: "Terminada" },
  ];

  return (
    <div className={styles.container}>
      <h1>Administrar Encuestas</h1>
      <Link to="/admin/surveys/new" className={styles.button}>
        Crear Nueva Encuesta
      </Link>

      <div className={styles.grid}>
        {surveys.map((survey) => (
          <div key={survey.id} className={styles.card}>
            <h3>{survey.title}</h3>
            <p>Respuestas: {survey.responses}</p>
            <p>Estado: {survey.status}</p>
            <div className={styles.actions}>
              <button className={styles.editButton}>Editar</button>
              <button className={styles.deleteButton}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSurveys;