import { deleteStudentMatch } from '../../../../backend/FirestoreCalls';
import { StudentID } from '../../../../types/StudentType';
import { useNavigate } from 'react-router-dom';
import styles from './MergeStudentCard.module.css';
import trashIcon from '../../../../assets/trash.svg';

interface StudentPair {
  studentA: StudentID;
  studentB: StudentID;
}

const MergeStudentCard = (props: {
  studentA: StudentID;
  studentB: StudentID;
  studentMatches: Array<StudentPair>;
  setStudentMatches: Function;
  setRemoveSuccess: Function;
  setRemoveError: Function;
}): JSX.Element => {
  const navigate = useNavigate();

  const handleMerge = () => {
    navigate('/students/mergestudent', {
      state: {
        studentA: props.studentA,
        studentB: props.studentB,
      },
    });
    // TODO: handle merge (will there be automation?)
  };

  const deleteSuggestion = () => {
    deleteStudentMatch(props.studentA.id, props.studentB.id)
      .then(() => {
        props.setRemoveSuccess(true);
        let newMatches = props.studentMatches.filter(
          (match) =>
            !(
              match.studentA.id == props.studentA.id &&
              match.studentB.id == props.studentB.id
            ),
        );
        props.setStudentMatches(newMatches);
      })
      .catch(() => {
        props.setRemoveError(true);
      });
  };

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
        <button className={styles.mergeBtn} onClick={handleMerge}>
          Merge
        </button>
      </div>
      <div className={styles.studentAContainer}>
        <div className={styles.studentAName}>
          <p>
            {props.studentA.firstName} {props.studentA.lastName}
          </p>
        </div>
        <div className={styles.studentAInfo}>
          <p className={styles.studentInformationHeader}>Student Information</p>
          <p>{props.studentA?.email || 'N/A'}</p>
          <p>{props.studentA?.addrFirstLine || 'N/A'}</p>
        </div>
      </div>
      <div className={styles.studentBContainer}>
        <div className={styles.studentBName}>
          <p>
            {props.studentB?.firstName} {props.studentB?.lastName}
          </p>
        </div>
        <div className={styles.studentBInfo}>
          <p className={styles.studentInformationHeader}>Student Information</p>
          <p>{props.studentB?.email || 'N/A'}</p>
          <p>{props.studentB?.addrFirstLine || 'N/A'}</p>
        </div>
      </div>
      <div className={styles.deleteSuggestionContainer}>
        <button
          className={styles.deleteSuggestionBtn}
          onClick={deleteSuggestion}
        >
          <img src={trashIcon} className={styles.trashIcon} />
          Delete Suggestion
        </button>
      </div>
    </div>
  );
};

export default MergeStudentCard;
