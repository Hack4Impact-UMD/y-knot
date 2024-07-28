import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import RequireAdminAuth from './auth/RequireAdminAuth/RequireAdminAuth';
import RequireAuth from './auth/RequireAuth/RequireAuth';
import Certificate from './components/Certificate/Certificate';
import FileUpload from './components/FileUpload/FileUpload';
import { theme } from './muiTheme';
import AddCoursePage from './pages/AddCoursesPage/AddCoursePage';
import AddStudentPage from './pages/AddStudentPage/AddStudentPage';
import ClassPage from './pages/ClassPage/ClassPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import LeadershipApplicationPage from './pages/LeadershipApplicationPage/LeadershipApplicationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MergeSelectionPage from './pages/MergeSelectionPage/MergeSelectionPage';
import MergeStudentPage from './pages/MergeStudentPage/MergeStudentPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import StudentProfilePage from './pages/StudentProfilePage/StudentProfilePage';
import StudentRosterPage from './pages/StudentRosterPage/StudentRosterPage';
import TeacherProfilePage from './pages/TeacherProfilePage/TeacherProfilePage';
import TeacherRosterPage from './pages/TeacherRosterPage/TeacherRosterPage';
import TranscriptPage from './pages/TranscriptPage/TranscriptPage';

function App(): JSX.Element {
  const customTheme = theme;

  const [courseAdded, setCourseAdded] = useState(false);
  const [courseDeleted, setCourseDeleted] = useState(false);
  const [studentAdded, setStudentAdded] = useState(false);
  const [studentMerged, setStudentMerged] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={customTheme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/fileTest" element={<FileUpload />} />

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
                path="/cert"
                element={
                  <RequireAuth>
                    <Certificate name="" course="" />
                  </RequireAuth>
                }
              />

              <Route
                path="/courses"
                element={
                  <RequireAuth>
                    <CoursesPage
                      courseAdded={courseAdded}
                      setCourseAdded={setCourseAdded}
                      courseDeleted={courseDeleted}
                      setCourseDeleted={setCourseDeleted}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/courses/add"
                element={
                  <RequireAdminAuth>
                    <AddCoursePage setCourseAdded={setCourseAdded} />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <RequireAuth>
                    <ClassPage setCourseDeleted={setCourseDeleted} />
                  </RequireAuth>
                }
              />
              <Route
                path="/courses/:courseId/applicant/:appId"
                element={
                  <RequireAdminAuth>
                    <LeadershipApplicationPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/students"
                element={
                  <RequireAuth>
                    <StudentRosterPage
                      studentAdded={studentAdded}
                      setStudentAdded={setStudentAdded}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/students/add"
                element={
                  <RequireAdminAuth>
                    <AddStudentPage setStudentAdded={setStudentAdded} />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <RequireAuth>
                    <StudentProfilePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/students/merge"
                element={
                  <RequireAdminAuth>
                    <MergeSelectionPage
                      studentMerged={studentMerged}
                      setStudentMerged={setStudentMerged}
                    />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/students/mergestudent"
                element={
                  <RequireAdminAuth>
                    <MergeStudentPage setStudentMerged={setStudentMerged} />
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
                path="/teachers/:id"
                element={
                  <RequireAdminAuth>
                    <TeacherProfilePage />
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
                path="/transcript/:id"
                element={
                  <RequireAuth>
                    <TranscriptPage />
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
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
