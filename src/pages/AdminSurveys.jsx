import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc,query,where } from "firebase/firestore";
import { db } from "../firebase/config";
import styles from "../assets/AdminSurveys.module.css";

const AdminSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Cargar encuestas desde Firestore
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        // Consulta con filtro para status active
        const q = query(
          collection(db, "surveys"),
          where("status", "==", "active")
        );
        const querySnapshot = await getDocs(q);

        const surveysData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Asegura que existan estos campos
          title: doc.data().title || "Sin título",
          status: doc.data().status || "draft",
        }));

        setSurveys(surveysData);
      } catch (err) {
        setError(`Error al cargar: ${err.message}`);
        console.error("Error detallado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Eliminar encuesta de Firestore
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta encuesta?")) {
      try {
        await deleteDoc(doc(db, "surveys", id));
        setSurveys((prev) => prev.filter((survey) => survey.id !== id));
      } catch (err) {
        setError("Error al eliminar la encuesta");
        console.error("Error deleting survey:", err);
      }
    }
  };

  // Filtrar encuestas según término de búsqueda
  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (survey.description &&
        survey.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Determinar estado de la encuesta con estilos
  const getSurveyStatus = (survey) => {
    const status = survey.status || "active";
    return (
      <span className={`${styles.status} ${styles[status]}`}>
        {status === "active"
          ? "Activa"
          : status === "draft"
          ? "Borrador"
          : "Archivada"}
      </span>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Cargando encuestas...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Administrar Encuestas</h1>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Buscar encuestas..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/admin/surveys/new" className={styles.createButton}>
            Crear Nueva Encuesta
          </Link>
        </div>
      </div>

      {filteredSurveys.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? (
            <>
              <p>No se encontraron encuestas que coincidan con tu búsqueda.</p>
              <button
                onClick={() => setSearchTerm("")}
                className={styles.clearButton}
              >
                Limpiar búsqueda
              </button>
            </>
          ) : (
            <>
              <p>No hay encuestas creadas todavía.</p>
              <Link to="/admin/surveys/new" className={styles.createButton}>
                Crear primera encuesta
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3>{survey.title}</h3>
                {survey.description && (
                  <p className={styles.description}>{survey.description}</p>
                )}
                <div className={styles.metaData}>
                  <span>
                    Preguntas: <strong>{survey.questions?.length || 0}</strong>
                  </span>
                  <span>
                    Respuestas: <strong>{survey.responses || 0}</strong>
                  </span>
                  <span>Estado: {getSurveyStatus(survey)}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => navigate(`/admin/surveys/${survey.id}`)}
                  className={styles.viewButton}
                >
                  Ver
                </button>
                <button
                  onClick={() => navigate(`/admin/surveys/edit/${survey.id}`)}
                  className={styles.editButton}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(survey.id)}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSurveys;
