import { Student, type StudentID } from '../../types/StudentType';
import { useState, useEffect } from 'react';
import { getAllStudents, getStudent } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { useAuth } from '../../auth/AuthProvider';
import styles from './StudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import StudentList from './StudentList/StudentList';
import { Alert, Snackbar } from '@mui/material';

const StudentRosterPage = (): JSX.Element => {
  const [students, setStudents] = useState<Array<Partial<StudentID>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  //Used to handle Deletion alert
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFailure, setOpenFailure] = useState<boolean>(false);
  const handleToClose = (event: any, reason: any) => {
    setOpenSuccess(false);
    setOpenFailure(false);
  };

  const auth = useAuth();

  // Used to detect time in between keystrokes when using the search bar
  let timer: NodeJS.Timeout | null = null;

  function createStudentList() {
    let studentList: Array<Partial<StudentID>> = [];
    for (let i = 1; i <= 51; i++) {
      let student: Partial<StudentID> = {};
      student.id = i.toString();
      student.firstName = 'John';
      student.middleName = 'Doe';
      student.lastName = 'Smith';
      student.email = `student${i}@example.com`;
      studentList.push(student);
    }
    return studentList;
  }

  const fakeStudentList = createStudentList();

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
                setOpenFailure={setOpenFailure}
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

          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={openFailure}
            autoHideDuration={3000}
            onClose={handleToClose}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              Student could not be Removed
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default StudentRosterPage;
