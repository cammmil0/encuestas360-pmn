import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/Dashboard";
import UserDashboard from "../pages/UserDashboard";
import AdminSurveys from "../pages/AdminSurveys";
import Analytics from "../pages/Analytics.jsx";
import AdminClients from "../pages/AdminClients";
import AdminLayout from "../layouts/AdminLayout";
import AdminCreateSurvey from "../pages/AdminCreateSurvey.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Unauthorized from "../components/Unauthorized.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas de ADMIN */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSurveys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminClients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCreateSurvey />
              </ProtectedRoute>
            }
          />
        </Route>
        
        {/* Rutas protegidas de USUARIO */}
        <Route
          path="/user/encuestas"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Rutas de estado */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;