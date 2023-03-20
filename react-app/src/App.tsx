import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import { AuthProvider } from './auth/AuthProvider';
import SamplePage from './pages/SamplePage/SamplePage';
import Sample404Page from './pages/Sample404Page/Sample404Page';
import LoginPage from './pages/LoginPage/LoginPage';
import AdminSettingsPage from './pages/AdminSettingsPage/AdminSettingsPage';
import TeacherSettingsPage from './pages/TeacherSettingsPage/TeacherSettingsPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <SamplePage />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <RequireAuth>
                <Sample404Page />
              </RequireAuth>
            }
          />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/adminsettings" element={<AdminSettingsPage />} />
          <Route path="/teachersettings" element={<TeacherSettingsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
