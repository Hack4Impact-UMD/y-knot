import { Student, type StudentID } from '../../types/StudentType';
import { useState, useEffect } from 'react';
import {
  getAllStudents,
  getAllTeachers,
  getStudent,
} from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { useAuth } from '../../auth/AuthProvider';
import styles from './TeacherRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import StudentList from './TeacherList/TeacherList';
import { Teacher, TeacherID } from '../../types/UserType';
import TeacherList from './TeacherList/TeacherList';
import AddTeacher from './AddTeacher/AddTeacher';

const TeacherRosterPage = (): JSX.Element => {
  const [teachers, setTeachers] = useState<Array<Partial<TeacherID>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [addTeacher, setAddTeacher] = useState<boolean>(false);
  const auth = useAuth();
  // Used to detect time in between keystrokes when using the search bar
  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    getAllTeachers()
      .then((allTeachers) => {
        setTeachers(allTeachers);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: any) => {
    if (error || loading) {
      return;
    }
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      setSearch(e.target.value);
    }, 500);
  };

  return (
    <>
      {auth.loading ? (
        // Used to center the loading spinner
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search Teachers"
                onChange={(event) => {
                  handleSearch(event);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch(event);
                  }
                }}
                className={styles.searchBar}
              />
            </div>

            <div className={styles.teacherHeader}>
              <h1 className={styles.heading}>Teacher Roster </h1>
              <button
                className={styles.addTeacher}
                onClick={() => {
                  setAddTeacher(true);
                }}
              >
                Add Teacher
              </button>
              <AddTeacher
                open={addTeacher}
                onClose={() => {
                  setAddTeacher(!addTeacher);
                }}
              />
            </div>
            {loading ? (
              // Used to center the loading spinner
              <div className={styles.failureMessage}>
                <Loading />
              </div>
            ) : error ? (
              <h4 className={styles.failureMessage}>
                Error retrieving students. Please try again later.
              </h4>
            ) : (
              <TeacherList search={search} teachers={teachers} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TeacherRosterPage;
