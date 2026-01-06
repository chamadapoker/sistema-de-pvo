import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './pages/auth/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { TrainingPage } from './pages/student/TrainingPage';
import { TestPage } from './pages/student/TestPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { EquipmentManagement } from './pages/instructor/EquipmentManagement';
import { TestManagement } from './pages/instructor/TestManagement';
import { StudentResultsPage } from './pages/instructor/StudentResultsPage';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/training" element={<TrainingPage />} />
          <Route path="/student/test" element={<TestPage />} />
          <Route path="/student/results" element={<ResultsPage />} />

          {/* Instructor Routes */}
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/equipment" element={<EquipmentManagement />} />
          <Route path="/instructor/tests" element={<TestManagement />} />
          <Route path="/instructor/student-results" element={<StudentResultsPage />} />

          {/* Legacy Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                <div className="card max-w-2xl">
                  <h1 className="text-3xl font-bold text-center mb-4">
                    Sistema PVO Moderno
                  </h1>
                  <p className="text-gray-600 text-center">
                    Bem-vindo ao sistema de treinamento de reconhecimento visual de equipamentos militares.
                  </p>
                  <div className="mt-6 grid gap-4">
                    <button className="btn btn-primary">
                      Modo Treinamento
                    </button>
                    <button className="btn btn-secondary">
                      Fazer Teste
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
