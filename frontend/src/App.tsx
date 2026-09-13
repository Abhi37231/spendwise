import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './layouts/MainLayout';
import TransactionsPage from './pages/TransactionsPage';
import AddExpensePage from './pages/AddExpensePage';
import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="add-expense" element={<AddExpensePage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
