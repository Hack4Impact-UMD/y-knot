import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import { AuthProvider } from './auth/AuthProvider';
import SamplePage from './pages/SamplePage/SamplePage';
import Sample404Page from './pages/Sample404Page/Sample404Page';
import LoginPage from './pages/LoginPage/LoginPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import { createAdmin } from './backend/CloudFunctionsCalls';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './muiTheme';
import { addSampleStudent } from './backendTesting/test';
import { authenticateUser } from './backend/FirebaseCalls';

function App(): JSX.Element {
  const customTheme = theme;
  return (
    <ThemeProvider theme={customTheme}>
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
            <Route
              path="/testfunctions"
              element={
                <button
                  onClick={() => {
                    authenticateUser('sgaba@umd.edu', '123abc')
                      .then(() => {
                        addSampleStudent({ firstName: 'Bob' });
                      })
                      .catch((error) => console.log(error));
                  }}
                ></button>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
