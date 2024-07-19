import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { StudentID } from '../../../types/StudentType';
import {
  getAllStudentMatches,
  getStudent,
} from '../../../backend/FirestoreCalls';
import styles from './SuggestedStudentMerge.module.css';
import MergeStudentCard from './MergeStudentCard/MergeStudentCard';
import Loading from '../../../components/LoadingScreen/Loading';

interface StudentPair {
  studentAId: StudentID;
  studentBId: StudentID;
}

const SuggestedStudentMerge = (): JSX.Element => {
  const [studentMatches, setStudentMatches] = useState<Array<StudentPair>>([]);
  const [suggestedMatches, setSuggestedMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [removeError, setRemoveError] = useState<boolean>(false);

  // useEffect(() => {
  //   getAllStudentMatches()
  //     .then((allMatches) => {
  //       const studentPairs: Array<StudentPair> = [];
  //       allMatches.forEach((studentMatch) => {
  //         studentMatch.matches.forEach((student) => {
  //           studentPairs.push({
  //             studentAId: studentMatch.studentOne,
  //             studentBId: student,
  //           });
  //         });
  //       });
  //       setStudentMatches(studentPairs);
  //     })
  //     .catch(() => {
  //       setError(true);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    getAllStudentMatches()
      .then((allMatches) => {
        const promises = allMatches.map((studentMatch) => {
          return getStudent(studentMatch.studentOne).then((studentOne) => {
            const matchPromises = studentMatch.matches.map((studentTwoId) => {
              return getStudent(studentTwoId).then((studentTwo) => {
                return {
                  studentAId: { ...studentOne, id: studentMatch.studentOne },
                  studentBId: { ...studentTwo, id: studentTwoId },
                };
              });
            });
            return Promise.all(matchPromises);
          });
        });
        return Promise.all(promises);
      })
      .then((results) => {
        const studentPairs = results.flat();
        setStudentMatches(studentPairs);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log('useeffect');
    console.log(studentMatches);
    const matchCards = studentMatches.map(
      ({ studentAId, studentBId }, index) => (
        <div key={index} className={styles.cardContainer}>
          <MergeStudentCard
            studentAId={studentAId}
            studentBId={studentBId}
            studentMatches={studentMatches}
            setStudentMatches={setStudentMatches}
            setRemoveSuccess={setRemoveSuccess}
            setRemoveError={setRemoveError}
          />
        </div>
      ),
    );
    setSuggestedMatches(matchCards);
  }, [removeSuccess, studentMatches]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : error ? (
        <h4 className={styles.failureMessage}>
          Error retrieving student matches. Please try again later.
        </h4>
      ) : (
        <>
          {/* {studentMatches.map(({ studentAId, studentBId }, index) => (
            <div key={index} className={styles.cardContainer}>
              <MergeStudentCard
                studentAId={studentAId}
                studentBId={studentBId}
                studentMatches={studentMatches}
                setStudentMatches={setStudentMatches}
                setRemoveSuccess={setRemoveSuccess}
                setRemoveError={setRemoveError}
              />
            </div>
          ))} */}
          {suggestedMatches}
          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={removeSuccess}
            autoHideDuration={3000}
            onClose={() => {
              setRemoveSuccess(false);
            }}
          >
            <Alert severity="success" sx={{ width: '100%' }}>
              Suggestion was successfully removed
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            open={removeError}
            autoHideDuration={3000}
            onClose={() => {
              setRemoveError(false);
            }}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              There was an error removing the suggestion
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default SuggestedStudentMerge;
