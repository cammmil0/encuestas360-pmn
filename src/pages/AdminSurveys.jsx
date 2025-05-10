import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/config";
import styles from "../assets/AdminSurveys.module.css";

const AdminSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);

        // Verificar rol de admin
        const user = auth.currentUser;
        if (!user) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        const token = await user.getIdTokenResult();
        if (!token.claims.role || token.claims.role !== "admin") {
          setError(
            "Acceso denegado: Se requieren privilegios de administrador"
          );
          setLoading(false);
          return;
        }

        // Consulta para admin (todas las encuestas)
        const q = query(collection(db, "surveys"));

        // Usar onSnapshot para actualización en tiempo real
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const surveysData = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
              const responsesQuery = query(
                collection(db, "responses"),
                where("surveyId", "==", docSnap.id)
              );
              const responsesSnapshot = await getDocs(responsesQuery);

              return {
                id: docSnap.id,
                ...docSnap.data(),
                title: docSnap.data().title || "Sin título",
                status: docSnap.data().status || "draft",
                responses: responsesSnapshot.size,
              };
            })
          );

          setSurveys(surveysData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error al cargar encuestas:", err);
        setError(`Error al cargar encuestas: ${err.message}`);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [auth.currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta encuesta?")) return;

    try {
      await deleteDoc(doc(db, "surveys", id));
      // No necesitamos actualizar el estado, onSnapshot lo manejará
    } catch (err) {
      console.error("Error al eliminar encuesta:", err);
      setError(`Error al eliminar encuesta: ${err.message}`);
    }
  };

  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (survey.description &&
        survey.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
