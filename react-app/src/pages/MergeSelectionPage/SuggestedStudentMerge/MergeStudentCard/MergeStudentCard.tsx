import { useEffect, useState } from 'react';
import {
  getStudentsFromList,
  deleteStudentMatch,
} from '../../../../backend/FirestoreCalls';
import { StudentID } from '../../../../types/StudentType';
import { useNavigate } from 'react-router-dom';
import styles from './MergeStudentCard.module.css';
import trashIcon from '../../../../assets/trash.svg';

interface StudentPair {
  studentAId: StudentID;
  studentBId: StudentID;
}

const blankStudent: StudentID = {
  id: '',
  firstName: '',
  middleName: '',
  lastName: '',
  addrFirstLine: '',
  city: '',
  state: '',
  zipCode: '',
  email: '',
  phone: 0,
  guardianFirstName: '',
  guardianLastName: '',
  guardianEmail: '',
  guardianPhone: 0,
  birthDate: '',
  gradeLevel: '',
  schoolName: '',
  courseInformation: [],
};

const MergeStudentCard = (props: {
  studentAId: StudentID;
  studentBId: StudentID;
  studentMatches: Array<StudentPair>;
  setStudentMatches: Function;
  setRemoveSuccess: Function;
  setRemoveError: Function;
}): JSX.Element => {
  const [studentA, setStudentA] = useState<StudentID>(props.studentAId);
  const [studentB, setStudentB] = useState<StudentID>(props.studentBId);
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setStudentA(props.studentAId);
    setStudentB(props.studentBId);
    //   if (props.studentAId && props.studentBId) {
    //     getStudentsFromList([props.studentAId, props.studentBId])
    //       .then((data) => {
    //         setStudentA(data[0] || blankStudent);
    //         setStudentB(data[1] || blankStudent);
    //         console.log('start');
    //         console.log(props.studentAId);
    //         console.log(props.studentBId);
    //       })
    //       .catch(() => {
    //         setError(true);
    //         console.log('Failed to get Student Matches');
    //       });
    //   }
  }, [props.studentAId, props.studentBId]);

  const handleMerge = () => {
    navigate('/students/mergestudent', {
      state: {
        studentA: studentA,
        studentB: studentB,
      },
    });
    // TODO: handle merge (will there be automation?)
  };

  const deleteSuggestion = () => {
    // TODO: handle delete suggestion + confirmation?
    deleteStudentMatch(props.studentAId.id, props.studentBId.id)
      .then(() => {
        props.setRemoveSuccess(true);
        console.log('before');
        console.log(props.studentMatches);
        console.log(props.studentAId);
        console.log(props.studentBId);
        let newMatches = props.studentMatches.filter(
          (match) =>
            !(
              match.studentAId.id == props.studentAId.id &&
              match.studentBId.id == props.studentBId.id
            ),
        );
        console.log('after');
        console.log(newMatches);
        props.setStudentMatches(newMatches);
      })
      .catch(() => {
        props.setRemoveError(true);
      });
  };

  /* Return a card that displays both the student names and info + merge button */
  return (
    <>
      {error ? (
        <></>
      ) : (
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
                {studentA.firstName} {studentA.lastName}
              </p>
            </div>
            <div className={styles.studentAInfo}>
              <p className={styles.studentInformationHeader}>
                Student Information
              </p>
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
              <p className={styles.studentInformationHeader}>
                Student Information
              </p>
              <p>{studentB?.email || 'N/A'}</p>
              <p>{studentB?.addrFirstLine || 'N/A'}</p>
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
      )}
    </>
  );
};

export default MergeStudentCard;
