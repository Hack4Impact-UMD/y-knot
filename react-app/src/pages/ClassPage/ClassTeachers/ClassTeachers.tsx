import { useState, useEffect } from 'react';
import { getAllTeachers } from '../../../backend/FirestoreCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { type YKNOTUser } from '../../../types/UserType';
import styles from '../ClassTeachers/ClassTeachers.module.css';
import Loading from '../../../components/LoadingScreen/Loading';

const ClassTeachers = (): JSX.Element => {
  const [teachers, setTeachers] = useState<Array<Partial<YKNOTUser>>>([]);
  const [teacherList, setTeacherList] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const authContext = useAuth();

  useEffect(() => {
    getAllTeachers()
      .then((allTeachers) => {
        const partialTeachers: Array<Partial<YKNOTUser>> = allTeachers.map(
          (currTeacher) => ({
            name: currTeacher.name,
            auth_id: currTeacher.auth_id,
          }),
        );
        setTeachers(partialTeachers);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    const list = teachers.map((teacher, i) => {
      const roundTop = i === 0 ? styles.roundTop : '';
      const roundBottom = i === teachers.length - 1 ? styles.roundBottom : '';
      return (
        <div key={i} className={`${styles.box} ${roundTop} ${roundBottom}`}>
          <p className={styles.name}>{teacher.name}</p>
        </div>
      );
    });
    setTeacherList(list);
  }, [teachers]);

  return (
    <>
      {authContext?.loading || loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div>
          {teachers.length === 0 ? (
            <h4 className={styles.message}>No Teachers Currently in Roster</h4>
          ) : error ? (
            <h4 className={styles.message}>
              Error retrieving teachers. Please try again later.
            </h4>
          ) : (
            <>
              <div className={styles.teachersContainer}>{teacherList}</div>
              <div className={styles.bottomLevel}>
                <button className={styles.addButton}>Add</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ClassTeachers;
