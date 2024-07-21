import {
  useState,
  useLayoutEffect,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { Student, StudentID } from '../../types/StudentType';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import {
  getCourse,
  mergeStudents,
  deleteStudentMatch,
} from '../../backend/FirestoreCalls';
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

const MergeStudentPage = ({ setStudentMerged }: any): JSX.Element => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowSize();
  const [openError, setOpenError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
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

  function confirmMergeStudents() {
    // Alert if no student is selected for a field
    if (Object.values(mergedStudent).indexOf('') > -1) {
      setErrorMsg('Please select a student for each field');
      setOpenError(true);
    } else {
      // Create merged student
      let newStudent: Student = {
        firstName:
          mergedStudent.name === 'Student A'
            ? studentA!.firstName
            : studentB!.firstName,
        middleName:
          mergedStudent.name === 'Student A'
            ? studentA!.middleName
            : studentB!.middleName,
        lastName:
          mergedStudent.name === 'Student A'
            ? studentA!.lastName
            : studentB!.lastName,
        addrFirstLine:
          mergedStudent.addr === 'Student A'
            ? studentA!.addrFirstLine
            : studentB!.addrFirstLine,
        addrSecondLine:
          mergedStudent.addr === 'Student A'
            ? studentA!.addrSecondLine
            : studentB!.addrSecondLine,
        city:
          mergedStudent.addr === 'Student A' ? studentA!.city : studentB!.city,
        state:
          mergedStudent.addr === 'Student A'
            ? studentA!.state
            : studentB!.state,
        zipCode:
          mergedStudent.addr === 'Student A'
            ? studentA!.zipCode
            : studentB!.zipCode,
        email:
          mergedStudent.email === 'Student A'
            ? studentA!.email
            : studentB!.email,
        phone:
          mergedStudent.phone === 'Student A'
            ? studentA!.phone
            : studentB!.phone,
        birthDate:
          mergedStudent.birthDate === 'Student A'
            ? studentA!.birthDate
            : studentB!.birthDate,
        gradeLevel:
          mergedStudent.gradeLevel === 'Student A'
            ? studentA!.gradeLevel
            : studentB!.gradeLevel,
        schoolName:
          mergedStudent.schoolName === 'Student A'
            ? studentA!.schoolName
            : studentB!.schoolName,
        guardianFirstName:
          mergedStudent.guardianName === 'Student A'
            ? studentA!.guardianFirstName
            : studentB!.guardianFirstName,
        guardianLastName:
          mergedStudent.guardianName === 'Student A'
            ? studentA!.guardianLastName
            : studentB!.guardianLastName,
        guardianEmail:
          mergedStudent.guardianEmail === 'Student A'
            ? studentA!.guardianEmail
            : studentB!.guardianEmail,
        guardianPhone:
          mergedStudent.guardianPhone === 'Student A'
            ? studentA!.guardianPhone
            : studentB!.guardianPhone,
        courseInformation: [],
      };

      // Check if students are enrolled in the same course
      let duplicateClasses = studentA!.courseInformation.filter((student1) =>
        studentB!.courseInformation.some(
          (student2) => student2.id === student1.id,
        ),
      );

      if (duplicateClasses.length > 0) {
        getCourse(duplicateClasses[0].id).then((courseData) => {
          setErrorMsg(
            `Both students are enrolled in ${courseData.name}. Please remove one from the course and try again.`,
          );
          setOpenError(true);
        });
      } else {
        newStudent.courseInformation = [
          ...studentA!.courseInformation,
          ...studentB!.courseInformation,
        ];

        // Merge students
        mergeStudents(studentA!.id, studentB!.id, newStudent).then(() => {
          // Remove from merge suggestions
          deleteStudentMatch(studentA!.id, studentB!.id);
          deleteStudentMatch(studentB!.id, studentA!.id);
          setStudentMerged(true);
          navigate('/students/merge');
        });
      }
    }
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
                <button
                  className={styles.confirmButton}
                  onClick={confirmMergeStudents}
                >
                  Confirm Merge
                </button>
              </div>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={openError}
            autoHideDuration={5000}
            onClose={() => {
              setOpenError(false);
            }}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              {errorMsg}
            </Alert>
          </Snackbar>
          <Snackbar />
        </>
      )}
    </>
  );
};

export default MergeStudentPage;

export const useMergedStudentContext = () => {
  return useContext(MergedStudentContext);
};
