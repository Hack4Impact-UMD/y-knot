import { Student } from '../../../types/StudentType';
import styles from './StudentInformationList.module.css';
import { useMergedStudentContext } from '../MergeStudentPage';
import { EmptyMergedPropType } from '../MergeStudentPage';

const StudentInformationList = (props: {
  student: Student;
  whichStudent: string;
}) => {
  //Subscribe to merged student information from context provider
  const MergedStudentContext = useMergedStudentContext();

  return (
    <div className={styles.inputs}>
      <div className={`${styles.box} ${styles.roundTop}`}>
        <p className={styles.boxTitle}>Name</p>
        <p className={styles.boxContent}>
          {`${props.student.firstName} ${props.student.lastName}`}
        </p>
        <p className={styles.checkBoxContainer}>
          <input
            type="checkbox"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudentName.student
            }
            onChange={() => {
              if (
                MergedStudentContext.mergedStudentName.student !==
                props.whichStudent
              ) {
                //Other checkbox is selected
                //"Unselect" previous by changing value to current student
                MergedStudentContext.setMergedStudentName({
                  student: props.whichStudent,
                  value: `${props.student.firstName} ${props.student.lastName}`,
                });
              } else {
                //"Unselect" the current student by setting to empty prop type
                MergedStudentContext.setMergedStudentName(EmptyMergedPropType);
              }
            }}
          />
        </p>
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Email</p>
        <p className={styles.boxContent}>{props.student.email}</p>
        <p className={styles.checkBoxContainer}>
          <input
            type="checkbox"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudentEmail.student
            }
            onChange={() => {
              if (
                MergedStudentContext.mergedStudentEmail.student !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudentEmail({
                  student: props.whichStudent,
                  value: props.student.email,
                });
              } else {
                MergedStudentContext.setMergedStudentEmail(EmptyMergedPropType);
              }
            }}
          />
        </p>
      </div>
      <div className={styles.box}>
        <p className={styles.boxTitle}>Grade</p>
        <p className={styles.boxContent}>
          {props.student.gradeLevel ?? 'No Given Grade'}
        </p>
        <p className={styles.checkBoxContainer}>
          <input
            type="checkbox"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudentGrade.student
            }
            onChange={() => {
              if (
                MergedStudentContext.mergedStudentGrade.student !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudentGrade({
                  student: props.whichStudent,
                  value: props.student.gradeLevel ?? 'No Given Grade',
                });
              } else {
                MergedStudentContext.setMergedStudentGrade(EmptyMergedPropType);
              }
            }}
          />
        </p>
      </div>
      <div className={`${styles.box} ${styles.roundBottom}`}>
        <p className={styles.boxTitle}>School</p>
        <p className={styles.boxContent}>
          {props.student.schoolName ?? 'No Given School'}
        </p>
        <p className={styles.checkBoxContainer}>
          <input
            type="checkbox"
            checked={
              props.whichStudent ===
              MergedStudentContext.mergedStudentSchool.student
            }
            onChange={() => {
              if (
                MergedStudentContext.mergedStudentSchool.student !==
                props.whichStudent
              ) {
                MergedStudentContext.setMergedStudentSchool({
                  student: props.whichStudent,
                  value: props.student.schoolName ?? 'No Given School',
                });
              } else {
                MergedStudentContext.setMergedStudentSchool(
                  EmptyMergedPropType,
                );
              }
            }}
          />
        </p>
      </div>
    </div>
  );
};

export default StudentInformationList;
