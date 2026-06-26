import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Landing from './pages/Landing';
import CandidateIntelligence from './pages/CandidateIntelligence';
import MyJobs from './pages/MyJobs';
import CreateJob from './pages/CreateJob';
import Rankings from './pages/Rankings';
import Analytics from './pages/Analytics';
import RecruiterLayout from './components/RecruiterLayout';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Navigate to={user.role === 'student' ? '/dashboard' : '/recruiter'} /> : <PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <PageWrapper><Register /></PageWrapper>} />
        <Route path="/dashboard" element={<ProtectedRoute role="student"><PageWrapper><StudentDashboard /></PageWrapper></ProtectedRoute>} />
        
        {/* Recruiter Routes wrapped in RecruiterLayout */}
        <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><RecruiterLayout><RecruiterDashboard /></RecruiterLayout></ProtectedRoute>} />
        <Route path="/recruiter/rankings" element={<ProtectedRoute role="recruiter"><RecruiterLayout><Rankings /></RecruiterLayout></ProtectedRoute>} />
        <Route path="/recruiter/jobs" element={<ProtectedRoute role="recruiter"><RecruiterLayout><MyJobs /></RecruiterLayout></ProtectedRoute>} />
        <Route path="/recruiter/jobs/create" element={<ProtectedRoute role="recruiter"><RecruiterLayout><CreateJob /></RecruiterLayout></ProtectedRoute>} />
        <Route path="/recruiter/analytics" element={<ProtectedRoute role="recruiter"><RecruiterLayout><Analytics /></RecruiterLayout></ProtectedRoute>} />
        <Route path="/recruiter/candidates/:id" element={<ProtectedRoute role="recruiter"><RecruiterLayout><CandidateIntelligence /></RecruiterLayout></ProtectedRoute>} />
        <Route path="/candidate/:id" element={<ProtectedRoute role="recruiter"><RecruiterLayout><CandidateIntelligence /></RecruiterLayout></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
