import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import RequireAdminAuth from './auth/RequireAdminAuth/RequireAdminAuth';
import RequireAuth from './auth/RequireAuth/RequireAuth';
import { addTeacherCourse } from './backend/FirestoreCalls';
import FileUpload from './components/FileUpload/FileUpload';
import NavigationBar from './components/NavigationBar/NavigationBar';
import { theme } from './muiTheme';
import AddCoursePage from './pages/AddCoursesPage/AddCoursePage';
import CertificatePage from './pages/CertificatePage/CertificatePage';
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
                  <RequireAuth>
                    <AddCoursePage setCourseAdded={setCourseAdded} />
                  </RequireAuth>
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
                    <StudentRosterPage />
                  </RequireAuth>
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
                    <MergeSelectionPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/students/mergestudent"
                element={
                  <RequireAdminAuth>
                    <MergeStudentPage />
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
                path="/nav"
                element={
                  <RequireAuth>
                    <NavigationBar />
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
                path="/certificate/:id"
                element={
                  <RequireAuth>
                    <CertificatePage name="Fiona Love" course="Math" />
                  </RequireAuth>
                }
              />
              <Route
                path="/testfunctions"
                element={
                  <RequireAuth>
                    <button
                      onClick={
                        () => {
                          addTeacherCourse(
                            'Li3x7GK5XwAk8UqhskKV',
                            '629B8D6g5MFK8CoupeIt',
                          );
                        }
                        //   async () => {
                        //   const course = addCourse({
                        //     name: 'Digital Marketing',
                        //     startDate: '2022-08-14',
                        //     endDate: '2023-10-30',
                        //     students: [],
                        //     courseType: 'PROGRAM',
                        //     teachers: [],
                        //     leadershipApp: false,
                        //     formId: '',
                        //     introEmail: { content: 'this is an intro email.', files: [] },
                        //     attendance: [],
                        //     homeworks: []
                        //   })
                        //   addStudentInCourse(await course);
                        // }
                      }
                    ></button>
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
