import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './muiTheme';
import {
  createUser,
  deleteUser,
  setUserRole,
} from './backend/CloudFunctionsCalls';
import { addSampleCourse, addSampleStudent } from './backendTesting/test';
import { Upload } from './components/Upload/Upload';
import RequireAuth from './auth/RequireAuth/RequireAuth';
import Sample404Page from './pages/Sample404Page/Sample404Page';
import NavigationBar from './components/NavigationBar/NavigationBar';
import LoginPage from './pages/LoginPage/LoginPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import StudentRosterPage from './pages/StudentRosterPage/StudentRosterPage';
import ClassPage from './pages/ClassPage/ClassPage';
import { theme } from './muiTheme';
import { addSampleStudent } from './backendTesting/test';
import { authenticateUser } from './backend/FirebaseCalls';
import { Upload } from './components/Upload/Upload';
import StudentProfilePage from './pages/StudentProfilePage/StudentProfilePage';
import TeacherProfilePage from './pages/TeacherProfilePage/TeacherProfilePage';
import TranscriptPage from './pages/TranscriptPage/TranscriptPage';
import CertificatePage from './pages/CertificatePage/CertificatePage';


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
              path="/courses"
              element={
                <RequireAuth>
                  <CoursesPage />
                </RequireAuth>
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
              path="*"
              element={
                <RequireAuth>
                  <Sample404Page />
                </RequireAuth>
              }
            />
            <Route path="/nav" element={<NavigationBar />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/students" element={<StudentRosterPage />} />
            <Route
              path="/testfunctions"
              element={
                <button
                  onClick={() => {
                    // addSampleStudent({ firstName: 'Bob' });
                    addSampleCourse({ name: 'Math' });
                  }}
                ></button>
              }
            />
            <Route path="/upload" element={<Upload />} />
            <Route path="/class" element={<ClassPage />} />
            <Route path="/student/:id" element={<StudentProfilePage />} />
            <Route path="/teacher/:id" element={<TeacherProfilePage />} />
            <Route path="/transcript" element={<TranscriptPage />} />
            <Route path="/courses/class" element={<ClassPage />} />
            <Route
              path="/certificate"
              element={<CertificatePage name="Fiona Love" course="Math" />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
