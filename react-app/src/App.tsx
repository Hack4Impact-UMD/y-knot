import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import { AuthProvider } from './auth/AuthProvider';
import SamplePage from './pages/SamplePage/SamplePage';
import Sample404Page from './pages/Sample404Page/Sample404Page';
import LoginPage from './pages/LoginPage/LoginPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import NavigationBar from './components/NavigationBar/NavigationBar';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import ClassPage from './pages/ClassPage/ClassPage';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './muiTheme';
import { addSampleStudent } from './backendTesting/test';
import { authenticateUser } from './backend/FirebaseCalls';
import { Upload } from './components/Upload/Upload';

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
            <Route
              path="/testfunctions"
              element={
                <button
                  onClick={() => {
                    authenticateUser('sgaba@umd.edu', '123abc')
                      .then(() => {
                        addSampleStudent({ firstName: 'Bob' });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                ></button>
              }
            />
            <Route path="/upload" element={<Upload />} />
            <Route path="/courses/class" element={<ClassPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
