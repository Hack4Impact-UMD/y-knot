import { useState, useEffect } from 'react';
import { getAllTeachers } from '../../../backend/FirestoreCalls';
import { useAuth } from '../../../auth/AuthProvider';
import { TeacherID, type YKNOTUser } from '../../../types/UserType';
import styles from '../ClassTeachers/ClassTeachers.module.css';
import Loading from '../../../components/LoadingScreen/Loading';

const ClassTeachers = (props: { teachers: Array<TeacherID> }): JSX.Element => {
  const [teacherList, setTeacherList] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const authContext = useAuth();

  return (
    <div>
      {props.teachers.length === 0 ? (
        <h4 className={styles.message}>No Teachers Currently in Roster</h4>
      ) : error ? (
        <h4 className={styles.message}>
          Error retrieving teachers. Please try again later.
        </h4>
      ) : (
        <>
          <div className={styles.teachersContainer}>
            {props.teachers.map((teacher, i) => {
              const roundTop = i === 0 ? styles.roundTop : '';
              const roundBottom =
                i === props.teachers.length - 1 ? styles.roundBottom : '';
              return (
                <div
                  key={i}
                  className={`${styles.box} ${roundTop} ${roundBottom}`}
                >
                  <p className={styles.name}>{teacher.name}</p>
                </div>
              );
            })}
          </div>
          <div className={styles.bottomLevel}>
            <button className={styles.addButton}>Add</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassTeachers;
