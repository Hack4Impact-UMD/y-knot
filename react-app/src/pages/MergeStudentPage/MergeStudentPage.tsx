import { useState } from 'react';
import { StudentID } from '../../types/StudentType';
import { useAuth } from '../../auth/AuthProvider';
import styles from './MergeStudentPage.module.css';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import StudentInformationList from './StudentInformationList/StudentInformationList';
import { HiArrowLongLeft } from 'react-icons/hi2';
import MergedStudentInfoList from './MergedStudentInfoList/MergedStudentInfoList';

const MergeStudentPage = (props: {
  studentA: StudentID;
  studentB: StudentID;
}): JSX.Element => {
  const authContext = useAuth();
  const [mergedStudentName, setMergedStudentName] = useState('');
  const [mergedStudentEmail, setMergedStudentEmail] = useState('');
  const [mergedStudentGrade, setMergedStudentGrade] = useState('');
  const [mergedStudentSchool, setMergedStudentSchool] = useState('');

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

              <div className={styles.studentInformationContainer}>
                <div className={styles.individualInformationContainer}>
                  <StudentInformationList student={props.studentA} />
                </div>
                <div className={styles.individualInformationContainer}>
                  <StudentInformationList student={props.studentB} />
                </div>
              </div>

              <div className={styles.mergedStudentContainer}>
                <h3>Merged Student Profile</h3>
                <MergedStudentInfoList mergedStudent={props.studentA} />
              </div>

              <button className={styles.confirmButton}>Confirm Merge</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MergeStudentPage;
