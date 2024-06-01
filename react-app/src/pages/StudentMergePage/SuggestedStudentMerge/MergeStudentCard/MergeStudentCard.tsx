import { StudentID } from '../../../../types/StudentType';
import styles from './MergeStudentCard.module.css';
import trashIcon from '../../../../assets/trash.svg';

interface StudentPair {
  studentA: StudentID;
  studentB: StudentID;
}

const MergeStudentCard = ({ studentA, studentB }: StudentPair): JSX.Element => {
  /* Return a card that displays both the student names and info + merge button */
  return (
    <div className={styles.container}>
      <div className={styles.studentA}>
        <h2>Student A</h2>
      </div>
      <div className={styles.studentB}>
        <h2>Student B</h2>
      </div>
      <div className={styles.mergeBtnContainer}>
        <button className={styles.mergeBtn}>Merge</button>
      </div>
      <div className={styles.studentAContainer}>
        <div className={styles.studentAName}>
          <p>
            {studentA.firstName} {studentA.lastName}
          </p>
        </div>
        <div className={styles.studentAInfo}>
          <p className={styles.studentInformationHeader}>Student Information</p>
          <p>{studentA?.email || 'N/A'}</p>
          <p>{studentA?.addrFirstLine || 'N/A'}</p>
        </div>
      </div>
      <div className={styles.studentBContainer}>
        <div className={styles.studentBName}>
          <p>
            {studentB?.firstName} {studentB?.lastName}
          </p>
        </div>
        <div className={styles.studentBInfo}>
          <p className={styles.studentInformationHeader}>Student Information</p>
          <p>{studentB?.email || 'N/A'}</p>
          <p>{studentB?.addrFirstLine || 'N/A'}</p>
        </div>
      </div>
      <div className={styles.deleteSuggestionContainer}>
        <button className={styles.deleteSuggestionBtn}>
          <img src={trashIcon} className={styles.trashIcon} />
          Delete Suggestion
        </button>
      </div>
    </div>
  );
};

export default MergeStudentCard;
