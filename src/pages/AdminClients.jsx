import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clients } from '../data/clientsData';
import '../assets/AdminClients.css';

const AdminClients = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page-content">
      <h1>Clientes Registrados ({clients.length})</h1>
      
      <div className="clients-table">
        <div className="table-header">
          <span>Nombre</span>
          <span>Email</span>
          <span>Encuestas</span>
          <span>Última actividad</span>
        </div>
        
        {clients.map(client => (
          <div 
            key={client.id} 
            className="client-row" 
            onClick={() => navigate(`#`)}
          >
            <span>{client.name}</span>
            <span>{client.email}</span>
            <span className="surveys-badge">{client.surveysCompleted}</span>
            <span>{new Date(client.lastActivity).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClients;