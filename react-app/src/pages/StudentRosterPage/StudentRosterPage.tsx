import { useState, useEffect } from 'react';
import { getAllStudents } from '../../backend/FirestoreCalls';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/AuthProvider';
import { Alert, Snackbar } from '@mui/material';
import { StudentID } from '../../types/StudentType';
import { TeacherID } from '../../types/UserType';
import styles from './StudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import StudentList from './StudentList/StudentList';

const StudentRosterPage = (): JSX.Element => {
  const [students, setStudents] = useState<Array<Partial<StudentID>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [teacher, setTeacher] = useState<TeacherID | undefined>(undefined);
  const auth = useAuth();
  const navigate = useNavigate();

  // Used to handle Deletion alert
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const handleToClose = (event: any, reason: any) => {
    setOpenSuccess(false);
  };

  // Used to detect time in between keystrokes when using the search bar
  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    setLoading(true);

    getAllStudents()
      .then((allStudents) => {
        const partialStudents: Array<Partial<StudentID>> = [];
        allStudents.map((currStudent) => {
          const newStudent: Partial<StudentID> = {};
          newStudent.id = currStudent.id;
          newStudent.firstName = currStudent.firstName;
          newStudent.middleName = currStudent.middleName;
          newStudent.lastName = currStudent.lastName;
          newStudent.email = currStudent.email;
          newStudent.courseInformation = currStudent.courseInformation || [];
          partialStudents.push(newStudent);
        });
        setStudents(partialStudents);
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
                placeholder="Search Students"
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
              {auth?.token?.claims.role === 'ADMIN' ? (
                <button
                  className={styles.mergeButton}
                  onClick={() => {
                    navigate(`/students/merge`);
                  }}
                >
                  Merge Students
                </button>
              ) : (
                <></>
              )}
            </div>

            <h1 className={styles.heading}>Student Roster</h1>
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
              <StudentList
                search={search}
                students={students}
                setStudents={setStudents}
                setOpenSuccess={setOpenSuccess}
                teacher={teacher}
              />
            )}
          </div>
          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={openSuccess}
            autoHideDuration={3000}
            onClose={handleToClose}
          >
            <Alert severity="success" sx={{ width: '100%' }}>
              Student was Successfully Removed
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default StudentRosterPage;
