import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './pages/auth/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { FlashcardPage } from './pages/student/FlashcardPage';
import { TrainingPage } from './pages/student/TrainingPage';
import { TestPage } from './pages/student/TestPage';
import { TakeTestPage } from './pages/student/TakeTestPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { CountriesPage } from './pages/student/CountriesPage';
import { CountryDetailsPage } from './pages/student/CountryDetailsPage';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { EquipmentManagement } from './pages/instructor/EquipmentManagement';
import { TestManagement } from './pages/instructor/TestManagement';
import { CreateTestPage } from './pages/instructor/CreateTestPage';
import { CorrectTestPage } from './pages/instructor/CorrectTestPage';
import { StudentResultsPage } from './pages/instructor/StudentResultsPage';

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'INSTRUCTOR' | 'STUDENT')[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'ADMIN' || user.role === 'INSTRUCTOR') {
      return <Navigate to="/instructor/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, initAuth, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Smart redirect based on user role
  const getDefaultRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') {
      return <Navigate to="/instructor/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={getDefaultRedirect()} />
          <Route path="/dashboard" element={getDefaultRedirect()} />

          {/* Student Routes - Only for STUDENT role */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/training"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <TrainingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/flashcards"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <FlashcardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/test"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/test/:testId"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <TakeTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/countries"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <CountriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/countries/:countryId"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <CountryDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes - For INSTRUCTOR and ADMIN */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/equipment"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <EquipmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/tests"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <TestManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/tests/create"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CreateTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/tests/correct"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CorrectTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/student-results"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <StudentResultsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to appropriate dashboard */}
          <Route path="*" element={getDefaultRedirect()} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
