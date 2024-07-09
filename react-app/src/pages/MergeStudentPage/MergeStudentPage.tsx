import {
  useState,
  useLayoutEffect,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { StudentID } from '../../types/StudentType';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MergeStudentPage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import WestRounded from '@mui/icons-material/WestRounded';
import StudentInformationList from './StudentInformationList/StudentInformationList';
import MergedStudentInfoList from './MergedStudentInfoList/MergedStudentInfoList';

interface MergedPropType {
  name: string;
  addr: string;
  email: string;
  phone: string;
  birthDate: string;
  gradeLevel: string;
  schoolName: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
}

interface MergedStudentType {
  mergedStudent: MergedPropType;
  setMergedStudent: React.Dispatch<React.SetStateAction<MergedPropType>>;
}

// The Merged Student Context that other components may subscribe to.
// Bypasses the need to pass state and setter to each of the components individually.
const MergedStudentContext = createContext<MergedStudentType>(null!);

// TODO: Add merge student functionality + check that all fields are selected
const MergeStudentPage = (): JSX.Element => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowSize();
  const [studentA, setStudentA] = useState<StudentID>();
  const [studentB, setStudentB] = useState<StudentID>();
  const [mergedStudent, setMergedStudent] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gradeLevel: '',
    schoolName: '',
    addr: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
  });

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.studentA && location.state.studentB) {
      setStudentA(location.state.studentA);
      setStudentB(location.state.studentB);
    } else {
      navigate('/students/merge');
    }
  }, []);

  function useWindowSize() {
    const [size, setSize] = useState(window.innerWidth);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  return (
    <>
      {authContext.loading ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : authContext?.token?.claims.role !== 'ADMIN' ? (
        <div className={styles.invalidAccess}>
          Only admins have access to this page
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            <div>
              <button
                className={styles.backButton}
                onClick={() => {
                  navigate('/students/merge');
                }}
              >
                <WestRounded
                  style={{ color: '#757575', marginRight: '10px' }}
                />
                Back
              </button>
            </div>

            <div className={styles.header}>
              <h1>Merge Information Selection</h1>
            </div>

            <div className={styles.content}>
              <MergedStudentContext.Provider
                value={{
                  mergedStudent,
                  setMergedStudent,
                }}
              >
                {windowWidth > 1000 ? (
                  <>
                    <div
                      className={`${styles.individualStudentContainer} ${styles.studentA}`}
                    >
                      <h3>Student A</h3>
                      <div className={styles.studentNameDisplay}>
                        {`${studentA?.firstName} ${studentA?.lastName}`}
                      </div>
                    </div>
                    <div
                      className={`${styles.individualStudentContainer} ${styles.studentB}`}
                    >
                      <h3>Student B</h3>
                      <div className={styles.studentNameDisplay}>
                        {`${studentB?.firstName} ${studentB?.lastName}`}
                      </div>
                    </div>

                    <div className={styles.studentInformationContainer}>
                      <div className={styles.studentAContainer}>
                        {studentA && (
                          <StudentInformationList
                            student={studentA}
                            whichStudent="Student A"
                          />
                        )}
                      </div>
                      <div className={styles.studentBContainer}>
                        {studentB && (
                          <StudentInformationList
                            student={studentB}
                            whichStudent="Student B"
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`${styles.individualStudentContainer} ${styles.studentA}`}
                    >
                      <h3>Student A</h3>
                      <div className={styles.studentNameDisplay}>
                        {`${studentA?.firstName} ${studentA?.lastName}`}
                      </div>
                    </div>
                    <div className={styles.studentAContainer}>
                      {studentA && (
                        <StudentInformationList
                          student={studentA}
                          whichStudent="Student A"
                        />
                      )}
                    </div>

                    <div
                      className={`${styles.individualStudentContainer} ${styles.studentB}`}
                    >
                      <h3>Student B</h3>
                      <div className={styles.studentNameDisplay}>
                        {`${studentB?.firstName} ${studentB?.lastName}`}
                      </div>
                    </div>

                    <div className={styles.studentBContainer}>
                      {studentB && (
                        <StudentInformationList
                          student={studentB}
                          whichStudent="Student B"
                        />
                      )}
                    </div>
                  </>
                )}

                <div className={styles.mergedStudentContainer}>
                  <h2 className={styles.mergeTitle}>Merged Student Profile</h2>
                  <div className={styles.mergeContainer}>
                    <MergedStudentInfoList
                      studentA={studentA!}
                      studentB={studentB!}
                    />
                  </div>
                </div>
              </MergedStudentContext.Provider>

              <div className={styles.confirmButtonContainer}>
                <button className={styles.confirmButton}>Confirm Merge</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MergeStudentPage;

export const useMergedStudentContext = () => {
  return useContext(MergedStudentContext);
};
