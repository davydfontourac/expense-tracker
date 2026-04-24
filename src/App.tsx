import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Categories from '@/pages/Categories';
import Profile from '@/pages/Profile';
import { AuthProvider } from '@/context/AuthContext';
import { PrivateRoute, PublicRoute } from '@/components/RouteGuards';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas (apenas deslogados) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Rotas Privadas (apenas logados) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback de rotas inexistentes redireciona pra home para o App processar */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
