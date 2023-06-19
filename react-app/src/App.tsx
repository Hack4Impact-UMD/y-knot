import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './muiTheme';
import { addSampleCourse, addSampleStudent } from './backendTesting/test';
import { Upload } from './components/Upload/Upload';
import RequireAuth from './auth/RequireAuth/RequireAuth';
import RequireAdminAuth from './auth/RequireAdminAuth/RequireAdminAuth';
import LoginPage from './pages/LoginPage/LoginPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import StudentRosterPage from './pages/StudentRosterPage/StudentRosterPage';
import ClassPage from './pages/ClassPage/ClassPage';
import StudentProfilePage from './pages/StudentProfilePage/StudentProfilePage';
import TeacherProfilePage from './pages/TeacherProfilePage/TeacherProfilePage';
import TranscriptPage from './pages/TranscriptPage/TranscriptPage';
import CertificatePage from './pages/CertificatePage/CertificatePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import NavigationBar from './components/NavigationBar/NavigationBar';
import TeacherRosterPage from './pages/TempTeacherRosterPage/TeacherRosterPage';
import { createUser } from './backend/CloudFunctionsCalls';

function App(): JSX.Element {
  const customTheme = theme;
  return (
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Navigate to="/courses" />
                </RequireAuth>
              }
            />
            <Route
              path="*"
              element={
                <RequireAuth>
                  <NotFoundPage />
                </RequireAuth>
              }
            />
            <Route
              path="/courses"
              element={
                <RequireAuth>
                  <CoursesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/courses/class"
              element={
                <RequireAuth>
                  <ClassPage />
                </RequireAuth>
              }
            />
            <Route
              path="/students"
              element={
                <RequireAdminAuth>
                  <StudentRosterPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/teachers"
              element={
                <RequireAdminAuth>
                  <TeacherRosterPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/nav"
              element={
                <RequireAuth>
                  <NavigationBar />
                </RequireAuth>
              }
            />
            <Route
              path="/testfunctions"
              element={
                <RequireAuth>
                  <button
                    onClick={() => {
                      // addSampleStudent({ firstName: 'Bob' });
                    }}
                  ></button>
                </RequireAuth>
              }
            />
            <Route path="/upload" element={<Upload />} />
            <Route
              path="/student/:id"
              element={
                <RequireAuth>
                  <StudentProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/teacher/:id"
              element={
                <RequireAdminAuth>
                  <TeacherProfilePage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/transcript"
              element={
                <RequireAuth>
                  <TranscriptPage />
                </RequireAuth>
              }
            />
            <Route
              path="/certificate"
              element={
                <RequireAuth>
                  <CertificatePage name="Fiona Love" course="Math" />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
