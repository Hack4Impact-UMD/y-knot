import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { getAllTeachers } from '../../backend/FirestoreCalls';
import { type TeacherID } from '../../types/UserType';
import { Alert, Snackbar } from '@mui/material';
import styles from './TeacherRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import TeacherList from './TeacherList/TeacherList';
import AddTeacher from './AddTeacher/AddTeacher';

const TeacherRosterPage = (): JSX.Element => {
  const [addTeacher, setAddTeacher] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Array<Partial<TeacherID>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [openSuccess, setOpenSuccess] = useState<boolean>(false); // Used to handle Deletion alert
  const auth = useAuth();

  const handleToClose = () => {
    setOpenSuccess(false);
  };

  // Used to detect time in between keystrokes when using the search bar
  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    setLoading(true);

    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<TeacherID>> = [];
        allTeachers.map((currTeacher) => {
          const newTeacher: Partial<TeacherID> = {};
          newTeacher.name = currTeacher.name;
          newTeacher.auth_id = currTeacher.auth_id;
          newTeacher.id = currTeacher.id;
          newTeacher.courses = [];
          newTeacher.email = currTeacher.email;
          partialTeachers.push(newTeacher);
        });
        setTeachers(partialTeachers);
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
              <h1 className={styles.heading}>Teacher Roster</h1>
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
                Error retrieving teachers. Please try again later.
              </h4>
            ) : (
              <TeacherList
                search={search}
                teachers={teachers}
                setTeachers={setTeachers}
                setOpenSuccess={setOpenSuccess}
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
              Teacher was Successfully Removed
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default TeacherRosterPage;
