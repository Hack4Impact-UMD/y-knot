import styles from './StudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import StudentList from './StudentList/StudentList';
import { Student, StudentID } from '../../types/StudentType';
import { useState, useEffect } from 'react';
import { getAllStudents } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { useAuth } from '../../auth/AuthProvider';

const AdminStudentRosterPage = (): JSX.Element => {
  const [students, setStudents] = useState<Partial<StudentID>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const auth = useAuth();
  // Used to detect time in between keystrokes when using the search bar
  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    getAllStudents()
      .then((allStudents) => {
        const partialStudents: Partial<StudentID>[] = [];
        allStudents.map((currStudent) => {
          const newStudent: Partial<StudentID> = {};
          newStudent.id = currStudent.id;
          newStudent.firstName = currStudent.firstName;
          newStudent.middleName = currStudent.middleName;
          newStudent.lastName = currStudent.lastName;
          partialStudents.push(newStudent);
        });
        setStudents(partialStudents);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: any) => {
    if (error || loading) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      setSearch(e.target.value);
    }, 500);
  };

  return (
    <div className={styles.parentContainer}>
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
                placeholder="Search Students"
                onChange={(e) => {
                  handleSearch(e);
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

            <h1 className={styles.heading}>Student Roster</h1>
            {loading ? (
              // Used to center the loading spinner
              <div className={styles.failureMessage}>
                <Loading />
              </div>
            ) : error ? (
              <div className={styles.failureMessage}>
                Error retrieving students. Please try again later.
              </div>
            ) : (
              <StudentList search={search} students={students} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStudentRosterPage;
