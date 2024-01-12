import { useState, createContext, useContext } from 'react';
import { StudentID } from '../../types/StudentType';
import { useAuth } from '../../auth/AuthProvider';
import styles from './MergeStudentPage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import StudentInformationList from './StudentInformationList/StudentInformationList';
import { HiArrowLongLeft } from 'react-icons/hi2';
import MergedStudentInfoList from './MergedStudentInfoList/MergedStudentInfoList';

interface MergedPropType {
  student: string;
  value: string;
}

interface MergedStudentType {
  mergedStudentName: MergedPropType;
  setMergedStudentName: React.Dispatch<React.SetStateAction<MergedPropType>>;
  mergedStudentEmail: MergedPropType;
  setMergedStudentEmail: React.Dispatch<React.SetStateAction<MergedPropType>>;
  mergedStudentGrade: MergedPropType;
  setMergedStudentGrade: React.Dispatch<React.SetStateAction<MergedPropType>>;
  mergedStudentSchool: MergedPropType;
  setMergedStudentSchool: React.Dispatch<React.SetStateAction<MergedPropType>>;
}

//Used to reset merged student state values
export const EmptyMergedPropType = {
  student: '',
  value: '-',
};

// The Merged Student Context that other components may subscribe to.
// Bypasses the need to pass state and setter to each of the components individually.
const MergedStudentContext = createContext<MergedStudentType>(null!);

const MergeStudentPage = (props: {
  studentA: StudentID;
  studentB: StudentID;
}): JSX.Element => {
  const authContext = useAuth();
  const [mergedStudentName, setMergedStudentName] = useState({
    student: '',
    value: '-',
  });
  const [mergedStudentEmail, setMergedStudentEmail] = useState({
    student: '',
    value: '-',
  });
  const [mergedStudentGrade, setMergedStudentGrade] = useState({
    student: '',
    value: '-',
  });
  const [mergedStudentSchool, setMergedStudentSchool] = useState({
    student: '',
    value: '-',
  });

  return (
    <>
      {authContext.loading ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : authContext?.token?.claims.role === 'TEACHER' ? (
        <div className={styles.invalidAccess}>
          Only admins have access to this page
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            <div className={styles.backButtonContainer}>
              <HiArrowLongLeft size={25} className={styles.leftArrowIcon} />
              <div className={styles.backText}>Back</div>
            </div>

            <div className={styles.header}>
              <h1>Merge Information Selection</h1>
            </div>

            <div className={styles.content}>
              <div className={styles.studentNameContainer}>
                <div className={styles.individualStudentContainer}>
                  <h3>Student A</h3>
                  <div className={styles.studentNameDisplay}>
                    {`${props.studentA.firstName} ${props.studentA.lastName}`}
                  </div>
                </div>
                <div className={styles.individualStudentContainer}>
                  <h3>Student B</h3>
                  <div className={styles.studentNameDisplay}>
                    {`${props.studentB.firstName} ${props.studentB.lastName}`}
                  </div>
                </div>
              </div>

              <MergedStudentContext.Provider
                value={{
                  mergedStudentName,
                  setMergedStudentName,
                  mergedStudentEmail,
                  setMergedStudentEmail,
                  mergedStudentGrade,
                  setMergedStudentGrade,
                  mergedStudentSchool,
                  setMergedStudentSchool,
                }}
              >
                <div className={styles.studentInformationContainer}>
                  <div className={styles.individualInformationContainer}>
                    <StudentInformationList
                      student={props.studentA}
                      whichStudent="Student A"
                    />
                  </div>
                  <div className={styles.individualInformationContainer}>
                    <StudentInformationList
                      student={props.studentB}
                      whichStudent="Student B"
                    />
                  </div>
                </div>

                <div className={styles.mergedStudentContainer}>
                  <h3>Merged Student Profile</h3>
                  <MergedStudentInfoList />
                </div>
              </MergedStudentContext.Provider>

              <button className={styles.confirmButton}>Confirm Merge</button>
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
