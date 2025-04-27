import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import AdminDashboard from '../pages/Dashboard';
import UserDashboard from '../pages/UserDashboard';
// Importa las nuevas pantallas
import AdminSurveys from '../pages/AdminSurveys';
import Analytics from '../pages/Analytics.jsx';
import AdminClients from '../pages/AdminClients';
import AdminLayout from '../layouts/AdminLayout';
import AdminCreateSurvey from '../pages/AdminCreateSurvey.jsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route element={<AdminLayout />}>
          {/* Rutas de ADMIN */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/surveys" element={<AdminSurveys />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/surveys/new" element={<AdminCreateSurvey />} />
          </Route>
        {/* Rutas de USUARIO */}
        <Route path="/user/encuestas" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;