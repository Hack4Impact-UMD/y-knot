import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './muiTheme';
import {
  addSampleCourse,
  addSampleStudent,
  addStudentInCourse,
} from './backendTesting/test';
import RequireAuth from './auth/RequireAuth/RequireAuth';
import MergeSelectionPage from './pages/MergeSelectionPage/MergeSelectionPage';
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
import TeacherRosterPage from './pages/TeacherRosterPage/TeacherRosterPage';
import MergeStudentPage from './pages/MergeStudentPage/MergeStudentPage';
import { createUser } from './backend/CloudFunctionsCalls';
import { addCourse, addTeacherCourse } from './backend/FirestoreCalls';
import AddCoursePage from './pages/AddCoursesPage/AddCoursePage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { useState } from 'react';
import LeadershipApplicationPage from './pages/LeadershipApplicationPage/LeadershipApplicationPage';

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
